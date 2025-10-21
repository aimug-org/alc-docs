---
slug: october-2025-showcase-recap
title: "October 2025 Showcase: LangGraph 1.0, Agent Protocols, and AI Cancer Research"
authors: [colinmcnamara]
tags: [langgraph, middleware, a2a, ap2, cancer-research, inference, vllm, ollama, transformers]
date: 2025-10-21
---

Our October 2025 monthly showcase was packed with cutting-edge presentations on LangGraph 1.0 middleware, agent-to-agent communication protocols, groundbreaking cancer detection research, and local LLM inference strategies. With over 60 attendees and 6 first-time visitors, the energy was electric as our community explored the future of AI agent architectures.

<!-- truncate -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/RvG3KXRiURQ" title="AIMUG October 2025 Showcase - LangGraph 1.0 and Agent Protocols" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## LangGraph 1.0 Alpha: Middleware Revolution

Colin McNamara kicked off the evening with an exploration of [LangGraph 1.0's new middleware architecture](/docs/oct-2025/langgraph-middleware), demonstrating how three simple hooks are transforming agent development:

### The Three Middleware Hooks

1. **before_model** - Control what enters your agent
   - Manage context and token limits automatically
   - Implement guardrails with Nemo Guardrails
   - Jump to different nodes based on input

2. **model** - Optimize model execution
   - Swap models on-the-fly based on query complexity
   - Implement caching layers for cost reduction
   - Control tool availability and output formats

3. **after_model** - Validate and route outputs
   - Implement circuit breakers for unsafe outputs
   - Add human-in-the-loop at critical decision points
   - Collect metrics for OpenTelemetry

### Real-World Impact

Colin shared his production use case in food manufacturing, where LangGraph middleware enables:
- Automatic processing of EDI orders into QuickBooks
- Human approval for capacity-exceeding orders
- State persistence with rollback capabilities
- Native OpenTelemetry logging for observability

With companies like JPMorgan Chase, NuvoBank, and LinkedIn using LangGraph in production, the 1.0 stable release marks a significant milestone for enterprise AI applications.

[Read the full LangGraph middleware deep dive →](/docs/oct-2025/langgraph-middleware)

## A2A and AP2: The Future of Agent Commerce

Ryan Booth delivered a fascinating exploration of [Google's Agent-to-Agent (A2A) protocol and the emerging Agent Payment Protocol (AP2)](/docs/oct-2025/a2a-ap2-protocols), complete with a live demo of his Corvara marketplace platform.

### Key Insights

**A2A enables agent discovery**: Just as SEO helps humans find content, A2A allows AI agents to discover and negotiate with service providers. Businesses must now optimize for "Agent Engine Optimization" (AEO) to remain discoverable in an AI-first world.

**AP2 enables automated transactions**: The new payment protocol allows agents to complete financial transactions within chat interfaces, bringing us closer to fully automated service marketplaces.

### The Corvara Demo

Ryan's prototype demonstrated:
- Automatic agent discovery based on capabilities
- Contract negotiation and pricing comparison
- Integration with Codex and Claude orchestrators
- Human-in-the-loop approval points for payments

The vision? A marketplace where agents bid on software development projects, negotiate contracts, complete work, and process payments—all with minimal human intervention.

[Explore the A2A/AP2 protocols in detail →](/docs/oct-2025/a2a-ap2-protocols)

## AI-Powered Cancer Detection: High School Research at Stanford

In one of the evening's most inspiring presentations, high school student [Venika Kakarla shared her Stanford research](/docs/oct-2025/cancer-detection-research) on hepatocellular carcinoma (liver cancer) using spatial data analysis and machine learning.

### Research Highlights

Working with **1.4 million cells** across 124+ tumor regions, Venika employed:
- **Direct and indirect interaction studies** to map cell distributions around blood vessels
- **Microvessel density (MVD) analysis** using 8×8 grid-based spatial partitioning
- **Voronoi tessellation clustering** to identify dispersion patterns
- **Python-based statistical analysis** with Matplotlib, Pandas, and SciPy

### Future: Graph Attention Networks

Venika is now developing a Graph Attention Network (GAT) that combines:
- Spatial clustering data
- Her previous thermal stability research
- Clinical patient information
- Treatment history

The goal: Predict cancer recurrence probability and progression risk with unprecedented accuracy.

Her journey from Google Colab experiments (reducing 2,500 hours of compute to 5 minutes) to Stanford's School of Medicine demonstrates the democratizing power of AI tools in scientific research.

[Read Venika's full research presentation →](/docs/oct-2025/cancer-detection-research)

## LLM Inference: Choosing the Right Provider

Dmitri Iourovitski concluded the evening with a [comprehensive comparison of local LLM inference providers](/docs/oct-2025/inference-providers), cutting through the confusion with practical guidance.

### The Three Main Options

**Ollama/Llama.cpp**: Best for local development and quick demos
- ✅ Easiest setup, no GPU required
- ❌ No batch processing, opaque memory management
- **Use when**: Prototyping on macOS or CPU-only systems

**Hugging Face Transformers**: Best for flexibility and latest models
- ✅ Fine-grained control, Flash Attention support since 2023
- ✅ Day-one access to new model architectures
- ❌ Steep learning curve, manual memory management
- **Use when**: Production with customization needs

**VLLM**: Best for high-throughput production
- ✅ Paged attention, automatic batching, enterprise-grade
- ❌ Complex setup, requires high-end GPUs (12GB+ VRAM)
- **Use when**: Scaling to multiple users and concurrent requests

### Performance Numbers

Dmitri's OCR benchmark (20 pages, Q1 2.5 VL 7B model):
- **Ollama on 3090**: 35 minutes
- **Transformers on 3090**: 8 minutes (despite more aggressive quantization!)

The difference? Flash Attention and proper optimization.

[Dive into the full inference provider comparison →](/docs/oct-2025/inference-providers)

## Community Highlights

- **60+ attendees** with 6 first-time visitors joining the AIMUG family
- **Student mentorship** showcasing world-class research from high school to Stanford
- **Production deployments** sharing real-world use cases in manufacturing, finance, and healthcare
- **Open knowledge sharing** with all presentations documented and available to the community

## What's Next

### Upcoming Events

- **Tuesday Office Hours**: Every Tuesday at 5 PM Central on Google Meet
- **Hacky Hour**: Check Discord/Meetup for the next social coding session
- **November Showcase**: First Wednesday of November - mark your calendars!

### Get Involved

- 📺 [Watch the full recording](https://youtu.be/RvG3KXRiURQ)
- 📚 [Explore the documentation](/docs/oct-2025/)
- 💬 [Join our Discord](https://aimug.org/discord)
- 📅 [RSVP on Meetup](https://aimug.org)

## Final Thoughts

October's showcase demonstrated the rapid maturation of AI agent architectures. From production-ready middleware patterns to agent marketplaces to life-saving medical research, our community is at the forefront of practical AI innovation.

Whether you're building production agents with LangGraph, exploring agent protocols, conducting cutting-edge research, or optimizing inference performance, there's a place for you in the AIMUG community.

See you at the next showcase!

---

*Want to present at a future event? Reach out on Discord or email us. We're always looking for community members to share their learning and innovations.*
