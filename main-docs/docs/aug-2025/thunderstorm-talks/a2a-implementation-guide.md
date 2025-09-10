---
title: A2A Implementation Guide
description: Production-minded patterns for discovery, routing, caching, attribution, and observability
date: 2025-08-14
tags: [a2a, json-rpc, langgraph, otel, caching, redis, security]
sidebar_position: 2
---

# A2A Implementation Guide

Production patterns for Agent-to-Agent protocol deployment, adapted from AIMUG's August lightning talk with real-world results.

## Architecture Overview

```
Discovery → Gateway → Skill Router → Cache → Content
```

Map skills to your content collections and APIs for agent-discoverable services.

## Core Components

### 1. Agent Card (Discovery Layer)

Enhanced agent card with comprehensive capabilities:

```json
{
  "schema_version": "2025-08",
  "service": {
    "name": "Production Blog A2A",
    "endpoint": "/api/a2a/service",
    "rate_limit": {
      "burst": 20,
      "per_minute": 100,
      "per_hour": 2000
    }
  },
  "capabilities": [
    {
      "method": "blog.get_metadata",
      "cache": {"ttl": 3600, "public": true}
    },
    {
      "method": "blog.list_posts",
      "params": {
        "limit": "number",
        "offset": "number?",
        "tag": "string?",
        "author": "string?"
      },
      "cache": {"ttl": 300, "public": true}
    },
    {
      "method": "blog.get_post",
      "params": {"slug": "string"},
      "cache": {"ttl": 900, "public": true}
    },
    {
      "method": "blog.search_posts",
      "params": {
        "q": "string",
        "limit": "number?",
        "fields": "array?"
      }
    }
  ],
  "legal": {
    "license": "CC-BY-4.0",
    "attribution_required": true,
    "attribution_format": "Source: {title} by {author} - {url}"
  },
  "metadata": {
    "version": "1.0.0",
    "contact": "api@yourdomain.com",
    "documentation": "https://yourdomain.com/docs/a2a"
  }
}
```

### 2. JSON-RPC Gateway

Centralized validation, error shaping, and policy enforcement:

```typescript
// Advanced gateway with middleware pipeline
import { z } from 'zod';
import { Redis } from 'ioredis';
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('a2a-gateway');
const redis = new Redis(process.env.REDIS_URL);

// Request validation schema
const RpcRequestSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number(), z.null()]).optional(),
  method: z.string(),
  params: z.any().optional()
});

// Middleware pipeline
class A2AGateway {
  private middlewares: Middleware[] = [];
  
  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }
  
  async handle(req: Request): Promise<Response> {
    const span = tracer.startSpan('a2a.request');
    
    try {
      // Parse and validate
      const body = await req.json();
      const rpcReq = RpcRequestSchema.parse(body);
      
      span.setAttributes({
        'rpc.method': rpcReq.method,
        'rpc.id': String(rpcReq.id ?? 'null')
      });
      
      // Run middleware pipeline
      let context: Context = {
        request: rpcReq,
        clientIp: req.headers.get('x-forwarded-for') ?? 'unknown',
        origin: req.headers.get('origin'),
        span
      };
      
      for (const middleware of this.middlewares) {
        context = await middleware(context);
        if (context.response) break;
      }
      
      return context.response ?? errorResponse(
        rpcReq.id,
        -32601,
        'Method not found'
      );
      
    } catch (error) {
      span.recordException(error as Error);
      return errorResponse(null, -32603, 'Internal error');
    } finally {
      span.end();
    }
  }
}
```

### 3. Skill Router

Method to handler mapping with caching rules:

```typescript
class SkillRouter implements Middleware {
  private handlers = new Map<string, Handler>();
  
  register(method: string, handler: Handler) {
    this.handlers.set(method, handler);
  }
  
  async handle(context: Context): Promise<Context> {
    const { method, params } = context.request;
    const handler = this.handlers.get(method);
    
    if (!handler) {
      context.response = errorResponse(
        context.request.id,
        -32601,
        `Method '${method}' not found`
      );
      return context;
    }
    
    try {
      const result = await handler(params, context);
      context.response = successResponse(context.request.id, result);
    } catch (error) {
      context.span.recordException(error as Error);
      context.response = errorResponse(
        context.request.id,
        -32603,
        'Handler error'
      );
    }
    
    return context;
  }
}
```

### 4. Cache Layer

Public reads with ETag + 304 support:

```typescript
class CacheMiddleware implements Middleware {
  async handle(context: Context): Promise<Context> {
    const { method, params } = context.request;
    const cacheKey = this.getCacheKey(method, params);
    
    // Check cache for GET-like methods
    if (this.isReadMethod(method)) {
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        const etag = this.generateETag(data);
        
        // Handle conditional requests
        if (context.request.headers?.['if-none-match'] === etag) {
          context.response = new Response(null, {
            status: 304,
            headers: { 'ETag': etag }
          });
          return context;
        }
        
        context.response = successResponse(
          context.request.id,
          data,
          { 'ETag': etag, 'X-Cache': 'HIT' }
        );
        return context;
      }
    }
    
    // Continue to handler
    context = await this.next(context);
    
    // Cache successful responses
    if (context.response?.ok && this.isReadMethod(method)) {
      const ttl = this.getTTL(method);
      await redis.setex(cacheKey, ttl, JSON.stringify(context.result));
    }
    
    return context;
  }
  
  private getCacheKey(method: string, params?: any): string {
    return `a2a:${method}:${JSON.stringify(params ?? {})}`;
  }
  
  private generateETag(data: any): string {
    return createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
  }
}
```

