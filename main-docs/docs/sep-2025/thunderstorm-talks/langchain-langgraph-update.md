---
id: langchain-langgraph-update
title: LangChain / LangGraph 1.0 Alpha Update
sidebar_label: LangChain/LangGraph Update
---

# LangGraph 1.0α & LangChain 1.0α — The New Defaults for Building Agentic Systems

**Speaker:** Colin McNamara  
**Duration:** 15 minutes  
**Time:** 6:30 PM - 6:45 PM

## Overview

Colin shares insights from Harrison's team on the upcoming LangGraph 1.0 and LangChain 1.0 releases, focusing on the new architecture, migration strategies, and production-ready features that make these the default choices for building agentic systems.

## 📺 Watch the Talk

<iframe width="100%" height="400" src="https://www.youtube.com/embed/N_WTAYVderI" title="LangChain/LangGraph 1.0 Alpha Update - Colin McNamara at AIMUG September 2025" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Key Updates

### Why This Matters Now

- **Alpha releases** for both LangGraph and LangChain in Python & JavaScript
- **Target release:** Late October 2025 for official 1.0
- **Core philosophy:** Shrink surface area, harden the runtime → ship faster with more reliability
- **Alpha notice:** Docs/content are evolving; treat as "try now, production-gate later"

### The Big Picture

- **LangChain 1.0α** → A single, focused agent (`create_agent` / `createAgent`) built on LangGraph
- **LangGraph 1.0α** → Promoted with no breaking changes; durable execution, streaming, HITL, and time travel
- **LangChain-Core** → Introduces standard message content via `.content_blocks` / `contentBlocks` (typed, provider-agnostic, backwards-compatible)
- **Unified docs site** across Python & JavaScript

## Roles & Mental Model

### LangGraph = Runtime/Orchestrator
- State graphs with checkpoints (threads)
- Human-in-the-loop (`interrupt`)
- Multiple streaming modes
- Time travel capabilities

### LangChain = Getting Started & Patterns
- The agent interface
- Standard content blocks
- **Key relationship:** LangChain agent runs on LangGraph → 10-line start, production-grade runtime

## LangChain 1.0α Changes

### What's New
- **One agent abstraction**: `create_agent`/`createAgent` (ReAct-style loop) now on LangGraph
- **Standard content**: `.content_blocks` / `contentBlocks` unify reasoning, citations, tool calls, multimodal
- **Slimmer surface**: Legacy chains/agents move to `langchain-legacy`
- **Package significantly slimmed down** with focus on agents

### Migration Path
- Python: ≥ 3.10 (3.9 dropped in v1)
- JavaScript: Node ≥ 20
- Legacy path: `langchain-legacy` keeps older chains/agents working

## LangGraph 1.0α Features

### Runtime Guarantees
- **Deterministic concurrency** (Pregel/BSP)
- **Loops and parallelism**
- **Conservative v1**: Mostly deprecation cleanup; core runtime unchanged

### Built-in Capabilities
- **HITL** via `interrupt`
- **Checkpointing/threads**
- **Multiple streaming modes**
- **Time travel**

## Streaming Modes

Design your UX with the right streaming mode:

- **`messages`** → Token stream + model metadata (great for chat feel)
- **`updates`** → State deltas (progress/events for dashboards)
- **`values`** → Full state snapshots (visualize evolution)
- **`custom` / `debug`** → Arbitrary signals/traces when needed

## Persistence & Time Travel

### Checkpointing System
- Checkpointers write a checkpoint each super-step into a thread
- Resume, branch, and audit capabilities

### Server Defaults
- **Local development**: Disk storage in `langgraph dev`
- **Production**: Postgres in `langgraph up` and deployments

### Time Travel Features
- Resume from any prior checkpoint
- Replay or modify state to explore alternatives

## Human-in-the-Loop (HITL) Patterns

### Implementation
- `interrupt()` pauses indefinitely (state persisted)
- Resume after approval/edit/routing

### Common Checkpoint Locations
- Before external side-effects
- After tool proposals
- Policy gates
- High-risk actions

