---
id: claude-code-custom-agents
title: Claude Code & Custom Agents
sidebar_label: Claude Code & Agents
---

# Claude Code & Custom Agents - From Prompt Engineering to Context Engineering

**Speaker:** Sal Castoro  
**Duration:** 15 minutes  
**Time:** 6:45 PM - 7:00 PM

## Overview

Sal presented the evolution of agentic coding tools, focusing on Claude Code's approach to context engineering and custom sub-agents. The talk covered how Claude Code addresses LLM limitations through instruction files, custom agents, and parallel execution patterns.

## 📺 Watch the Talk

<iframe width="100%" height="400" src="https://www.youtube.com/embed/HI8PBSPr6Qk" title="Claude Code & Custom Agents - Sal Castoro at AIMUG September 2025" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## The Evolution: From Prompt to Context Engineering

### The Dark Ages of Prompt Engineering (2022-2023)
- Everyone focused on crafting the "perfect prompt"
- Patterns weren't generalizable across models
- Inefficient compared to modern tooling
- Each model had its own quirks and intricacies

### The New Era: Context Engineering
- **MCP (Model Context Protocol)** and tooling provide scaffolding around foundational models
- Claude Code allows model selection (Sonnet, Opus)
- Focus shifted from prompts to managing context effectively

## Solving the Ephemeral Memory Problem

### The Challenge
- LLMs are stateless (like REST APIs)
- Context windows get compacted or cleared
- Loss of relevant information over time

### The Solution: Instruction Files
- **Claude.md files** persist state between requests
- LLM-friendly format for maintaining context
- Survives context window compaction/clearing
- Greater control over context compared to cursor/copilot

## Custom Sub-Agents in Claude Code

### Evolution of Agent Capabilities
1. **Task Command**: Early ability to run separate tasks
   - Bash commands
   - Web scraping
   - Role-based sub-agents

2. **Custom Agents Feature** (Released 2-3 months ago)
   - Pre-defined sub-agents with own system prompts
   - Don't inherit from Claude.md (isolation)
   - Complete tasks independently
   - Defined using `/agents` command

### Key Features of Custom Agents
- **Isolated Context Windows**: Each agent has its own context
- **Parallel Execution**: Run multiple agents simultaneously
- **Tool Selection**: Choose specific tools including MCP servers
- **Transportable**: Markdown files can move between projects
- **Domain-Specific**: Specialized for particular tasks

## Best Practices for Custom Agent Development

### General Guidelines
1. **One Job Per Agent**: Keep agents focused
2. **Start Read-Only**: Begin with read tools, add editing as needed
3. **Restrict Tools**: Minimize context pollution
4. **Clear Descriptions**: Help orchestrating agent know when to invoke

### Example Agent Types
- **Code Reviewer**: Runs after significant code changes
- **QA Agent**: Testing and validation
- **Debugging Agent**: Error analysis and fixes
- **Documentation Agent**: Generate/update docs

## Live Demo: Building an Astro Blog

Sal demonstrated parallel agent execution for creating a personal site with blog functionality:
- Multiple agents running simultaneously
- Each handling specific aspects (components, styling, content)
- Visual demonstration of parallel processing power

### Execution Patterns
- **Serial Execution**: Pass information from agent to agent
- **Parallel Execution**: Multiple agents work independently
- **Phase-Based**: Organize agents into execution phases

## Context Management Considerations

### The Downsides
- **Token Cost**: Each agent consumes context space
- **Context Pollution/Enrichment**: Balance between too much and too little
- **Compaction Frequency**: More agents = more frequent clearing
- **Quality Impact**: Frequent compaction reduces output quality

### Optimization Strategies
- Keep agent prompts concise
- Limit number of large sub-agents
- Monitor context usage with `/context` command
- Balance between functionality and token efficiency

## Q&A Highlights

**Q: How well do sub-agents work for visual/multi-modal tasks?**
- Mixed results with accessibility testing
- Can use Playwright MCP for headless Chrome screenshots
- Image analysis capabilities vary
- Still a work in progress

**Q: How do you determine the atomic unit for an agent?**
- Think like database transactions
- Group related small tasks together
- Example: React component creation vs unit testing
- Keep related functionality cohesive

## Key Takeaways

1. **Context engineering > Prompt engineering** for modern LLM applications
2. **Custom agents provide isolation** and prevent context pollution
3. **Parallel execution** dramatically speeds up complex tasks
4. **Balance is key**: Too many agents cause token overhead
5. **Claude Code gives fine-grained control** over context and execution

## Resources

- [📺 Watch Sal's Claude Code & Custom Agents Talk on YouTube](https://www.youtube.com/watch?v=HI8PBSPr6Qk)
- [Presentation Slides (PDF)](https://github.com/aimug-org/austin_langchain/blob/main/resources/presentations/2025-09-10-Austin-LangChain-Claude-Code-Custom-Agents.pdf)
- Claude Code documentation
- MCP (Model Context Protocol) specification
- Community agent repositories (search GitHub)
- `/agents` command for agent management
- `/context` command for monitoring token usage

## About the Speaker

Sal Castoro is an AI engineer specializing in agentic terminal-based tools and Claude Code implementations. He actively explores the boundaries of context engineering and multi-agent orchestration patterns.