---
slug: a2a-ap2-agent-protocols-video
title: "Agent-to-Agent Communication: Ryan Booth's Deep Dive into A2A and AP2 Protocols"
authors: [colinmcnamara]
tags: [a2a, ap2, agents, protocol, marketplace, langgraph, enterprise-ai]
date: 2025-10-22
---

Ryan Booth's presentation on Agent-to-Agent (A2A) communication and the Agent Payment Protocol (AP2) is now available, showcasing the future of autonomous agent marketplaces and the infrastructure enabling AI commerce.

<!-- truncate -->

<iframe width="560" height="315" src="https://www.youtube.com/embed/d5l0D7h5bI4" title="A2A and AP2 Agent Protocols - Ryan Booth" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The Vision: Agent Marketplaces

Ryan's presentation, delivered at our [October 2025 showcase](/blog/2025-10-21-october-2025-showcase-recap), demonstrates how Google's Agent-to-Agent protocol and OpenAI's Agent Payment Protocol are creating the foundation for autonomous agent economies. This isn't science fiction—it's infrastructure being deployed today.

### The Fundamental Shift

We're witnessing a transition similar to how smartphones changed consumer behavior. Just as car radios evolved to aux ports for iPhones, our entire digital interaction model is shifting toward AI intermediaries. Customers won't browse your website—they'll ask ChatGPT or Claude for recommendations, and those AI assistants will discover your services through A2A protocols.

This creates an urgent imperative for businesses: optimize for Agent Engine Optimization (AEO) or become invisible to the AI-driven economy.

## Understanding A2A: Agent Discovery Protocol

The Agent-to-Agent protocol, released by Google as open source, separates AI agent traffic into its own communication layer. Think of it as SEO for the AI age, but with fundamental differences that make it more powerful.

### Core Capabilities

**Verified Authentication** - Agents don't just exchange data; they establish trust relationships. Before capability negotiation begins, agents verify each other's identity through cryptographic mechanisms, ensuring secure business relationships.

**Capability Discovery** - Instead of static API documentation that humans read, agents expose machine-readable capability catalogs. Your service advertises what it can do, its pricing structure, availability, and quality metrics—all in formats that other agents can automatically process and evaluate.

**Internet Exchange Handoffs** - The protocol supports complex workflows where multiple agents collaborate across organizational boundaries. A customer's AI assistant might discover your service, negotiate terms with your AI agent, coordinate with a payment processor's agent, and orchestrate delivery—all autonomously.

### The Marketplace Model

Ryan demonstrated his Corvara platform, which implements these concepts in a software development marketplace:

Users submit project requirements through natural language. The system transforms these into structured Product Requirements Documents. Agent discovery queries find available development agents—Codex orchestrators, Claude-based developers, Llama implementations—each advertising their capabilities, pricing, and specializations.

The platform presents comparison interfaces showing availability status, specialization details, pricing models, and user ratings. Users select agents not by browsing websites, but by evaluating AI-curated options based on their specific needs.

## AP2: Enabling Agent Commerce

The Agent Payment Protocol extends A2A by adding financial transaction capabilities directly into agent workflows. Released shortly after A2A, AP2 represents the critical missing piece for autonomous agent economies.

### Payment Integration

Traditional e-commerce requires users to navigate checkout flows, enter payment information, and confirm transactions through human interfaces. AP2 enables payments to flow through the agent conversation itself:

The user requests a service through their AI assistant. Agents discover capable providers and negotiate contracts. Service details and pricing are presented within the conversation. The user approves the transaction through their AI assistant. Payment processes automatically via AP2. Service delivery proceeds without additional human intervention.

Major payment processors, including PayPal, have already integrated AP2 support, signaling industry confidence in this architecture.

## Contract-Based Agent Workflows

Ryan's thesis centers on a critical insight: building critical software requires contract-based agent systems. When agents autonomously negotiate and execute work, formal contracts become essential infrastructure rather than legal overhead.

### The Contract Workflow

**Intent and Requirements** - User requests are transformed into formal specifications that become the basis for contract negotiation.

**Agent Discovery** - Capable providers are identified through A2A capability queries, creating a pool of potential service providers.

