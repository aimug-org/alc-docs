---
id: deep-agents
title: Deep Agents Architecture
sidebar_label: Deep Agents
---

# Deep Agents - Batteries-Included Deep Research Framework

**Speaker:** Collier King  
**Duration:** 15 minutes  
**Time:** 7:00 PM - 7:15 PM

## Overview

Collier King presented LangChain's new Deep Agents framework - a Python package that brings Claude Code's best patterns to LangGraph. The talk demonstrated how Deep Agents solves the "shallow agent" problem through sustained context, long-term planning, complex workflows, and parallelization.

## 📺 Watch the Talk

<iframe width="100%" height="400" src="https://www.youtube.com/embed/q9uR4YD3I6E" title="Deep Agents - Collier King at AIMUG September 2025" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## The Problem: Shallow Agents

### Traditional Agent Limitations
- Simple LLM calling tools in a loop until condition met
- Doesn't work for complicated use cases
- Key pain points:
  - **Sustained context** is difficult
  - **Long-term planning** is tough
  - **Complex workflows** not feasible
  - **Parallelization and delegation** not easy

## The Solution: Deep Agents

### What is Deep Agents?
- Python package inspired by Claude Code
- Harrison (LangChain founder) reverse-engineered Claude Code
- All LangGraph under the hood
- Simple function call bootstraps entire agent: `create_deep_agent()`

### Growth Trajectory
- Brand new framework but growing rapidly
- Log-scaled star history shows strong adoption
- Growth trajectory comparable to LangChain/LangGraph

## Four Core Components

### 1. Planning Tool
- Reverse-engineered from Claude Code
- Creates and tracks plans through to-do lists
- Maintains focus over long executions
- Enables agents to stay on track

### 2. Sub-Agents System
- Subordinate agents with own prompts and tools
- **Context quarantine** prevents pollution
- Main agent not flooded with irrelevant details
- General purpose sub-agent handles background tasks

Example sub-agent creation:
```python
# Simple sub-agent definition
- Name
- Description  
- Prompt
- Model (can differ from main agent)
```

### 3. System Prompts
- Built-in system prompt from Claude Code
- Currently **not editable** (part of the package)
- LangChain says: "This is what makes this package good"
- User can only customize via instructions parameter
- On roadmap to allow customization

### 4. Virtual File System
- Built on LangGraph state object
- In-memory file system (not actual files)
- Enables parallel execution without conflicts
- Sub-agents can create/edit virtual files
- Scales well for concurrent operations

## Built-in Tools

Five essential tools come standard:
1. **To-do list**: `write_todos()` function
2. **Write file**: Create virtual files
3. **Read file**: Access virtual files
4. **LS**: List virtual files
5. **Edit file**: Modify virtual files

These tools enable:
- Sub-agents tracking their work
- Main agent delegating effectively
- Rapid file editing in succession
- State management across agents

## Live Demo: Product Manager Research Agent

### Use Case
Collier demonstrated a product manager research tool for Cloudflare's Workers AI:

**Questions addressed:**
- Who are our customers?
- What are their use cases?
- Are we solving their problems?
- What are we telling them (marketing)?
- What are they telling us (social media)?

### Implementation
- **Marketing sub-agent**: Analyzes outbound materials
- **Social media sub-agent**: Analyzes customer feedback
- Both extract use cases and personas
- Main agent compares outputs (Venn diagram analysis)
- Identifies gaps and overlaps

### Results (1 minute 48 seconds with Sonnet)
**Overlapping use cases:**
- AI application development
- Serverless AI computing
- Edge AI processing
- Image processing

**Marketing overemphasis:**
- Threat intelligence
- Automated social media
- Focus on CTOs/CISOs vs individual developers
- Large enterprise focus

**Performance notes:**
- Analyzed 500 random social media posts
- Processed extensive marketing materials
- Sonnet: ~1:48 execution time
- Opus: Higher quality but slower

## Configuration & Setup

### Simple initialization:
```python
create_deep_agent(
    tools=[...],        # Your custom tools
    prompt=instructions, # Your instructions
    sub_agents=[...],   # Optional sub-agents
    model=...          # LLM selection
)
```

### Returns:
- Planning tool
- File system
- System prompts for sub-agents
- General purpose sub-agent
- Complete LangGraph agent

## Advanced Features

### Observability
- Post-model hook parameter for logging
- Verbose logging recommended
- Without logging: "What is going on?"
- Essential for debugging complex workflows

### Human-in-the-Loop
- Supported via LangGraph features
- Interrupt capabilities
- MCP adapter integration

### Execution Pattern
1. Agent writes to-dos
2. Launches sub-agents
3. Tracks completion status
4. Compares results
5. Provides recommendations

## Q&A Insights

**Q: Does it support human-in-the-loop?**
- Yes, built on LangGraph features
- Documented in README
- Full interrupt capabilities

**Q: How do you add observability?**
- Use post_model_hook parameter
- Pass custom logger
- Essential for understanding execution

## Key Takeaways

1. **Deep Agents = Claude Code patterns + LangGraph power**
2. **Solves shallow agent problems** through better architecture
3. **Virtual file system** enables safe parallelization
4. **Context quarantine** prevents pollution
5. **Production-ready** for deep research use cases

## Recommendations

- Check out Colin's blog for detailed tutorials
- Start with simple use cases
- Use verbose logging initially
- Test with different models (Sonnet vs Opus)
- Consider for research-heavy applications

## Resources

- [📺 Watch Collier's Deep Agents Talk on YouTube](https://www.youtube.com/watch?v=q9uR4YD3I6E)
- [Presentation Slides (PDF)](https://github.com/aimug-org/austin_langchain/blob/main/resources/presentations/2025-09-10%20Austin%20LangChain%20-%20DeepAgents.pdf)
- Deep Agents GitHub Repository: `github.com/langchain-ai/deep-agents`
- Colin's Deep Agents blog post (mentioned in talk)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- Post_model_hook examples in README

## About the Speaker

Collier King works at Cloudflare and specializes in distributed AI systems and multi-agent coordination. He actively uses LangGraph in production systems and contributes to the Austin AI community.