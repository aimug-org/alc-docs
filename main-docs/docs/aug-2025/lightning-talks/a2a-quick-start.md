---
title: A2A Quick Start (JSON-RPC for Agents)
description: Ship an agent card + JSON-RPC service in ~60 minutes on Astro (or any SSR stack)
date: 2025-08-14
tags: [a2a, json-rpc, astro, agent-card, discovery, caching]
sidebar_position: 2
---

# A2A Quick Start Guide

Deploy a production-ready Agent-to-Agent protocol in 60 minutes.

## What is A2A?

A lightweight, standardized **JSON-RPC 2.0** interface that lets AI agents discover your site's capabilities and safely call them.

### Two Core Components

1. **Agent Card** at `/.well-known/agent.json` - Describes capabilities, rate limits, and endpoint
2. **Service Endpoint** (e.g., `/api/a2a/service`) - Exposes callable methods

## 5-Step Implementation (~60 minutes)

### Step 1: Create Agent Card

`/.well-known/agent.json`:

```json
{
  "schema_version": "2025-08",
  "service": {
    "name": "Blog A2A",
    "endpoint": "/api/a2a/service",
    "rate_limit": {"burst": 10, "per_minute": 60}
  },
  "capabilities": [
    {"method": "blog.get_metadata"},
    {"method": "blog.list_posts", "params": {"limit": "number", "tag": "string?"}},
    {"method": "blog.get_post", "params": {"slug": "string"}},
    {"method": "blog.search_posts", "params": {"q": "string"}}
  ],
  "legal": {
    "license": "CC-BY-4.0",
    "attribution_required": true
  }
}
```

### Step 2: Implement JSON-RPC Endpoint

`src/pages/api/a2a/service.ts` (Astro SSR example):

```typescript
import type { APIContext } from 'astro';

type RpcReq = { 
  jsonrpc: '2.0'; 
  id?: string|number|null; 
  method: string; 
  params?: any 
};

type RpcRes = { 
  jsonrpc: '2.0'; 
  id: string|number|null; 
  result?: any; 
  error?: { code: number; message: string; data?: any } 
};

const ok = (id: RpcReq['id'], result: any): RpcRes => 
  ({ jsonrpc: '2.0', id: id ?? null, result });

const err = (id: RpcReq['id'], code: number, message: string, data?: any): RpcRes =>
  ({ jsonrpc: '2.0', id: id ?? null, error: { code, message, data } });

const allowOrigin = (origin?: string) => 
  origin && /^https?:\/\/(.*\.)?(openai|anthropic|perplexity|bing|chatgpt)\.com$/.test(origin) 
    ? origin : '*';

export async function POST(ctx: APIContext) {
  const req = (await ctx.request.json()) as RpcReq;
  const origin = ctx.request.headers.get('origin') ?? undefined;

  // Basic CORS & security headers
  const baseHeaders = {
    'Access-Control-Allow-Origin': allowOrigin(origin),
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json'
  };

  try {
    if (req.jsonrpc !== '2.0' || !req.method) {
      return new Response(
        JSON.stringify(err(req?.id, -32600, 'Invalid Request')), 
        { headers: baseHeaders, status: 400 }
      );
    }

    // Method dispatch
    switch (req.method) {
      case 'blog.get_metadata': {
        return new Response(
          JSON.stringify(ok(req.id, { 
            name: 'My Blog', 
            version: 1,
            description: 'Technical blog about AI and development'
          })), 
          { headers: baseHeaders }
        );
      }
      
      case 'blog.list_posts': {
        const { limit = 10, tag } = req.params ?? {};
        // TODO: Fetch from Content Collections
        const posts = [
          { slug: 'intro-to-a2a', title: 'Introduction to A2A', date: '2025-08-14' },
          { slug: 'deep-agents', title: 'Deep Agents Pattern', date: '2025-08-13' }
        ];
        return new Response(
          JSON.stringify(ok(req.id, { posts, limit, tag })), 
          { headers: baseHeaders }
        );
      }
      
      case 'blog.get_post': {
        const { slug } = req.params ?? {};
        if (!slug) {
          return new Response(
            JSON.stringify(err(req.id, -32602, 'Missing slug')), 
            { headers: baseHeaders, status: 400 }
          );
        }
        // TODO: Fetch actual post content
        return new Response(
          JSON.stringify(ok(req.id, { 
            slug, 
            title: 'Sample Post', 
            content: 'Post content here...',
            date: '2025-08-14'
          })), 
          { headers: baseHeaders }
        );
      }
      
      case 'blog.search_posts': {
        const { q } = req.params ?? {};
        if (!q) {
          return new Response(
            JSON.stringify(err(req.id, -32602, 'Missing query')), 
            { headers: baseHeaders, status: 400 }
          );
        }
        // TODO: Implement search
        return new Response(
          JSON.stringify(ok(req.id, { q, matches: [] })), 
          { headers: baseHeaders }
        );
      }
      
      default:
        return new Response(
          JSON.stringify(err(req.id, -32601, 'Method not found')), 
          { headers: baseHeaders, status: 404 }
        );
    }
  } catch (e: any) {
    return new Response(
      JSON.stringify(err(null, -32603, 'Internal error', { message: e?.message })), 
      { headers: baseHeaders, status: 500 }
    );
  }
}
```