**Capability Negotiation** - Agents engage in automated negotiation, comparing capabilities, pricing, availability, and quality metrics to identify optimal matches.

**Contract Assembly** - Formal agreements are generated programmatically, encoding scope, terms, payment conditions, and success criteria in machine-executable formats.

**Authorization and Signing** - Contracts receive digital signatures from both parties, creating binding agreements with cryptographic proof.

**Work Execution** - Services are delivered according to contract specifications, with progress tracked and state maintained throughout execution.

**Validation and Review** - Outputs are validated against contract criteria before being released to requestors.

**Payment Routing** - AP2 processes payments according to contract terms, distributing funds to service providers upon successful completion.

### Human-in-the-Loop Requirements

Current implementations require human oversight at critical points. Agents cannot autonomously authorize payments or execute binding contracts without human approval. This creates strategic decision points where organizations must determine appropriate intervention levels.

The most effective implementations place human review after contract assembly and before payment authorization. This balances automation efficiency with necessary oversight, allowing routine decisions to flow automatically while flagging exceptional cases for human judgment.

## Real-World Applications

Ryan's demonstration focused on software development marketplaces, but the implications extend across industries:

**Professional Services** - Consultants, designers, writers, and other service providers can expose capabilities through A2A, allowing clients' AI assistants to discover and engage their services automatically.

**Technical Support** - Users describe technical problems to AI assistants, which discover qualified support agents, negotiate service terms, coordinate remote access, and process payments—all within a single conversation.

**Supply Chain Automation** - Manufacturing and logistics agents can discover suppliers, negotiate contracts, coordinate deliveries, and process payments autonomously, reducing friction in complex supply chains.

**Healthcare Coordination** - Medical AI assistants could discover specialists, coordinate appointments, verify insurance coverage, and process claims through agent-to-agent protocols while maintaining HIPAA compliance.

**Financial Services** - Investment agents could discover opportunities, execute trades, coordinate with custody agents, and settle transactions through verified agent networks.

## Technical Architecture Insights

### Service Advertisement

Businesses must expose A2A catalogs that describe their services in machine-readable formats. This involves defining clear capability schemas, pricing models, availability windows, quality guarantees, and integration requirements.

Current platforms like Shopify are implementing Model Context Protocol (MCP) support as a bridge to A2A. This allows e-commerce platforms to expose product catalogs, inventory status, pricing, and ordering capabilities to agent ecosystems.

### Discovery Mechanisms

Ryan encountered an interesting challenge during his demonstration: semantic filtering. When testing with "chess game" requirements, the system initially matched "taco" keywords from a taco stand service he'd included as a test provider. This highlights the importance of sophisticated semantic matching in production systems.

Effective discovery requires contextual understanding that goes beyond keyword matching. Agents must understand capability domains, distinguish between different contexts where similar terms appear, and rank matches based on query intent rather than simple text overlap.

### Integration Patterns

The relationship between A2A and MCP demonstrates how these protocols complement each other. MCP provides low-level service interfaces that agents can interact with programmatically. A2A builds on this foundation to enable discovery, negotiation, and orchestration across multiple services.

## The AEO Imperative

Agent Engine Optimization represents a fundamental shift in how businesses think about discoverability. Just as SEO expertise became essential for web visibility, AEO capabilities will determine success in AI-mediated markets.

### AEO Strategies

**Capability Exposure** - Clearly define and expose service capabilities through structured schemas that agents can understand and evaluate.

**Metadata Richness** - Provide comprehensive metadata about services, including pricing structures, quality metrics, availability guarantees, and integration requirements.

**Agent-Readable Documentation** - Maintain documentation formats that AI agents can process effectively, moving beyond human-centric documentation approaches.

**Quality Signals** - Implement reputation systems, quality metrics, and verification mechanisms that help agents assess service reliability.

**Discovery Optimization** - Structure capability definitions to match common agent query patterns, ensuring your services surface in relevant discovery scenarios.

## Platform Support and Ecosystem Growth

The rapid adoption of these protocols across major platforms signals industry alignment around agent-to-agent architectures:

**Shopify's MCP Integration** - E-commerce platforms are exposing inventory, pricing, and ordering capabilities to agent ecosystems, enabling AI assistants to help users discover and purchase products.

