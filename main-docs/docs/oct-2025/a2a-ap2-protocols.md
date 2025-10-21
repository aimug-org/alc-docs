---
sidebar_position: 2
---

# Agent-to-Agent (A2A) and Agent Payment Protocol (AP2)

**Presenter**: Ryan Booth
**Date**: October 1, 2025
**Duration**: 25 minutes (Thunderstorm Talk + Demo)

## Overview

Ryan Booth presented an exploration of Google's Agent-to-Agent (A2A) protocol and the emerging Agent Payment Protocol (AP2), demonstrating how these protocols enable agent discovery, capability negotiation, and automated transactions in a marketplace model.

## A2A Protocol Fundamentals

### What is A2A?

Agent-to-Agent is an **open-source protocol** released by Google that separates AI agent traffic into its own communication layer, similar to how SEO works for traditional web content.

### Core Concepts

1. **Verified Authentication**
   - Secure agent-to-agent communication
   - Trust verification between agents

2. **Capability Discovery**
   - Agents advertise their capabilities via exposed APIs
   - Search and enumeration of available services
   - Product/service catalog exposure

3. **Internet Exchange Handoffs**
   - Supply chain integration
   - Agent workflow coordination
   - Cross-platform transactions

### The Future Shift

> "Similar to how all car radios turned into an aux port for your iPhone, everything is going to turn into you getting all of your information through your AI chat assistants."

**Business Impact**:
- Customers won't visit websites directly
- Users will ask ChatGPT/Claude for product recommendations
- AI will discover and recommend services via A2A
- Businesses must expose capabilities through A2A to remain discoverable

## AP2: Agent Payment Protocol

### What is AP2?

Released shortly after A2A, the Agent Payment Protocol enables **financial transactions directly within agent workflows**.

### Key Features

- Payment processing across agent communications
- Billing integrated into chat interactions
- Transaction completion within AI interfaces
- Major integrations: PayPal and others

### Workflow

1. User requests service through AI assistant
2. Agent discovers capable providers via A2A
3. Service details and pricing returned
4. User approves transaction
5. Payment processed via AP2
6. Service delivered

## Ryan's Demo: Corvara Marketplace

### Project Overview

**Corvara**: Automated software development marketplace prototype

**Goal**: Create a system where:
- Users request software development
- Agents advertise development capabilities
- System discovers and negotiates with available agents
- Contracts are established automatically
- Work is performed and validated
- Payment is processed via AP2

### Demo Architecture

```
User Request → LangGraph Workflow → A2A Discovery → Agent Selection
    ↓
Contract Negotiation → Work Execution → Validation → Payment Routing
```

### Workflow Stages

1. **Intent & Requirements**
   - User submits project details
   - Budget, timeline, requirements
   - Transformed into PRD (Product Requirements Document)

2. **Agent Discovery**
   - A2A queries for capabilities
   - Finds available agents (Codex, Claude, Llama, etc.)
   - Filters by capability match

3. **Capability Negotiation**
   - Compare agent offerings
   - Pricing evaluation
   - Availability checking
   - Specialization assessment

4. **Contract Assembly**
   - Automated contract generation
   - Terms and conditions
   - Scope definition
   - Payment terms

5. **Authorization & Signing**
   - Contract finalization
   - Digital signatures
   - Commitment establishment

6. **Work Execution**
   - Agent performs development
   - Progress tracking
   - State management

7. **Validation & Review**
   - Output inspection
   - Quality assessment
   - Acceptance criteria verification

8. **Payment Routing**
   - AP2 payment processing
   - Distribution to agents
   - Transaction completion

### Demo Highlights

**Project Setup**:
- Project name: "Chess Game"
- Budget: (configurable)
- Timeline: 30 days
- Description: "Basic chess game"

**Agent Options Discovered**:
- Codex Orchestrator ($10/something)
- Claude Orchestrator
- Llama Orchestrator
- Coffee Shop (non-relevant service filtered out)
- Lawn Care (non-relevant service filtered out)
- Taco Stand (humorous filtering example)

**Agent Comparison UI**:
- Available/Ready status
- Specialization details
- Price comparison
- User ratings (e.g., 4.6/5)

### Technical Implementation

**Stack**:
- LangGraph for workflow orchestration
- A2A for capability discovery
- OpenAI Codex SDK integration
- Claude Code integration
- Custom marketplace UI

**Challenge Encountered**:
- Initial query matched "taco" keyword from taco stand service
- Demonstrates importance of semantic filtering
- Resolved by removing ambiguous keywords

## Human-in-the-Loop Requirements

### Current Limitations

⚠️ **Agents cannot autonomously handle payments** with A2A/AP2 yet

Required human intervention points:
1. Contract approval
2. Payment authorization
3. Validation & review
4. Final acceptance

### Strategic HITL Placement

Best points for human intervention:
- After contract assembly
- Before payment authorization
- During validation & review
- For exception handling

