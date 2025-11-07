---
slug: november-mixer-showcase-langgraph-rag-deep-agents
title: "November Mixer & Showcase: LangGraph, RAG Failures, and Deep Agents in Production"
date: 2025-11-05
authors: [colinmcnamara]
tags: ["langchain", "langgraph", "deep-agents", "rag", "event", "meetup", "ai", "project-management"]
---

# November Mixer & Showcase: LangGraph, RAG Failures, and Deep Agents in Production

Our November 5th Monthly Mixer & Showcase brought together over 50 AI practitioners for an evening of technical deep dives, honest production experiences, and community networking. From LangGraph fundamentals to enterprise RAG failures to $80 deep agent pipelines, our speakers delivered practical insights you won't find in marketing materials.

<!-- truncate -->

## Event Highlights

**Date:** November 5, 2025
**Time:** 6:00 PM – 8:30 PM
**Venue:** ACC Rio Grande Campus (RGC 3000)
**After-Party:** The Tavern
**Attendance:** 50+ in-person, remote participants from Panama chapter

## Video Recording

<iframe width="560" height="315" src="https://www.youtube.com/embed/JOiUYZhGhH8" title="AIMUG November 2025 Mixer & Showcase" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The Talks

### Colin McNamara: Introduction to LangGraph

[Colin McNamara](https://www.linkedin.com/in/colinmcnamara/), co-founder of Always Cool Brands and Always Cool AI, opened with LangGraph fundamentals using community training materials provided by the LangChain team.

**Key Takeaways:**

- **Controllability is King:** LangGraph balances agent autonomy with developer control by expressing workflows as graphs (nodes, edges, state)
- **Architecture Matters:** Built on bulk synchronous parallel computing (similar to Pregel/Facebook's graph processing), enabling massive scale
- **Persistence Solved:** State management in Postgres, Redis, or file systems enables long-running processes that survive crashes
- **Human-in-the-Loop Native:** Breakpoints between steps allow email, Slack, or console approvals without losing state
- **Time Travel Debugging:** Directed acyclic graph structure enables replay and step-through debugging

**Production Use Cases:**

Colin runs five LangGraph applications in production at Always Cool Brands:
- FDA label verification (life safety critical)
- Nutrition facts validation
- Allergen checking
- Religious context validation (halal, kosher)
- ERP integration with image processing

> "People can die if you screw up, right? And I'm legally liable as an officer in the company... I want to make sure that it does every step every time and I want to make sure that's logged."

**When to Use LangGraph vs Pure Agents:**

- **Use LangGraph:** Compliance requirements, repeatability needs, cost efficiency, deterministic workflows
- **Use React Agents:** Flexibility more important than reliability, exploratory tasks

**Resources:**
- [LangChain Academy](https://academy.langchain.com) - Free courses
- [LangSmith](https://smith.langchain.com) - Observability platform
- 15M monthly downloads, 100K production apps, 3,000+ contributors

---

### Anupama Garani: Why RAG Use Cases Crash and Burn in Enterprises

[Anupama Garani](https://www.linkedin.com/in/anupama-garani/), Data Specialist at PIMCO, delivered hard truths about enterprise RAG implementations based on her team's Microsoft-featured success story and industry research.

**The Numbers Don't Lie:**

- **42%** of enterprise AI use cases failed in 2025
- **51%** of failed cases were RAG implementations
- Only **200 out of 1,000** companies successfully deployed RAG (S&P Global survey)

**Five Pillars of RAG Failure:**

1. **Strategy Failures** - Choosing wrong problems for RAG
2. **Data Quality** - Incomplete documents, poor metadata
3. **Prompt Engineering** - Outdated or misaligned prompts
4. **Evaluation Blind Spots** - No golden dataset, insufficient user feedback
5. **Governance Catastrophes** - Regulatory and compliance issues

**The Goldfish vs Elephant Problem:**

Most chatbots have "goldfish memory" - they forget context between conversations. Anupama demonstrated how LangGraph enables "elephant memory" through state persistence.

**State Management Architecture:**

- **Context** = current conversation
- **Memory** = conversation history
- **State** = orchestration layer that persists both

**Live Demo Results:**

Using Azure Stack and Cosmos DB, Anupama's travel agent chatbot successfully:
- Remembered location preferences across multiple conversation turns
- Retained weather requirements, hotel criteria, and budget constraints
- Persisted state as a dictionary updated at each decision point
- Provided audit trails for regulatory compliance

**Real-World Failure:**

> "Air Canada really had a blooper where they asked for a refund and the chatbot promised the refund. When the person got back and asked the actual company, they said, 'Oh, no, that was just an error. It's not really us, it's the chatbot.' But in reality, it's them."

**Resources:**
- PIMCO ChatGWM platform (2024 Innovation Prize winner - 2nd place out of 154 submissions)
- [Anupama's Medium articles on RAG](https://agarani95.medium.com/)
- Open source RAG repository covering: embedding, tokenization, indexing, search, retrieval, ranking

---

### Collier King: Deep Agents in Production - Real World Experience

[Collier King](https://www.linkedin.com/in/collierking/), Machine Learning Engineer at Cloudflare, shared unvarnished production experience running an $80, 3.5-hour deep agent pipeline that analyzed Jensen Huang's GTC keynote.

**The Use Case:**

Analyze NVIDIA keynote → Extract themes → Match 400 tech companies → Validate with press releases → Rank top 100

**Architecture:**

Four specialized subagents:
1. **Transcript Analyzer** - Extracted themes from Jensen's talk
2. **Company Matcher** - Scored 400 companies against themes
3. **PR Validator** - Verified matches with press release evidence
4. **Results Ranker** - Final scoring and ranking

**Tech Stack:**
- LangChain + DeepAgents framework
- PostgreSQL (company database)
- MongoDB (press release storage)
- Cloudflare R2 (S3-compatible object storage)
- Google Gemini (faster than Sonnet 4.5 for this task)

**Performance Metrics:**

- **Runtime:** 12:38 AM - 4:00 AM (~3.5 hours)
- **Tokens:** 11 million
- **Cost:** $80
- **Output:** 244 pages of analysis
- **Success Rate:** 87 of 100 companies ranked

**Critical Learning: Middleware as Control Mechanism:**

> "These LLMs are fine-tuned to save tokens. They will just naturally take shortcuts. Even the good ones like Google Gemini or Claude, they'll do this. You have to be very explicit."

**Middleware Solutions:**

- **S3 System Middleware** - Remote file storage to handle large outputs
- **Content Truncation** - Manage context window limits
- **Logging Middleware** - Essential for debugging 3.5-hour runs
- **Validation Tracking** - Before/after tool call hooks verify completion
- **Stateful Tools** - Sequential batch validation prevents skipping items

**The "Toddler" Approach:**

> "It's like having a toddler or something. You're letting it fall down and be like, 'Well, now you know not to do that.' You're giving the error messages back to it... and it's course correcting from that as it's executing, which is a weird thing to think about."

**When to Use Deep Agents vs LangGraph:**

- **Deep Agents:** Complex multi-step planning, managing large context, long-term memory, exploratory research
- **LangGraph:** Deterministic workflows, cost efficiency, compliance requirements, repeatability

**Resources:**
- [GitHub Repository](https://github.com/CollierKing/langchain-deepagents-examples/tree/main/examples/ai_theme_plays) - Full code with middleware implementations
- Pydantic models for schema validation
- S3-backed checkpointing for crash recovery

---

### Paul Phelps: AI Project Management Anti-Patterns

[Paul Phelps](https://www.linkedin.com/in/mrpaulphelps/), freelance AI implementation consultant presenting remotely from AIMUG Panama (100 members!), tackled the organizational barriers that kill AI projects.

**Core Thesis:**

> "The constraint for AI getting into production is not the model, but the organizational approach. Product/Project Managers still use legacy SaaS/ERP mental models."

**The Real Problem:**

Traditional PM playbooks assume:
- Predictable, testable software
- Complete requirements upfront
- Same input → same output
- Scope creep is bad

**AI Reality:**

- Non-deterministic (same input ≠ same output)
- Requirements evolve as you learn what data can do
- Scope changes signal the system is working
- Developers must participate in requirements gathering

**Framework Comparison:**

| Framework | Strengths | Weaknesses |
|-----------|-----------|------------|
| **Accenture** | Change management, training | Expensive, not dev-focused |
| **Google** | Infrastructure readiness | Selling infrastructure |
| **AWS** | Data readiness focus | Quantity over quality, selling storage |
| **IBM** | Governance, compliance | Slow, bureaucratic |

**Red Flags to Watch For:**

- PMs demanding complete requirements before any code
- PMs insisting on one perfect predetermined solution
- PMs wanting enterprise infrastructure before validation
- Months of stakeholder interviews before development starts
- No changes to traditional software delivery processes

**The 6-Month Notebook:**

> "You build a model, it works perfectly in your notebook, 95% accuracy, clean code, great performance metrics, but six months later, it's still not in production. The block is almost never your system. The block is organizational process."

**Paul's Framework Development:**

Paul is developing a developer-focused AI project framework addressing the 95% AI pilot failure rate. He emphasizes that organizations must stop treating AI like SaaS and adopt approaches that embrace AI's non-deterministic nature.

---

## Additional Announcements

**Griesh** from Fine Health announced they're hiring AI engineers in Austin, expanding their team in early 2026.

---

## Key Technical Insights Across All Talks

### 1. LangGraph vs Deep Agents Decision Matrix

- **LangGraph:** Deterministic workflows, compliance, cost efficiency, repeatability
- **Deep Agents:** Open-ended research, planning, complex delegation, large context

### 2. State Management is Critical

- **Memory** = history book (all conversations)
- **Context** = current chapter (current conversation)
- **State** = orchestration layer (how you persist both)

### 3. Middleware as Control Mechanism

- Before/after tool call hooks
- Error messages fed back to agent for self-correction
- Essential for keeping agents on task
- Validation that work actually completed

### 4. Enterprise RAG Requirements

- Golden datasets for evaluation
- User feedback loops
- Audit trails for compliance
- State persistence across sessions
- Quality data with minimal metadata noise

### 5. AI Project Success Factors

- Developer involvement from day one
- Acceptance of non-deterministic behavior
- Iterative discovery vs complete upfront requirements
- Cross-functional collaboration
- New PM frameworks (not legacy SaaS playbooks)

---

## About AIMUG

The **AI Middleware Users Group** believes in "Learning in the Open." We explore LangChain, LangGraph, LangSmith, and the broader AI stack—sharing demos, pitfalls, and wins so everyone levels up.

**Meeting Schedule:**
- **Monthly Showcases:** First Wednesday of each month at ACC Rio Grande Campus
- **Office Hours:** Tuesdays at 5 PM on Discord
- **Hacky Hours:** Mid-month meetups at local venues

**Supporting Members:** ~25 monthly supporters

**Corporate Underwriters:**
- [Center for Government & Civic Service](https://www.austincc.edu/offices/center-for-government-and-civic-service) (ACC host)
- [LangChain AI](https://www.langchain.com/) (pizza sponsor, training materials)
- [Always Cool Brands](https://alwayscoolbrands.com/) (financial support)

**International Presence:**
- Austin, TX chapter (main)
- Panama chapter (100 members, led by Paul Phelps)

---

## Resources & Links

### Speaker Profiles
- [Colin McNamara - LinkedIn](https://www.linkedin.com/in/colinmcnamara/)
- [Anupama Garani - LinkedIn](https://www.linkedin.com/in/anupama-garani/)
- [Collier King - LinkedIn](https://www.linkedin.com/in/collierking/)
- [Paul Phelps - LinkedIn](https://www.linkedin.com/in/mrpaulphelps/)

### Code Repositories
- [Collier's Deep Agents Example](https://github.com/CollierKing/langchain-deepagents-examples/tree/main/examples/ai_theme_plays)
- [LangChain on GitHub](https://github.com/langchain-ai/langchain)

### Learning Resources
- [LangChain Academy](https://academy.langchain.com) - Free courses
- [LangSmith](https://smith.langchain.com) - Observability platform
- [Anupama's Medium Blog](https://agarani95.medium.com/)

### Event Recording
- [YouTube Recording](https://www.youtube.com/watch?v=JOiUYZhGhH8)

---

## Join Us

Whether you're a seasoned AI developer or just getting started with LangChain and AI middleware, AIMUG offers a welcoming community for learning and growth.

- **Website:** [aimug.org](https://aimug.org)
- **Newsletter:** [newsletter.aimug.org](https://newsletter.aimug.org)
- **Discord:** [Join our Discord](https://discord.com/invite/JzWgadPFQd)
- **GitHub:** [github.com/aimug-org](https://github.com/aimug-org)

**Want to present?** Just ask! We structure talks as 15-minute "thunderstorm talks" (12 min presentation + 3 min Q&A).

---

*Special thanks to the LangChain team for providing community training materials, and to all our speakers for sharing honest, practical insights from production systems.*
