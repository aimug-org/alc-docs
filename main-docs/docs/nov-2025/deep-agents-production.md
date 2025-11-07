# Deep Agents in Production - Real World Experience

**Speaker:** [Collier King](https://www.linkedin.com/in/collierking/)
**Company:** Cloudflare (Machine Learning Engineer)
**Date:** November 5, 2025
**GitHub:** [langchain-deepagents-examples](https://github.com/CollierKing/langchain-deepagents-examples/tree/main/examples/ai_theme_plays)

## Overview

Collier King shared unvarnished production experience running an $80, 3.5-hour deep agent pipeline that analyzed Jensen Huang's GTC keynote to identify and rank matching tech companies. This is his second presentation on Deep Agents, focusing on real-world learnings.

## The Use Case: AI Theme Plays

### Business Problem

Analyze Jensen Huang's NVIDIA GTC keynote to identify which tech companies align with his vision and themes.

### Pipeline Flow

```
1. Transcribe NVIDIA Keynote
   ↓
2. Extract Themes (AI factories, digital twins, etc.)
   ↓
3. Match ~400 Tech Companies Against Themes
   ↓
4. Validate Top 100 with Press Release Analysis
   ↓
5. Rank and Score Companies by Alignment
```

### Output

- **244 pages** of detailed analysis
- **87 of 100** companies successfully ranked
- Company profiles with alignment scores
- Supporting evidence from press releases

## Architecture: Four Specialized Subagents

### Why Subagents?

**Problem:** Single context window can't handle:
- Full keynote transcript
- 400 company profiles
- Press release database
- Analysis requirements

**Solution:** Specialize agents for different tasks

### 1. Transcript Analyzer

**Responsibility:** Extract themes from Jensen's keynote

**Input:**
- Full GTC keynote transcript
- Context about NVIDIA's strategic direction

**Output:**
- 7-8 key themes identified:
  - Dawn of new computing era
  - AI factories
  - Digital AI and robotics
  - End of Moore's law
  - Accelerated computing
  - Virtual cycle of generative AI
  - Digital twins and simulation

**Approach:**
- Semantic chunking of transcript
- Theme extraction with Gemini
- Consolidation of related concepts

### 2. Company Matcher

**Responsibility:** Score 400 companies against extracted themes

**Input:**
- List of themes from Transcript Analyzer
- Database of 400 company profiles (PostgreSQL)

**Output:**
- Scored list of companies
- Top 100 candidates for validation

**Challenges:**
- Must process all 400 (agents try to skip)
- Needs validation middleware
- Expensive token usage at this stage

### 3. PR Validator

**Responsibility:** Validate matches with press release evidence

**Input:**
- Top 100 companies from matcher
- Press release database (MongoDB)

**Output:**
- Evidence-backed validation
- Supporting quotes from press releases
- Confidence scores

**Approach:**
- Semantic search in press releases
- Match company claims to themes
- Filter out weak matches

### 4. Results Ranker

**Responsibility:** Final ranking and scoring

**Input:**
- Validated companies with evidence
- Original themes
- Confidence scores

**Output:**
- Final ranked list
- Detailed company profiles
- Alignment explanations

**Success:**
- 87 of 100 companies ranked
- 13 filtered out due to insufficient evidence

## Tech Stack

### Core Framework
- **LangChain + DeepAgents**
- Built on Claude Code paradigm
- Planning, decomposition, delegation

### Models
- **Google Gemini** (primary)
- Faster than Claude Sonnet 4.5 for this use case
- Good balance of speed and quality

### Data Storage
- **PostgreSQL** - Company database (~400 companies)
- **MongoDB** - Press release storage
- **Cloudflare R2** - S3-compatible object storage for outputs

### Development
- Python with Pydantic models
- Custom middleware stack
- Extensive logging

## Performance Metrics

### Runtime Statistics

| Metric | Value |
|--------|-------|
| Start Time | 12:38 AM |
| End Time | 4:00 AM |
| Duration | ~3.5 hours |
| Tokens Used | 11 million |
| Cost | $80 |
| Output | 244 pages |
| Success Rate | 87/100 companies |

### Cost Breakdown

- Most tokens in Company Matcher phase
- PR validation also expensive
- Could be optimized with better prompting
- Still cheaper than manual analysis

## Critical Learning: Middleware as Control

### The Problem

> "These LLMs are fine-tuned to save tokens. They will just naturally take shortcuts. Even the good ones like Google Gemini or Claude, they'll do this. You have to be very explicit."

**Common agent shortcuts:**
- Processing 10 companies instead of 100
- Skipping batch items
- Producing inconsistent JSON
- Exceeding context limits
- Looping through partial data

### The Solution: Middleware

**Middleware = Before/After Tool Call Hooks**

```python
# Pseudo-code
@before_tool_call
def validate_input(tool_input):
    # Check all required fields present
    # Verify batch size correct
    # Log the attempt

@after_tool_call
def validate_output(tool_output):
    # Check all companies processed
    # Verify schema compliance
    # Confirm no skipped items
```

## Middleware Architecture

### 1. S3 System Middleware

**Purpose:** Handle large outputs that exceed context windows

**Implementation:**
- Store intermediate results in Cloudflare R2
- Pass file references instead of full content
- Retrieve when needed for next step

**Benefits:**
- Bypass context window limits
- Cheaper than embedding everything
- Durable storage of intermediate state

### 2. Content Truncation Middleware

**Purpose:** Prevent context overflow

**Implementation:**
- Monitor token counts
- Truncate intelligently (keep key information)
- Warn agent when approaching limits

**Challenges:**
- Determining what to keep
- Maintaining coherence
- Agent awareness of truncation

### 3. Logging Middleware

**Purpose:** Debug 3.5-hour runs

**Implementation:**
- Log every tool call
- Capture inputs and outputs
- Timestamp all events
- Track which subagent is active

**Benefits:**
- Essential for debugging long runs
- Understand failure points
- Optimize bottlenecks
- Post-mortem analysis

### 4. Validation Tracking Middleware

**Purpose:** Ensure work actually completed

**Implementation:**
- **Stateful tools**: Track which items processed
- **Before hook**: Record what should be done
- **After hook**: Verify it was done
- **Enforcement**: Error if mismatch

**Example:**
```python
# Before: Expect to process companies 1-100
expected_companies = list(range(1, 101))

# After: Verify all processed
if processed_companies != expected_companies:
    raise ValueError(
        f"Expected {len(expected_companies)} companies, "
        f"but only processed {len(processed_companies)}"
    )
```

## The "Toddler" Approach

### Concept

> "It's like having a toddler or something. You're letting it fall down and be like, 'Well, now you know not to do that.' You're giving the error messages back to it... and it's course correcting from that as it's executing, which is a weird thing to think about."

### How It Works

1. **Agent tries something**
2. **Middleware catches error**
3. **Error fed back to agent**
4. **Agent adjusts approach**
5. **Tries again with correction**

### Example Scenario

```
Agent: "I'll process the first 10 companies as a sample"

Middleware: ❌ Error - Expected 100 companies, received 10

Agent: "Oh, I need to process all 100. Let me do that in
       batches of 25 to manage context."

Middleware: ✅ Success - All 100 companies processed
```

### Benefits

- Self-correction without manual intervention
- Learns constraints through execution
- More robust than rigid error handling
- Adapts to unforeseen issues

### Challenges

- Can increase run time (retries)
- Requires good error messages
- May loop on fundamental issues
- Needs timeout mechanisms

## Schema-Driven Development

### Pydantic Models for Everything

**Benefits:**
- Type safety
- Automatic validation
- Self-documenting code
- Example generation

### Example Structure

```python
class CompanyThemeMatch(BaseModel):
    company_name: str
    theme: str
    alignment_score: float = Field(ge=0, le=1)
    evidence: str
    confidence: Literal["high", "medium", "low"]

class CompanyMatcherOutput(BaseModel):
    matches: List[CompanyThemeMatch]
    total_companies_analyzed: int
    timestamp: datetime
```

### Schema as Prompt

Generate examples from schemas:
```python
example = CompanyThemeMatch(
    company_name="Example Corp",
    theme="AI Factories",
    alignment_score=0.85,
    evidence="Press release mentions...",
    confidence="high"
)
# Use in prompt to show expected format
```

**Benefits over hardcoded examples:**
- Schema changes propagate automatically
- No drift between code and examples
- Always valid examples
- Type-checked

## Challenges Encountered

### 1. Schema Issues

**Problem:** Schemas written incorrectly initially

**Symptom:**
- Agent produces invalid outputs
- Validation failures
- Inconsistent data structures

**Solution:**
- Iterate on schemas early
- Use Pydantic validation
- Test with real data quickly

### 2. Batch Processing Shortcuts

**Problem:** Agents loop through partial data

**Symptom:**
- Processing 10 instead of 100 companies
- Skipping batches
- Incomplete results

**Solution:**
- Stateful tools tracking progress
- Validation middleware counting items
- Explicit batch size requirements

### 3. Determinism Challenges

**Problem:** Difficult to keep deterministic across all steps

**Symptom:**
- Different results on reruns
- Inconsistent scoring
- Variable extraction

**Solution:**
- Temperature = 0 where possible
- Seed parameters
- Accept some non-determinism
- Focus on overall quality

### 4. Cost vs Quality Tradeoff

**Problem:** Expensive compared to pure LangGraph

**Symptom:**
- $80 for one run
- 11M tokens
- 3.5 hours

**Alternatives considered:**
- Pure LangGraph (more deterministic, cheaper)
- Harder to implement for complex planning
- Trade flexibility for cost

## When to Use Deep Agents vs LangGraph

### Use Deep Agents When:

✅ **Complex multi-step planning required**
- Task needs decomposition
- Multiple dependencies
- Adaptive strategy

✅ **Managing large amounts of context**
- Can't fit in single context window
- Need to coordinate across sources
- Multiple data stores

✅ **Delegating work to specialized subagents**
- Different expertise needed
- Parallel processing beneficial
- Clear separation of concerns

✅ **Long-term memory persistence**
- State spans hours/days
- Resume after interruption
- Track progress across sessions

✅ **Exploratory research tasks**
- Open-ended investigation
- Discovery-driven
- Requirements evolve during execution

### Use LangGraph When:

✅ **Deterministic workflows needed**
- Same input → same output
- Compliance requirements
- Safety-critical

✅ **Cost efficiency critical**
- Budget constraints
- High volume
- Frequent runs

✅ **Repeatability required**
- Production pipelines
- Automated workflows
- Predictable behavior

✅ **State management sufficient**
- Don't need full planning
- Linear or branching workflow
- Developer-defined structure

## Code Repository

### Available on GitHub

**Repository:** [CollierKing/langchain-deepagents-examples](https://github.com/CollierKing/langchain-deepagents-examples/tree/main/examples/ai_theme_plays)

### What's Included

**Files:**
- `agent.py` - Main agent orchestration
- `config.py` - Configuration management
- `main.py` - Entry point
- `models.py` - Pydantic data models
- `tools.py` - Tool definitions
- `subagents.py` - Subagent definitions
- `middleware.py` - All middleware implementations
- `utils.py` - Utility functions
- `pyproject.toml` - Dependencies
- `README.md` - Full documentation

**Middleware is shareable and custom-written for this use case**

### Key Components

**Stateful Tools:**
- Sequential batch validation
- Progress tracking
- Prevent offset skipping

**Validation Middleware:**
- Input/output counting
- Schema compliance
- No dropped items

**Schema-Driven Prompts:**
- Pydantic models generate examples
- No hardcoded drift
- Automatic updates

**S3-Backed Storage:**
- Handle large outputs
- Remote file storage
- Future: checkpointing for resumability

## Themes Identified from Jensen's Talk

Analysis extracted these key themes:

1. **Dawn of a New Computing Era**
   - Shift from traditional to AI-first computing
   - Fundamental transformation

2. **AI Factories**
   - Intelligence as a service
   - Manufacturing intelligence at scale

3. **Digital AI and Robotics**
   - Physical AI integration
   - Autonomous systems

4. **End of Moore's Law**
   - New paradigms needed
   - Accelerated computing as replacement

5. **Accelerated Computing**
   - GPU-centric architectures
   - Specialized silicon

6. **Virtual Cycle of Generative AI**
   - Self-improving systems
   - Feedback loops

7. **Digital Twins and Simulation**
   - Virtual representations
   - Testing and optimization

## Top Companies Identified

**Sample results (actual list is 87 companies):**

- **Microsoft** - Azure AI infrastructure, partnerships
- **NVIDIA** - Obviously, core to themes
- **Isterra Labs** - Digital twin technology
- **CoreWeave** - AI infrastructure
- [Additional 83 companies with detailed profiles]

## Key Takeaways

1. **Middleware is essential** for controlling agent behavior
2. **LLMs will take shortcuts** - validation required
3. **Stateful tools** prevent batch processing errors
4. **Schema-driven development** reduces drift
5. **The toddler approach works** - let agents learn from errors
6. **Choose the right tool**: Deep Agents for exploration, LangGraph for determinism
7. **Cost vs flexibility** - $80 bought deep analysis, but LangGraph would be cheaper
8. **Logging is critical** for 3.5-hour runs
9. **Subagent specialization** solves context window limits
10. **87% success rate** is good for exploratory research

## Future Enhancements

### Planned Improvements

**S3-Backed Checkpointing:**
- Resume after crashes
- Don't restart from batch zero
- Save intermediate state

**Cost Optimization:**
- Better prompting to reduce tokens
- More aggressive caching
- Smaller models for simple steps

**Determinism Improvements:**
- More structured outputs
- Stricter validation
- Seed consistency

**Scaling:**
- Parallel subagent execution
- Batch processing optimization
- Distributed storage

## Q&A Highlights

**Q: Why Gemini over Sonnet 4.5?**
A: Speed. For this use case, Gemini was faster and the quality was sufficient. Sonnet is better for complex reasoning, but runtime matters for 3.5-hour pipelines.

**Q: Could this be done cheaper?**
A: Yes, with LangGraph and better prompting. But then you lose the planning flexibility. It's a tradeoff.

**Q: How do you test middleware?**
A: Unit tests for validation logic, but mostly integration tests with real agent runs. The middleware needs to see actual agent behavior to be useful.

**Q: What about rate limits?**
A: We handle those in middleware too. Exponential backoff, retry logic, all in the before/after hooks.

---

*Watch the full talk and see the live demo: [YouTube Recording](https://www.youtube.com/watch?v=JOiUYZhGhH8)*
