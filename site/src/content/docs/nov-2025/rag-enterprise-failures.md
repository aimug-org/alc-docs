# Why RAG Use Cases Crash and Burn in Enterprises

**Speaker:** [Anupama Garani](https://www.linkedin.com/in/anupama-garani/)
**Company:** PIMCO (Data Specialist)
**Date:** November 5, 2025

## Overview

Anupama Garani delivered hard truths about enterprise RAG implementations based on her team's Microsoft-featured success story (ChatGWM - 2nd place winner of 2024 PIMCO Innovation Prize out of 154 submissions) and extensive industry research.

## The Failure Statistics

### Industry Numbers

- **42%** of enterprise AI use cases failed in 2025
- **51%** of failed cases were RAG implementations
- Only **200 out of 1,000** companies successfully deployed RAG (S&P Global survey)

### Why This Matters

RAG (Retrieval-Augmented Generation) is one of the most common enterprise AI use cases, yet it has a 51% failure rate. Understanding why helps avoid becoming part of the statistics.

## The Five Pillars of RAG Failure

### 1. Strategy Failures

**Problem:** Choosing the wrong problems for RAG

**Common mistakes:**
- Applying RAG to problems better solved by traditional search
- Using RAG where deterministic logic would suffice
- Not understanding when retrieval adds value

**Solution:**
- Evaluate if RAG is the right tool
- Consider alternatives (semantic search, traditional databases, rule engines)
- Match technology to problem type

### 2. Data Quality Issues

**Problem:** Incomplete documents and poor metadata

**Common issues:**
- Missing critical information in source documents
- Inconsistent formatting across documents
- Poor or missing metadata for filtering
- Outdated information in vector stores

**Example problems:**
- Document says "See Appendix B" but appendix isn't indexed
- Dates stored as text ("last year") instead of structured data
- No metadata to filter by department, region, or time period

**Solution:**
- Data quality audits before vectorization
- Structured metadata schema
- Regular data freshness checks
- Document completeness validation

### 3. Prompt Engineering Gaps

**Problem:** Outdated or misaligned prompts

**Common issues:**
- Prompts not updated as use cases evolve
- System prompts don't match user expectations
- No prompt versioning or testing
- Prompts don't leverage retrieved context effectively

**Solution:**
- Prompt version control
- A/B testing of prompt variants
- Regular prompt reviews against user feedback
- Context-aware prompt engineering

### 4. Evaluation Blind Spots

**Problem:** No golden dataset, insufficient user feedback

**Critical gaps:**
- No baseline to measure against
- Can't detect quality degradation
- No systematic feedback loops
- Unclear success metrics

**What's needed:**
- **Golden dataset**: Curated question-answer pairs for testing
- **User feedback loops**: Thumbs up/down, detailed feedback
- **Automated evaluation**: RAGAS, LangSmith evaluations
- **Regular audits**: Manual review of edge cases

**Solution:**
- Create golden dataset during pilot
- Implement feedback collection from day one
- Set up automated evaluation pipelines
- Track metrics over time

### 5. Governance Catastrophes

**Problem:** Regulatory and compliance issues

**Enterprise requirements:**
- Audit trails for all responses
- Data access controls
- Compliance with regulations (GDPR, HIPAA, etc.)
- Explainability for decisions

**Real-world example: Air Canada**

> "Air Canada really had a blooper where they asked for a refund and the chatbot promised the refund. When the person got back and asked the actual company, they said, 'Oh, no, that was just an error. It's not really us, it's the chatbot.' But in reality, it's them."

**Solution:**
- Audit trails built in from start
- Clear escalation paths to humans
- Legal review of AI responses
- Disclaimer and limitation statements

## The Goldfish vs Elephant Problem

### Goldfish Memory (Most Chatbots)

**Behavior:**
```
User: "I want to go to the Bahamas"
Bot: "Great! Let me help you plan your trip."

[New conversation]

User: "What did I say earlier?"
Bot: "I don't have any previous conversation history."
```

**Problem:** No state persistence between conversations

### Elephant Memory (LangGraph Solution)

**Behavior:**
```
User: "I want to go to the Bahamas"
Bot: "Great! Let me help you plan your trip."
    [State saved: destination = "Bahamas"]

[Hours/days later]

User: "What did I say earlier?"
Bot: "You said you wanted to go to the Bahamas.
     We also discussed warm weather preferences
     and hotels under $200/night."
```

**Solution:** State persistence with LangGraph

## State Management Architecture

### The Three Components

**Context = Current Conversation**
- What we're talking about right now
- Current turn's messages
- Active user intent

**Memory = Conversation History**
- All previous conversations
- User preferences learned over time
- Historical decisions

**State = Orchestration Layer**
- Combines context + memory
- Persists across sessions
- Enables multi-turn reasoning

### Implementation with LangGraph

**Architecture:**
```
User Input
    ↓
[Retrieve Relevant Context]
    ↓
[Load State from DB]
    ↓
[LLM Processing with Context + State]
    ↓
[Update State]
    ↓
[Save State to DB]
    ↓
Response
```

**State Persistence:**
- Store in Cosmos DB, Postgres, or Redis
- Session ID for user tracking
- Dictionary structure updated each turn
- Conditional edges for quality checks

## Live Demo: Travel Agent Chatbot

### Demo Setup

**Tech Stack:**
- Azure Stack
- Cosmos DB for state persistence
- Claude AI
- Streamlit for UI

### Demo Flow

**Turn 1:**
```
User: "I want to go to the Bahamas"
Bot: "Great choice! When would you like to travel?"
State: {destination: "Bahamas"}
```

**Turn 2:**
```
User: "I prefer warm weather"
Bot: "Perfect! The Bahamas is warm year-round.
     What's your budget for hotels?"
State: {destination: "Bahamas", weather: "warm"}
```

**Turn 3:**
```
User: "Under $200 per night"
Bot: "I can find several options under $200/night
     in the Bahamas with warm weather guarantees.
     Would you like to see them?"
State: {destination: "Bahamas", weather: "warm",
        hotel_budget: 200}
```

**Turn 4 (Days Later):**
```
User: "What was I planning?"
Bot: "You were planning a trip to the Bahamas,
     with preferences for warm weather and
     hotels under $200/night. Ready to book?"
```

### Key Demonstration Points

1. **State persists** across conversation turns
2. **Context accumulates** without re-explaining
3. **Quality checks** via conditional edges
4. **Audit trail** for every decision
5. **Regulatory compliance** through logging

## Production RAG Failure Zones

### Zone 1: Static RAG

**Problem:** No adaptation, fails silently

**Symptoms:**
- Same retrieval strategy for all queries
- No feedback incorporation
- Quality degrades over time
- No monitoring of failures

**Solution:**
- Dynamic retrieval strategies
- Continuous evaluation
- Feedback loops
- Monitoring and alerting

### Zone 2: Context Loss

**Problem:** Losing conversation thread

**Symptoms:**
- Users must repeat information
- Bot forgets previous turns
- No cross-session memory
- Poor user experience

**Solution:**
- State persistence (as demonstrated)
- Session management
- Long-term user profiles

### Zone 3: Stateless Systems

**Problem:** No orchestration layer

**Symptoms:**
- Can't handle multi-step workflows
- No human-in-the-loop
- Can't pause and resume
- Every query independent

**Solution:**
- LangGraph for orchestration
- State management
- Workflow definitions

### Zone 4: Wrong Retrieval

**Problem:** Poor retrieval quality

**Symptoms:**
- Irrelevant context retrieved
- Missing critical information
- Too much noise in context
- Wrong semantic matching

**Solution:**
- Hybrid search (keyword + semantic)
- Reranking models
- Metadata filtering
- Query refinement

### Zone 5: Hallucinations

**Problem:** LLM making up information

**Symptoms:**
- Responses not grounded in retrieved docs
- Confident incorrect answers
- Missing citations
- No source attribution

**Solution:**
- Strict grounding in retrieved context
- Citation requirements
- Confidence scoring
- Human verification for critical decisions

## PIMCO ChatGWM Success Story

### The Challenge

Build an AI-powered internal search platform for Account Managers that is:
- Compliance-friendly
- Data-backed
- Fast and accurate
- Auditable

### The Solution

**Architecture:**
- Azure AI Stack
- LangGraph for orchestration
- State persistence in Cosmos DB
- Conditional edges for quality control
- Built-in audit trails

### The Results

- **2nd place** in 2024 PIMCO Innovation Prize (154 submissions)
- **Featured** in Microsoft customer success story
- **One of the first** enterprises to successfully deploy RAG
- **Compliance-ready** from day one

### Key Success Factors

1. **State management** - Solved the goldfish problem
2. **Quality gates** - Conditional edges prevent bad responses
3. **Audit trails** - Every interaction logged
4. **User feedback** - Continuous improvement loop
5. **Data quality** - Clean, structured source data

## Implementation Checklist

### Before Building

- [ ] Validate RAG is right approach for the problem
- [ ] Audit data quality and completeness
- [ ] Define success metrics
- [ ] Create golden dataset for evaluation
- [ ] Plan for governance and compliance

### During Development

- [ ] Implement state persistence
- [ ] Build feedback collection mechanisms
- [ ] Add audit trails
- [ ] Set up quality gates (conditional edges)
- [ ] Version control prompts
- [ ] Test with golden dataset

### After Deployment

- [ ] Monitor retrieval quality
- [ ] Track user feedback
- [ ] Regular prompt reviews
- [ ] Data freshness checks
- [ ] Compliance audits
- [ ] Performance optimization

## Key Technologies

### Retrieval Stack

**Embeddings:**
- OpenAI text-embedding-3
- Cohere embeddings
- Local models (sentence-transformers)

**Vector Stores:**
- Pinecone
- Weaviate
- Qdrant
- Azure Cognitive Search

**Orchestration:**
- LangGraph for state management
- LangChain for retrieval chains

### Quality & Evaluation

**Evaluation Frameworks:**
- RAGAS (RAG Assessment)
- LangSmith evaluations
- Custom metrics

**Monitoring:**
- LangSmith tracing
- Application Insights (Azure)
- Custom dashboards

## Resources

### Anupama's Content
- [LinkedIn Profile](https://www.linkedin.com/in/anupama-garani/)
- [Medium Blog](https://agarani95.medium.com/) - Articles on RAG implementation
- Open source RAG repository covering:
  - Embedding strategies
  - Tokenization
  - Indexing
  - Search
  - Retrieval
  - Ranking

### Learning Resources
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangSmith](https://smith.langchain.com)
- [RAGAS Framework](https://github.com/explodinggradients/ragas)

### Industry Research
- S&P Global survey on AI deployment success rates
- Microsoft customer success stories
- PIMCO Innovation Prize 2024

## Key Takeaways

1. **51% of RAG implementations fail** - Learn from common pitfalls
2. **State management matters** - Goldfish vs elephant memory
3. **Five pillars** - Strategy, data quality, prompts, evaluation, governance
4. **LangGraph enables state** - Context + Memory + State orchestration
5. **Audit trails required** - Especially for compliance-heavy enterprises
6. **Golden datasets essential** - Can't improve what you don't measure
7. **User feedback loops** - Continuous improvement is key

## Q&A Highlights

**Q: How do you handle the cost of state persistence?**
A: State storage is minimal compared to LLM costs. We use Cosmos DB which scales well, and the state is just a JSON dictionary per session.

**Q: What about privacy concerns with state persistence?**
A: We implement user data controls, allow users to delete their state, and have retention policies. Everything is encrypted at rest and in transit.

**Q: Can you share your golden dataset approach?**
A: We started with 50 curated Q&A pairs covering common use cases and edge cases. We grow this based on user feedback and failure cases.

---

*Watch the full talk: [YouTube Recording](https://www.youtube.com/watch?v=JOiUYZhGhH8)*
