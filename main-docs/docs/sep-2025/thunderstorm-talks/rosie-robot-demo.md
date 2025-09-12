---
id: rosie-robot-demo
title: Rosie the Robot - Desktop Organization Assistant
sidebar_label: Rosie Robot Demo
---

# Rosie the Robot - Your Digital Desktop Maid

**Speaker:** James Coffey  
**Duration:** 15 minutes  
**Time:** 7:15 PM - 7:30 PM

## Overview

James Coffey presented Rosie the Robot, a desktop organization assistant that tackles the universal problem of messy digital workspaces. As a newcomer to AIMUG (attending for just 2 months), James jumped right in to solve his own pain point: years of accumulated desktop chaos.

## 📺 Watch the Talk

<iframe width="100%" height="400" src="https://www.youtube.com/embed/-TgsPm_54so" title="Rosie the Robot - Desktop Automation with Agents - James Coffey at AIMUG September 2025" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## The Problem

### Digital Chaos
- **2-3 years** of accumulated junk on desktop
- Vague file names
- Duplicates everywhere
- Random downloads
- Must click files to discover contents

### Why Not Traditional Methods?
- Deterministic methods (K-means clustering) don't provide intuitive naming
- Don't structure files according to personal preferences
- Need something smarter and more contextual

## The Solution: Rosie the Robot

### Vision
A digital maid that:
1. Asks a few questions
2. Proposes changes
3. Gets approval (human-in-the-loop)
4. Safely organizes your computer
5. Reports what it did
6. Doesn't need to run again

### Current Implementation Status
- **CLI interface** (command-line tool)
- **SQLite event store** for state management
- **LangGraph-ready** architecture
- **Deterministic core** (no LLM yet - coming later)

## Technical Architecture

### Core Components

#### 1. File Scan Tool
- Walks through directories
- Scans for all files
- Builds inventory of chaos

#### 2. Embeddings Tool with Fallbacks
- **Primary**: HDB scan clustering
- **Fallback 1**: Agglomerative clustering
- **Fallback 2**: Cosine similarity
- **Naming**: TF-IDF for cluster names

#### 3. Tree Shaper
- Keeps directory structure flat
- Prevents overly deep nesting
- Maintains accessibility

#### 4. Checkpointing & File Ops
- Safe operations with undo capability
- Windows recycle bin integration
- Non-destructive by default

### Three-Agent Architecture (Planned)

1. **Planner Agent**
   - Scans everything
   - Creates organization strategy
   
2. **Reviewer Agent**
   - Human-in-the-loop interface
   - Asks what to keep/rename
   - Gathers user preferences
   
3. **Executor Agent**
   - Combines algorithmic clustering
   - Applies user preferences
   - Performs actual file operations

## Live Demo

### Dry Run Scan
James demonstrated scanning his downloads folder:
- Less than 1 minute execution
- Generated cluster proposals
- Created directory structure plan
- Showed confidence levels for moves

### Key Features Shown
- **Two action tables**: Create directories & Move files
- **Confidence levels** (currently hardcoded at 0.6)
- **Largest folders** analysis
- **Safety first**: Won't execute without explicit "yes"
- **Recycle bin integration**: All deletions recoverable

### Developer Cleanup Mode
Special mode for developers:
- Finds common caches
- Identifies virtual environments
- Safely removes with recycle bin backup

## Development Philosophy

### Start Simple, Add Intelligence
1. **Phase 1**: Deterministic core (current)
2. **Phase 2**: Add LLM capabilities
3. **Phase 3**: Full LangGraph integration

### Key Principles
- **One painful use case** (messy desktop)
- **Clear definition of done** (clean desktop)
- **Human-in-the-loop gates** on risky steps
- **Build deterministic first**, add AI later

## Technical Details

### Current Stack
- Python
- SQLite for event store
- Pydantic (learning)
- LangGraph skeleton (ready for integration)

### Clustering Approach
- HDB scan for primary clustering
- TF-IDF for naming
- Confidence scoring (to be refined)
- Multiple fallback algorithms

## Q&A Insights

**Q: How is confidence calculated?**
- Currently hardcoded at 0.6
- Planning to implement proper confidence scoring
- Will use classification and assignment confidence

**Q: Is anyone building end-to-end applications?**
- James asked the community about their focus
- Mix of internal dev tooling and end-user applications
- Goal: Make this downloadable as .exe for non-developers

**Q: Interesting approach combining traditional ML with LLMs**
- Using established clustering algorithms
- LLMs will enhance, not replace, deterministic core
- Best of both worlds approach

## Roadmap

### Next Steps
1. Implement actual confidence calculations
2. Add LangGraph agents
3. Build human-in-the-loop UI
4. Create executable for non-developers
5. Add LLM enhancement layer

### Future Features
- Smart naming based on content
- Learning from user corrections
- Pattern recognition for file types
- Automated scheduling

## Key Takeaways

1. **Start with deterministic solutions** before adding LLMs
2. **Traditional data science still valuable** in AI era
3. **Human-in-the-loop essential** for file operations
4. **Safety first**: Always provide undo options
5. **Solve your own problems** - best motivation

## Development Approach

James emphasized getting feedback early:
- "Instead of overbuilding before I get feedback, this is feedback"
- Live production development
- Community-driven improvements
- Iterative enhancement

## Resources

- [📺 Watch James's Rosie the Robot Talk on YouTube](https://www.youtube.com/watch?v=-TgsPm_54so)
- Follow James on X: @jamescoffey
- Project updates at next AIMUG meetings
- Background: Data science, MLOps, developer advocacy

## About the Speaker

James Coffey is new to the Austin AI community (2 months) but brings extensive experience in data science and MLOps. Previously a developer advocate, he's diving into AI engineering by solving his own messy desktop problem. This is his first LangChain/LangGraph project, demonstrating that the community welcomes all skill levels.