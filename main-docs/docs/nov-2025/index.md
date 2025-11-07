# November 2025: LangGraph, RAG Failures, and Deep Agents

Welcome to our November 2025 Mixer & Showcase! This month featured practical deep dives on LangGraph fundamentals, enterprise RAG implementations, production deep agents, and AI project management anti-patterns.

## Video Recording

<iframe width="560" height="315" src="https://www.youtube.com/embed/JOiUYZhGhH8" title="AIMUG November 2025 Mixer & Showcase" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Featured Content

### Thunderstorm Talks

1. [Introduction to LangGraph](langgraph-introduction)
   - Controllability: balancing agent autonomy with developer control
   - Bulk synchronous parallel architecture
   - State persistence and fault tolerance
   - Human-in-the-loop workflows
   - Production use cases in FDA compliance and ERP systems

2. [Why RAG Use Cases Crash and Burn in Enterprises](rag-enterprise-failures)
   - 42% of enterprise AI use cases failed in 2025
   - Five pillars of RAG failure
   - The "goldfish vs elephant" memory problem
   - State management architecture
   - PIMCO's Microsoft-featured success story

3. [Deep Agents in Production - Real World Experience](deep-agents-production)
   - $80, 3.5-hour pipeline analyzing 400 companies
   - Four specialized subagents architecture
   - Middleware as control mechanism
   - The "toddler" approach to agent correction
   - When to use Deep Agents vs LangGraph

4. [AI Project Management Anti-Patterns](ai-project-management)
   - 95% of AI pilots fail due to organizational approach
   - Legacy SaaS/ERP mental models don't work for AI
   - Framework comparison: Accenture, Google, AWS, IBM
   - Red flags to watch for in AI projects
   - The 6-month notebook problem

## Event Details

### November Monthly Mixer & Showcase (November 5, 2025)
Location: Austin Community College RGC 3000

**Attendance**: 50+ in-person attendees, remote participants from Panama chapter

**Schedule**:
- 6:00 PM - Welcome & Networking
- 6:20 PM - Introductions & Kickoff
- 6:30 PM - LangGraph Introduction (Colin McNamara)
- 6:50 PM - RAG on LangGraph (Anupama Garani)
- 7:05 PM - Deep Agents: Building on LangGraph (Collier King)
- 7:25 PM - Project Management for AI (Paul Phelps - Remote from Panama)
- 7:40 PM - Buffer & Open Q&A
- 8:00 PM - Walk to The Tavern / After-Party

## Key Topics

### LangGraph Fundamentals
- Graphs vs chains vs agents
- Controllability through node-edge structures
- State persistence in Postgres, Redis, file systems
- Human-in-the-loop native support
- Time travel debugging capabilities
- When to use LangGraph vs React agents

### Enterprise RAG Reality
- Industry failure statistics (S&P Global survey)
- Data quality and metadata challenges
- Prompt engineering evolution
- Evaluation and feedback loops
- Governance and compliance requirements
- State management for multi-turn conversations

### Production Deep Agents
- Subagent specialization patterns
- Middleware for agent control
- Validation tracking and logging
- Cost analysis: $80 for 11M tokens
- Performance metrics and success rates
- LangGraph vs Deep Agents decision matrix

### AI Project Management
- Non-deterministic vs deterministic software
- Evolving requirements as learning signals
- Developer involvement from day one
- Framework evaluation criteria
- Organizational barriers to AI deployment
- Building developer-focused AI frameworks

## Community Highlights

- **International Presence**: Remote participation from AIMUG Panama (100 members)
- **Production Focus**: All talks featured real-world production experiences
- **Honest Insights**: Speakers shared costs, failures, and lessons learned
- **Technical Depth**: Advanced topics on architecture, middleware, and state management
- **Community Training**: LangChain team provided training materials

## Speaker Profiles

- **[Colin McNamara](https://www.linkedin.com/in/colinmcnamara/)** - Co-founder, Always Cool Brands & Always Cool AI
- **[Anupama Garani](https://www.linkedin.com/in/anupama-garani/)** - Data Specialist, PIMCO
- **[Collier King](https://www.linkedin.com/in/collierking/)** - Machine Learning Engineer, Cloudflare
- **[Paul Phelps](https://www.linkedin.com/in/mrpaulphelps/)** - Freelance AI Implementation Consultant

## Labs & Resources

### Code Repositories
- [Collier's Deep Agents Example](https://github.com/CollierKing/langchain-deepagents-examples/tree/main/examples/ai_theme_plays)
- [LangChain on GitHub](https://github.com/langchain-ai/langchain)
- [AIMUG Austin LangChain Labs](https://github.com/aimug-org/austin_langchain)

### Learning Resources
- [LangChain Academy](https://academy.langchain.com) - Free courses
- [LangSmith](https://smith.langchain.com) - Observability platform
- [Anupama's Medium Blog](https://agarani95.medium.com/)

## Prerequisites
- Understanding of:
  - Basic LangChain/LangGraph concepts
  - Agent architectures
  - Python development
  - RAG fundamentals
- Development environment with:
  - Python 3.9+
  - LangChain/LangGraph packages
  - Access to LLM APIs

## Key Takeaways

### Technical Decision Matrix

**Use LangGraph when:**
- Deterministic workflows required
- Compliance/safety requirements
- Cost efficiency critical
- Repeatability needed

**Use Deep Agents when:**
- Open-ended research tasks
- Complex multi-step planning
- Managing large context
- Long-term memory required

### State Management Principles

- **Context** = current conversation
- **Memory** = conversation history
- **State** = orchestration layer persisting both

### Enterprise AI Success Factors

1. Developer involvement from day one
2. Acceptance of non-deterministic behavior
3. Iterative discovery vs complete upfront requirements
4. Cross-functional collaboration
5. New PM frameworks (not legacy SaaS playbooks)
6. Golden datasets for evaluation
7. User feedback loops
8. Audit trails for compliance

## Next Events
- **Tuesday Office Hours**: Every Tuesday at 5:00 PM Central on Discord
- **Hacky Hour**: Mid-month (check Discord/Meetup for updates)
- **December Showcase**: First Wednesday of December

Join us on [Discord](https://discord.com/invite/JzWgadPFQd) or visit [aimug.org](https://aimug.org) for the latest updates!