### Step 3: Update robots.txt

```text
User-agent: *
Allow: /.well-known/
Allow: /api/a2a/
Allow: /feed

# License and attribution requirements
# Content licensed under CC-BY-4.0
# Attribution required when using content
```

### Step 4: Quick Test

```bash
# Test metadata endpoint
curl -sX POST https://your-domain.com/api/a2a/service \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","method":"blog.get_metadata","id":1}' | jq

# List posts
curl -sX POST https://your-domain.com/api/a2a/service \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","method":"blog.list_posts","params":{"limit":5},"id":2}' | jq

# Get specific post
curl -sX POST https://your-domain.com/api/a2a/service \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","method":"blog.get_post","params":{"slug":"intro-to-a2a"},"id":3}' | jq
```

### Step 5: Production Hardening

#### Checklist

- ✅ JSON-RPC 2.0 conformance
- ✅ ETags / 304s on read methods
- ✅ Rate limiting implementation
- ✅ CORS allowlist for agent origins
- ✅ Performance target: p95 ≤ 300ms

#### Add Rate Limiting

```typescript
// Simple in-memory rate limiter (use Redis in production)
const rateLimits = new Map<string, { tokens: number; lastRefill: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip) ?? { tokens: 60, lastRefill: now };
  
  // Refill tokens (1 per second)
  const elapsed = (now - limit.lastRefill) / 1000;
  limit.tokens = Math.min(60, limit.tokens + elapsed);
  limit.lastRefill = now;
  
  if (limit.tokens < 1) return false;
  
  limit.tokens--;
  rateLimits.set(ip, limit);
  return true;
}
```

#### Add ETags for Caching

```typescript
import { createHash } from 'crypto';

function generateETag(content: any): string {
  return createHash('md5')
    .update(JSON.stringify(content))
    .digest('hex');
}

// In your endpoint:
const result = { /* your data */ };
const etag = generateETag(result);

if (ctx.request.headers.get('if-none-match') === etag) {
  return new Response(null, { status: 304, headers: { 'ETag': etag } });
}

return new Response(JSON.stringify(ok(req.id, result)), {
  headers: { ...baseHeaders, 'ETag': etag }
});
```

## Why Implement A2A?

### Real Results (Jul 17 → Aug 13, 2025)

- **5.2% of traffic** from AI agents
- **ChatGPT**: 61.5% engagement rate
- **Perplexity & Bing**: Active discovery and referrals

### Key Insight

> "Agents are becoming the discovery layer. GEO (Generative Engine Optimization) is the new SEO."

## Next Steps

1. Implement the basic endpoint
2. Connect to your content source (CMS, database, etc.)
3. Add production features (caching, rate limiting)
4. Monitor agent traffic in your analytics
5. Share results with the community!

## Resources

- [Full Implementation Guide](../thunderstorm-talks/a2a-implementation-guide.md)
- [LangGraph Test Harness](https://github.com/langchain-ai/langgraph)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

---

*Ship your A2A implementation this week and join the agent-discoverable web!*