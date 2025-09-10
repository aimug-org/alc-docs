---
sidebar_position: 1
---

# Lightning Talks - August 2025

Quick, focused presentations covering cutting-edge AI agent development and protocols.

## Featured Talks

### ⚡ [A2A Quick Start Guide](./a2a-quick-start.md)
*Ship an agent card + JSON-RPC service in ~60 minutes*

Learn how to:
- Create agent discovery cards
- Implement JSON-RPC 2.0 endpoints
- Add CORS, rate limiting, and caching
- Test with LangGraph harness

### 📊 A2A Field Results
*Live analytics from production deployment*

**Key Findings (Jul 17 → Aug 13)**:
- 561 total sessions, 443 active users
- 29.77% engagement rate
- **5.2% of traffic from AI agents** (29/561 sessions)

**Agent Breakdown**:
- **ChatGPT**: 13 sessions, 61.5% engagement, 47s avg duration
- **Perplexity**: 5 sessions, 54s avg duration
- **Bing**: 11 sessions, 7s avg duration

### 🔑 Key Takeaway

> "Agents are becoming the discovery layer (GEO > SEO). If you expose machine-readable capabilities + content, agents can find, cite, and link you."

## Quick Demo

30-second cURL test of A2A endpoint:

```bash
# Get metadata
curl -sX POST https://<your-domain>/api/a2a/service \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","method":"blog.get_metadata","id":1}' | jq

# List posts
curl -sX POST https://<your-domain>/api/a2a/service \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","method":"blog.list_posts","params":{"limit":5},"id":2}' | jq
```

## Presenter

**Colin McNamara** - Community Founder & Lead
- Implemented A2A on personal blog
- Analyzed real-world agent traffic patterns
- Open-sourced implementation patterns

---

*Lightning talks provide rapid insights into emerging patterns and real-world results from the AI agent ecosystem.*