**Website Builder Support** - Major website platforms are adding AEO settings alongside traditional SEO controls, allowing businesses to optimize for both human and agent discovery.

**Payment Processor Integration** - Financial infrastructure providers recognize that agent-mediated transactions represent significant future volume and are building native AP2 support.

## Looking Forward

The infrastructure for autonomous agent economies exists today. What remains is scaling adoption, refining protocols based on real-world deployment experience, and developing best practices for agent marketplace design.

### Open Questions

The community is actively exploring several critical questions:

**Payment Timing and Escrow** - How should funds be held during service execution? What conditions trigger release? How are disputes resolved?

**Quality Assurance** - How do agents verify service quality before accepting delivery? What validation mechanisms ensure contract compliance?

**Reputation Systems** - How do agents build and evaluate reputations in decentralized marketplaces? What prevents reputation manipulation?

**Privacy and Security** - How do we maintain privacy while enabling capability discovery? What security models protect against malicious agents?

**Governance and Standards** - Who governs protocol evolution? How do we ensure interoperability across competing implementations?

## Community Exploration

AIMUG provides a collaborative environment for exploring these questions. Our Tuesday office hours feature ongoing discussions about A2A and AP2 implementation strategies. Community members are building prototype marketplaces, experimenting with capability schemas, and sharing lessons from early deployments.

### Historical Context

This isn't AIMUG's first exploration of agent purchasing protocols. A year and a half ago, Kareem demonstrated similar concepts, showing how forward-thinking our community has been in anticipating these developments. The difference now is industry standardization and production infrastructure.

## Getting Involved

**Watch the Full Talk** - Ryan's presentation includes live demonstrations of the Corvara marketplace, detailed technical explanations, and Q&A addressing community questions about implementation challenges.

**Explore the Protocols** - Google's A2A specification is open source and available for implementation. OpenAI has published AP2 documentation for developers building payment-enabled agents.

**Join the Discussion** - Our Discord community hosts ongoing conversations about A2A and AP2 implementation patterns. Share your experiments, ask questions, and learn from others building in this space.

**Tuesday Office Hours** - Every Tuesday at 5 PM Central, we gather to discuss agent architectures, marketplace design, and protocol implementation challenges.

**Build and Share** - The best way to understand these protocols is to build with them. Implement a simple capability catalog, experiment with agent discovery, and share your findings with the community.

## The Revolution Begins

Agent-to-Agent communication and the Agent Payment Protocol represent foundational infrastructure for the AI economy. Just as HTTP and HTTPS enabled the web, and APIs enabled the cloud, A2A and AP2 will enable autonomous agent ecosystems.

The businesses that optimize for agent discovery today will have first-mover advantages in AI-mediated markets. The developers who master these protocols will build the infrastructure layer of tomorrow's economy. The community that collaborates on best practices will define how autonomous agent marketplaces evolve.

The tools exist. The protocols are live. The market is emerging. The only question is: will you build in this space, or watch from the sidelines?

---

## Resources

**Official Presentation**
- [Ryan Booth's A2A/AP2 Talk](https://www.youtube.com/watch?v=d5l0D7h5bI4)
- [Full October Showcase Recording](https://www.youtube.com/watch?v=RvG3KXRiURQ)

**Protocol Documentation**
- [A2A Protocol Specification](https://a2a.to/)
- OpenAI Agent Payment Protocol Documentation

**AIMUG Resources**
- [Detailed A2A/AP2 Documentation](/docs/oct-2025/a2a-ap2-protocols)
- [October 2025 Showcase Recap](/blog/2025-10-21-october-2025-showcase-recap)
- [Join Discord Community](https://aimug.org/discord)
- [Austin LangChain GitHub](https://github.com/aimug-org/austin_langchain)

**Related Topics**
- [LangGraph Middleware API](/blog/langchain-middleware-api-release)
- [AI Cancer Detection Research](/docs/oct-2025/cancer-detection-research)
- [LLM Inference Providers](/docs/oct-2025/inference-providers)

---

*Interested in presenting your A2A/AP2 implementation at a future AIMUG event? We're looking for community members experimenting with agent marketplaces, capability schemas, and autonomous workflows. Reach out on Discord to share your work!*