### 5. Rate Limiting

Token bucket with Redis backend:

```typescript
class RateLimitMiddleware implements Middleware {
  async handle(context: Context): Promise<Context> {
    const key = `rate:${context.clientIp}`;
    const limit = 100; // per minute
    const window = 60; // seconds
    
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    if (current > limit) {
      context.response = errorResponse(
        context.request.id,
        -32005,
        'Rate limit exceeded',
        {
          limit,
          window,
          retry_after: await redis.ttl(key)
        }
      );
      return context;
    }
    
    context.response?.headers.set('X-RateLimit-Limit', String(limit));
    context.response?.headers.set('X-RateLimit-Remaining', String(limit - current));
    
    return context;
  }
}
```

## Security & Attribution

### robots.txt Configuration

```text
User-agent: *
Allow: /.well-known/
Allow: /api/a2a/
Allow: /feed

# Attribution Requirements
# Content licensed under CC-BY-4.0
# Attribution format: "Source: {title} by {author} - {url}"
# Agent access implies acceptance of attribution terms
```

### Security Headers

```typescript
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
```

### CORS Configuration

```typescript
const allowedOrigins = [
  'https://chatgpt.com',
  'https://chat.openai.com',
  'https://claude.ai',
  'https://www.perplexity.ai',
  'https://www.bing.com'
];

function getCORSHeaders(origin?: string): Headers {
  const headers = new Headers();
  
  if (origin && allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  headers.set('Access-Control-Max-Age', '86400');
  
  return headers;
}
```

## Observability

### OpenTelemetry Integration

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'a2a-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
  ],
});

sdk.start();
```

### Metrics to Track

- **Request rate** by method and origin
- **Latency** p50, p95, p99
- **Cache hit rate** by method
- **Error rate** by error code
- **Agent breakdown** by user-agent

## LangGraph Alignment

### Deep Agents Integration

```typescript
// Use LangGraph for complex, stateful operations
import { StateGraph } from '@langchain/langgraph';

const workflowGraph = new StateGraph({
  channels: {
    query: null,
    results: null,
    cache_hit: null
  }
});

// Add nodes for each A2A method
workflowGraph.addNode('search', async (state) => {
  // Complex search with sub-agents
  return { results: await complexSearch(state.query) };
});

// Use Context API for typed runtime state
workflowGraph.addNode('cache_check', async (state, context) => {
  const cached = await context.store.get(state.query);
  return { cache_hit: !!cached, results: cached };
});
```

### Durability Modes

```typescript
// Configure checkpoint strategy
const checkpointer = new RedisCheckpointer({
  client: redis,
  ttl: 3600
});

const app = workflowGraph.compile({
  checkpointer,
  durability: 'async' // or 'sync', 'exit'
});
```

## Field Results

### Analytics Snapshot (Jul 17 → Aug 13, 2025)

| Metric | Value |
|--------|-------|
| **Total Sessions** | 561 |
| **Active Users** | 443 |
| **Engagement Rate** | 29.77% |
| **Total Events** | 2,427 |
| **Agent Sessions** | 29 (5.2%) |

### Agent Performance

- **ChatGPT**: 13 sessions, 61.5% engagement, 47s avg
- **Perplexity**: 5 sessions, 54s avg
- **Bing**: 11 sessions, 7s avg

## Production Checklist

### Pre-Launch

- [ ] JSON-RPC 2.0 conformance testing
- [ ] Load testing (target: p95 ≤ 300ms)
- [ ] Security headers configured
- [ ] Rate limiting tested
- [ ] Cache warming for common queries
- [ ] Monitoring dashboards ready

### Post-Launch

- [ ] Monitor agent traffic patterns
- [ ] Track error rates and types
- [ ] Optimize cache TTLs based on usage
- [ ] Review and update rate limits
- [ ] Collect agent feedback via headers

## Call to Action

1. **Ship your agent card + JSON-RPC this week**
2. **Post agent-referral stats in Discord**
3. **Validate with the test harness**
4. **Share implementation patterns**

## Resources

- [A2A Quick Start](../lightning-talks/a2a-quick-start.md)
- [Deep Agents Repository](https://github.com/langchain-ai/deep-agents)
- [LangGraph v0.6 Docs](https://langchain.com/docs/langgraph)
- [JSON-RPC 2.0 Spec](https://www.jsonrpc.org/specification)
- [OpenTelemetry JS](https://opentelemetry.io/docs/instrumentation/js/)

---

*Production A2A deployment requires careful attention to caching, security, and observability. The patterns shown here are battle-tested with real agent traffic.*