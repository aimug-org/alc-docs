---
slug: january-2025-community-call-recap
title: Austin LangChain Community Call Recap - January 30, 2025
authors: [colinmcnamara, RPirruccio, that1guy15]
tags: [meetup, recap, community-call, sxsw, ai-development]
---

The Austin LangChain AI Group held its community call on January 30, 2025, bringing together key members to discuss upcoming events, technical developments, and community initiatives. The call showcased the group's commitment to fostering AI innovation and community engagement in Austin.

<!-- truncate -->

## Meeting Overview

The community call took place on Google Meet at 14:02, with active participation from Dmitri, Ryan, Vaskin, Karim, Orlando, Colin, Rob, Ricky, John, and Brad. The discussion covered several exciting developments and upcoming events.

## Upcoming Wednesday Event (February 5)

### Image Generation Showcase
- Colin will demonstrate scripts that transform blog posts into images using Replicate
- Karim will present a local implementation powered by a 4090 GPU

### GPT Researcher Demo
- Demonstration of GPT Researcher implementation using LangGraph
- Integration highlights:
  - LangSmith integration
  - DeepSeek implementation
  - Potential MCP adapter integration

The team is also upgrading the recording setup with a splitter for enhanced video quality. Notably, Austin Public Access offers professional equipment access through their certification program.

## SXSW Event Planning

The group is making significant progress on the SXSW party organization:
- Venue negotiations are in final stages with a local law firm
- Ryan is preparing a comprehensive social media campaign
- Collaborations are being established with AI Texas and other local tech groups
- Ricky is developing a dedicated event page on AIMUG.org using Docusaurus with Google Forms integration

## Technical Discussions

### DeepSeek Implementation
- Ryan shared insights from testing the 72B model locally with OLLAMA
- Current challenges include:
  - Infinite "thinking" loop issues
  - Tool calling limitations
- Potential solutions being explored:
  - Fine-tuning options
  - Hybrid approach combining DeepSeek for thinking and Sonnet for editing

### Model Architecture Insights
The team discussed advanced topics in AI architecture:
- 37B forward pass implementation using specialized sub-networks
- Exploration of GPT4 and Gemini approaches with G-Shard methodology
- Investigation of streaming model layers from NVMe to GPU
- Advanced router fine-tuning strategies

## Action Items

1. Event Updates:
   - Colin: Update Meetup event with technical topics
   - Colin: Connect with Jay from Austin AI regarding SXSW events
   - Colin & Ricky: Collaborate on MCP adapter for LangGraph

2. SXSW Preparations:
   - Ryan: Launch social media campaign
   - Ricky: Develop SXSW event page on AIMUG.org

## Current Challenges

- DeepSeek API stability issues and timeouts
- Tool calling constraints in current model implementations
- Complexity in coordinating multiple AI community initiatives

## Progress Update

### Completed
- Demo outlines
- LangGraph implementation approach
- Recording setup improvement strategy

### In Progress
- SXSW event planning
- Website development
- MCP integration work

### Next Steps
- Wednesday showcase/mixer execution
- SXSW collaboration expansion

The community call demonstrated the group's momentum in advancing AI development in Austin while fostering a collaborative environment for learning and innovation. The upcoming events and technical initiatives showcase the group's commitment to pushing boundaries in AI implementation and community engagement.

For more information about the Austin LangChain AI Group and upcoming events, visit our [Meetup page](https://www.meetup.com/austin-langchain-ai-group/).