## Use Cases

### Presented Examples

1. **Tech Support Marketplace**
   - User screenshots error with ChatGPT
   - AI recommends remote support service
   - Contract service discovered via A2A
   - Payment processed via AP2
   - Issue resolved

2. **Software Development**
   - Requirements submitted
   - Agents bid on work
   - Best fit selected
   - Work delivered
   - Payment automated

3. **Service Discovery**
   - User needs specific capability
   - A2A discovers providers
   - Comparison shopping
   - Transaction completion

### Future Possibilities

- Fine-tuned model marketplace
- Specialized agent services
- Capability-as-a-Service
- Multi-agent collaboration
- Supply chain automation

## Contract-Based Critical Software

### Ryan's Thesis

> "Contract-based agents is going to have to be how we build critical software."

**Rationale**:
- Negotiated contracts for capability use
- Validated execution terms
- Automated enforcement
- Clear accountability
- Audit trails

**Applications**:
- Critical infrastructure
- Financial systems
- Healthcare applications
- Regulated industries

## SEO → AEO Transition

### Agent Engine Optimization (AEO)

Similar to SEO, businesses must optimize for AI discovery:

**Key Strategies**:
- Expose A2A catalogs
- Define clear capabilities
- Maintain agent-readable documentation
- Implement robot.txt equivalents
- Structure data for agent consumption

**Platform Support**:
- Shopify: MCP (Model Context Protocol) support
- Website builders: Adding AEO settings
- E-commerce platforms: A2A integration coming

### For Shopify Users

**Current State**:
- MCP integration available
- Access to entire Shopify corpus
- Agent-friendly APIs

**Coming Soon**:
- A2A catalog exposure
- Native agent discovery
- Automated transactions

## Integration with MCP

### MCP Overview

Model Context Protocol (Anthropic):
- Interact with APIs through agents
- No UI required
- Agent-to-service communication
- Complementary to A2A

### Relationship

```
User → Agent (MCP) → Service API (A2A) → Provider Agent
```

## Technical Considerations

### Discovery Challenges

1. **Semantic Matching**
   - Keyword overlap (e.g., "taco" in different contexts)
   - Contextual understanding required
   - Filtering strategies needed

2. **Capability Registration**
   - Clear capability definitions
   - Standardized descriptions
   - Searchable metadata

3. **Third-Party Integration**
   - External agent catalogs
   - Cross-platform discovery
   - Federation challenges

### Security & Trust

- Verified authentication
- Reputation systems (ratings)
- Contract enforcement
- Dispute resolution (to be developed)

## Open Questions

From Q&A session:

1. **Payment Timing**: When is payment committed?
   - Not fully defined in current spec
   - Likely escrow-based
   - Human approval still required

2. **Contract Enforcement**: How are disputes handled?
   - Still being developed
   - Contract validation needed
   - Enforcement mechanisms TBD

3. **Pricing Models**: How are agents compensated?
   - Per-task pricing
   - Subscription models
   - Usage-based billing
   - Hybrid approaches

## Production Readiness

### Current State

- ✅ A2A protocol specification available
- ✅ Basic implementations working
- ✅ Discovery mechanisms functional
- ⚠️ AP2 very new (released ~2 weeks before talk)
- ⚠️ Limited production deployments
- ❌ Payment automation requires HITL

### Next Steps for Adoption

1. Implement A2A catalog on services
2. Test capability discovery
3. Design contract workflows
4. Plan HITL integration points
5. Monitor protocol evolution

## Resources

### Official Resources
- [A2A Protocol Specification](https://a2a.to/)
- Google A2A Documentation
- OpenAI Agent Payment Protocol

### Community Resources
- Corvara project (Ryan's GitHub)
- AIMUG Discord discussions
- Austin LangChain examples

### Related Presentations
- Previous A2A demos by Kareem (1.5 years ago)
- Current implementation updates
- Community experiments

## Key Takeaways

1. **A2A is the future of service discovery**: Businesses must prepare for agent-driven customer interactions

2. **AP2 enables automated commerce**: Payments can flow through AI conversations

3. **Marketplace models emerging**: Agent services will be bought and sold like cloud resources

4. **HITL still required**: Current protocols require human oversight for payments

5. **Contract-based development**: Future of critical software may rely on agent contracts

6. **SEO → AEO shift**: Optimize for AI discovery, not just human search

## Community Feedback

**Historical Context**:
- Kareem demonstrated agent purchasing protocols 1.5 years ago at AIMUG
- Community has been exploring these concepts for years
- Now seeing industry standardization

**Interest Areas**:
- E-commerce integration
- Automated workflows
- Service marketplaces
- Contract automation

---

**Related Sessions**:
- [LangGraph Middleware](langgraph-middleware)
- [Inference Providers](inference-providers)

**Video**: Watch the full presentation in the [October 2025 showcase recording](https://youtu.be/RvG3KXRiURQ)