## Standard Content Blocks

### Why They Matter
- One typed view across providers (OpenAI, Anthropic, etc.)
- Normalizes reasoning, citations, tools, multimodal
- **Zero breakage**: Computed lazily from existing `.content`

### Practical Benefits
- Fewer provider branches
- Consistent UIs
- Easier model swaps

## Production Readiness

### Who's Using It
- Teams at **Uber, LinkedIn, Klarna** in production
- Design choices (Pregel/BSP + checkpoints) reflect real agent system needs

## Anti-Patterns to Avoid

1. Treating agents as a single function → no checkpoints/HITL
2. Streaming only tokens when users need progress → add `updates`
3. Ephemeral memory in prod → add real checkpointer + threads
4. Hard-coding provider-specific parsing → use content blocks

## Building Without a Demo

### Default Path
Start with the LangChain agent (it already rides LangGraph)

### Runtime Design
- Choose streaming mode(s)
- Define thread IDs
- Pick a checkpointer (SQLite/PG/Redis) per environment

### HITL Design
- Mark interrupt points before risky effects
- Design resume UX

### Content Strategy
Adopt content blocks in your renderers/logging

## Documentation & Learning

### What's Improved
- Unified OSS docs site (Python & JS together)
- Dedicated guides on streaming, persistence, HITL, time travel
- Integration docs prioritized
- Contributor guide and YouTube series organization
- Notebook → enterprise templates

## Platform & Naming Updates

### Directional Changes (WIP)
- Considering consolidating commercial offerings under "LangSmith platform"
- ~20% of LangSmith users don't use LangChain
- Expect clearer hierarchy visuals in coming weeks

## Insights & Analytics

### Forward-Looking Features
- New **Insights** clusters usage patterns & failure modes
- Drill-downs + future monitoring hooks
- Currently in beta behind a flag

## One-Page Takeaway

1. **Start with LangChain's single agent**; drop to LangGraph for custom control
2. **Design for streaming, checkpoints, HITL, time travel** from day one
3. **Adopt content blocks** to de-risk provider swaps
4. **Mind the floors**: Python ≥3.10, Node ≥20; use `langchain-legacy` as needed

## Resources & References

### Key Documentation
- [LangChain & LangGraph 1.0 alpha announcement](https://blog.langchain.com/langchain-langchain-1-0-alpha-releases/)
- [Python v1.0 release notes](https://docs.langchain.com/oss/python/releases-v1)
- [JavaScript v1.0 release notes](https://docs.langchain.com/oss/javascript/releases-v1)
- [Standard message content blog](https://blog.langchain.com/standard-message-content/)

### Technical Deep Dives
- [Building LangGraph: Pregel/BSP design](https://blog.langchain.com/building-langgraph/)
- [Streaming modes guide](https://langchain-ai.github.io/langgraph/concepts/streaming/)
- [Persistence & threads documentation](https://docs.langchain.com/oss/python/langgraph/persistence)
- [Human-in-the-loop patterns](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/)
- [Time travel API](https://docs.langchain.com/langgraph-platform/human-in-the-loop-time-travel)

### Platform Documentation
- [Streaming API](https://docs.langchain.com/langgraph-platform/streaming)
- [Data storage and privacy](https://docs.langchain.com/langgraph-platform/data-storage-and-privacy)
- [HITL implementation guide](https://docs.langchain.com/oss/javascript/langgraph/add-human-in-the-loop)

## Presentation Slides & Video

- [📺 Watch Colin's LangGraph/LangChain Update on YouTube](https://www.youtube.com/watch?v=N_WTAYVderI)
- [📊 View the full presentation slides (PDF)](https://github.com/aimug-org/austin_langchain/blob/main/resources/presentations/2025-09-10-Austin-LangChain-AIMUG%20.pdf)

## About the Speaker

Colin McNamara is an active contributor to the LangChain ecosystem and organizer of the Austin LangChain AI Middleware User Group (AIMUG). He regularly engages with Harrison's team to bring the latest updates and best practices to the Austin AI community.