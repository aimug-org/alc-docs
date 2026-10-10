---
title: Integrating AI Workflows with MCP, OpenWeb UI, LangChain, and LangGraph
description: A technical overview of Karim Lalani's presentation on connecting diverse AI tools into cohesive workflows
---

# Integrating AI Workflows

In this session from our March 5, 2025 "March Mixer - Off SXSW Edition" event, Karim Lalani presented a comprehensive overview of integrating various AI technologies to create cohesive, powerful workflows. This documentation provides a technical summary of the key concepts and implementations demonstrated.

<iframe width="560" height="315" src="https://www.youtube.com/embed/rq69zhxZS-8" title="Karim Lalani's talk on integrating AI workflows" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Key Technologies Covered

### Model Context Protocol (MCP)

Karim demonstrated how MCP serves as a standardized interface for connecting AI models and tools:

- **Unified Access Layer**: MCP provides a consistent interface to different AI models and capabilities
- **Seamless Integration**: Acts as an accessible front-end for managing both prompt generation and image generation workflows
- **Local and Edge Compute**: Demonstrated integration ranging from local 4090-based workstations to secure Cloudflare tunnels

### OpenWeb UI and Pipeline Architecture

Originally a simple chat interface for local models, OpenWeb UI has evolved into a versatile platform:

- **Docker-based Pipelines**: Running separate pipeline servers in Docker containers eliminates dependency conflicts
- **Modular Design**: Multiple pipeline servers can operate simultaneously without interference
- **Consistent Interface**: Provides unified access to diverse AI capabilities from ChatGPT-style interactions to image generation

### LangGraph: Two Implementation Approaches

LangGraph offers two distinct paradigms for building workflows:

#### Graph API

- Visual, node-based approach ideal for complex workflows
- Explicit state management and checkpointing
- Better visualization and debugging of complex processes
- Clear representation of logic flows

#### Functional API

- More Pythonic approach allowing rapid prototyping
- Direct implementation of logic without nodes and edges abstraction
- Simpler syntax for straightforward workflows
- Easier to integrate with existing Python code

Both approaches support checkpointing and human-in-the-loop interactions but differ in implementation details.

## Real-World Implementation: Image Generation Workflow

Karim demonstrated a practical workflow combining these technologies:

1. **User Provides Topic**: A simple topic or idea is provided as input
2. **AI-Enhanced Prompt Generation**: Lama 3.2 generates a detailed image prompt based on the topic
3. **Human-in-the-Loop Refinement**: Users can accept or reject the generated prompt
4. **Image Generation**: Once satisfied with the prompt, it's sent to ComfyUI for image generation
5. **Result Display**: The final image is made available via a URL

This workflow was implemented in three different ways:

1. Using LangGraph's Graph API with explicit nodes and edges
2. Using LangGraph's Functional API with a more imperative approach
3. Wrapped in an OpenWeb UI pipeline for access through a chat interface

## MCP Inspector Tool

The demonstration highlighted the MCP Inspector tool:

- Acts as a test harness for experimenting with MCP configurations
- Allows parameter adjustment without excessive token expenditure
- Provides an intuitive interface for running tests and observing outputs in real-time

## Comparative Analysis

Karim shared insights on the different implementation approaches:

- **Graph API**: Better for complex workflows with many steps, but requires more upfront design
- **Functional API**: Easier to prototype and integrate with existing code, more intuitive for Python developers
- **Development Experience**: Functional API required significantly less time to implement than the Graph API version

## Implementation Considerations

For teams looking to implement similar integrated workflows:

- Functional API may be better for rapid prototyping and simpler workflows
- Graph API offers better visualization and state management for complex applications
- Stateless design patterns can be challenging to implement in both approaches
- SQLite or Postgres-based checkpointing is essential for maintaining state across interactions

## Conclusion

Karim's presentation demonstrated how combining MCP, OpenWeb UI pipelines, LangChain, and LangGraph creates a flexible, modular framework for building sophisticated AI-driven applications. The session highlighted the ongoing trend toward integrated, easily configurable systems that make advanced AI technology more accessible to developers.

---

*This documentation is based on Karim Lalani's presentation at the March 5, 2025 Austin LangChain AI Middleware User Group meeting. For the complete presentation, refer to the video above.*
