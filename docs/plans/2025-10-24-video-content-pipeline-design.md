# AIMUG Video-to-Content Pipeline Design

**Date:** 2025-10-24
**Author:** Colin McNamara
**Status:** Design Approved

## Executive Summary

This document describes the design for an automated content generation pipeline that processes AIMUG meeting videos (full sessions and individual speaker clips) into Learn documentation, blog posts, and social media content. The system uses LangGraph 1.0 for orchestration, local Ollama models for video analysis (cost optimization), and Claude API for content generation and fact-checking.

## Problem Statement

Currently, publishing AIMUG meeting content requires significant manual effort:
- Watching full videos to extract key points
- Writing Learn documentation manually
- Creating blog posts from scratch
- Crafting platform-specific social media content
- Manually verifying links and technical claims
- Coordinating timing between full meeting and individual session releases

This manual process delays content publication and limits the community's ability to share knowledge quickly.

## Goals

### Primary Goals
1. **Automated Content Generation**: Transform YouTube videos into Learn docs, blog posts, and social media content
2. **Fact-Checked Accuracy**: Verify technical claims and links before publication
3. **Fast Turnaround**: Publish content within hours of video upload
4. **Cost Optimization**: Minimize API costs through local processing where possible

### Secondary Goals
1. **Review Workflow**: Generate PRs for human review before publishing
2. **Multi-Platform Social**: Create platform-specific content (X threads, LinkedIn, email)
3. **Smart Image Extraction**: AI decides when to extract and use video frames

## Architecture

### High-Level Design

```
┌─────────────┐
│  CLI Input  │
│ (video URL) │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│         LangGraph 1.0 State Machine         │
├─────────────────────────────────────────────┤
│                                             │
│  1. Input Stage                             │
│     ├─ Parse CLI args                       │
│     └─ Validate YouTube URL                 │
│                                             │
│  2. Video Analysis Stage (Ollama Local)     │
│     ├─ Extract keyframes                    │
│     ├─ Run vision model on frames           │
│     ├─ Process audio (Whisper)              │
│     └─ Structure insights                   │
│                                             │
│  3. Image Decision Stage (AI)               │
│     ├─ Analyze if images valuable           │
│     ├─ Extract selected frames              │
│     └─ Generate alt-text                    │
│                                             │
│  4. Content Generation Stage (Claude API)   │
│     ├─ Generate Learn documentation         │
│     ├─ Generate blog post                   │
│     └─ Generate social content              │
│         ├─ AIMUG X thread (280 char)        │
│         ├─ Personal X thread (longer)       │
│         ├─ LinkedIn post                    │
│         └─ Email blast                      │
│                                             │
│  5. Fact Checking Stage (Context7 + Perplexity)│
│     ├─ Validate all links (HTTP 200)        │
│     ├─ Verify technical claims              │
│     └─ Cross-reference resources            │
│                                             │
│  6. Human Review Stage                      │
│     ├─ Present flagged items                │
│     └─ Approve/Abort/Auto-correct           │
│                                             │
│  7. PR Generation Stage                     │
│     ├─ Create feature branch                │
│     ├─ Copy files to correct locations      │
│     ├─ Create GitHub PR                     │
│     └─ Add social content to PR comments    │
│                                             │
└─────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│  GitHub PR   │
│  + Socials   │
└──────────────┘
```

### Technology Stack

- **Orchestration**: LangGraph 1.0 (Python)
- **Local Processing**:
  - Ollama (llama3.2-vision) for video frame analysis
  - Whisper for audio transcription
  - Pillow for image optimization
- **Cloud APIs**:
  - Claude Sonnet 4.5 for content generation
  - Context7 MCP for library documentation
  - Perplexity MCP for fact-checking
- **Infrastructure**: Mac M4 (128GB RAM, local processing)
- **Version Control**: Git + GitHub CLI
- **Observability**: LangSmith for debugging

## Detailed Component Design

### State Schema

```python
from typing import TypedDict, Optional, Literal

class InputState(TypedDict):
    """User-provided input"""
    video_url: str
    video_type: Literal["full_meeting", "individual_session"]
    transcript: Optional[str]

class OutputState(TypedDict):
    """Final output to user"""
    pr_url: str
    social_content: dict

class PipelineState(InputState, OutputState):
    """Internal pipeline state"""
    # Video analysis
    video_analysis: dict

    # Image extraction
    extract_images: bool
    image_candidates: list
    extracted_images: list

    # Generated content
    learn_content: Optional[str]
    blog_content: str
    social_content: dict

    # Fact checking
    fact_check_results: list
    claims_flagged: int

    # Review
    human_approved: bool
```

### LangGraph Nodes

#### 1. Input Node
```python
def input_node(state: InputState) -> dict:
    """Validate input and initialize state"""
    # Validate YouTube URL format
    # Check video exists and is accessible
    # Load transcript if provided, else set to None
    return {
        "video_url": validated_url,
        "video_type": video_type,
        "transcript": transcript_or_none
    }
```

#### 2. Video Analysis Node
```python
def video_analysis_node(state: PipelineState) -> dict:
    """Extract structured insights from video"""
    # Extract keyframes at scene changes
    # Run Ollama llama3.2-vision on each frame
    # Extract text from slides (OCR)
    # Process audio with Whisper if no transcript
    # Combine visual + audio into structured format

    return {
        "video_analysis": {
            "meeting_metadata": {
                "date": "2025-01-15",
                "title": "January Showcase",
                "speakers": [...],
                "duration": "120min"
            },
            "key_topics": [...],
            "technical_concepts": [...],
            "demos_shown": [...],
            "resources_mentioned": [...]
        }
    }
```

#### 3. Image Decision Node (Using Command)
```python
from langgraph.types import Command

def image_decision_node(state: PipelineState) -> Command[Literal["extract_images", "content_generation"]]:
    """AI decides if images should be extracted"""
    # Analyze video frames for valuable static content
    # Criteria: slides with code/diagrams, architecture diagrams, demo screenshots
    # Skip: talking heads only, simple discussions

    if has_valuable_images:
        return Command(
            goto="extract_images",
            update={
                "extract_images": True,
                "image_candidates": candidate_frames
            }
        )
    else:
        return Command(
            goto="content_generation",
            update={"extract_images": False}
        )
```

#### 4. Image Extraction Node (Conditional)
```python
def extract_images_node(state: PipelineState) -> dict:
    """Extract and optimize images from video"""
    # Save to /main-docs/static/img/showcases/YYYY-MM/
    # Compress and optimize (max 1920px width)
    # Generate alt-text using Claude Vision API

    return {
        "extracted_images": [
            {
                "path": "/img/showcases/2025-10/01-title-slide.png",
                "alt_text": "October 2025 AIMUG Showcase title slide",
                "context": "Introduction slide showing event details"
            },
            ...
        ]
    }
```

#### 5. Content Generation Node
```python
def content_generation_node(state: PipelineState) -> dict:
    """Generate all content using Claude API"""
    # Use video_analysis + extracted_images as context
    # Generate in parallel:
    #   - Learn documentation (following existing template)
    #   - Blog post (with truncate marker, validated tags)
    #   - AIMUG X thread (5-7 tweets, 280 chars each)
    #   - Personal X thread (3-5 tweets, longer)
    #   - LinkedIn post (1500-2000 chars)
    #   - Email blast (using email template)

    return {
        "learn_content": "...",
        "blog_content": "...",
        "social_content": {
            "aimug_twitter_thread": [...],
            "personal_twitter_thread": [...],
            "linkedin_post": "...",
            "email_blast": "..."
        }
    }
```

#### 6. Fact Checking Node
```python
def fact_check_node(state: PipelineState) -> dict:
    """Verify links and technical claims"""
    # Link validation (parallel HTTP requests)
    # Technical claim verification via Context7 MCP
    # Recent announcements via Perplexity MCP
    # Cross-reference speaker info, event dates

    return {
        "fact_check_results": [
            {
                "claim": "LangGraph 1.0 stable release",
                "status": "verified",
                "source": "context7:/langchain-ai/langgraph"
            },
            ...
        ],
        "claims_flagged": 0  # or count of issues
    }
```

#### 7. Human Review Node (Using Command)
```python
def human_review_node(state: PipelineState) -> Command[Literal["auto_correct", "pr_generation", END]]:
    """Present flagged items for human review"""
    if state["claims_flagged"] == 0:
        return Command(goto="pr_generation")

    # Present summary of flagged items
    user_choice = prompt_user(state["fact_check_results"])

    if user_choice == "approve":
        return Command(goto="pr_generation", update={"human_approved": True})
    elif user_choice == "abort":
        return Command(goto=END)
    elif user_choice == "auto_correct":
        return Command(goto="auto_correct")
```

#### 8. PR Generation Node
```python
def pr_generation_node(state: PipelineState) -> dict:
    """Create GitHub PR with content"""
    # Create branch: content/YYYY-MM-DD-meeting-name
    # Copy files to correct locations:
    #   - docs/MMM-YYYY/
    #   - blog/YYYY-MM-DD-title/
    #   - static/img/showcases/YYYY-MM/
    # git add, commit, push
    # gh pr create with social content in comments

    return {
        "pr_url": "https://github.com/aimug-org/alc-docs/pull/123"
    }
```

### File Placement Strategy

#### Learn Documentation
- **Full Meeting**: `main-docs/docs/MMM-YYYY/index.md`
  - Example: `docs/oct-2025/index.md`
  - Contains: video embed, featured content list, event details, key topics

- **Individual Sessions**: `main-docs/docs/MMM-YYYY/session-topic-name.md`
  - Example: `docs/oct-2025/langgraph-middleware.md`
  - Contains: individual video embed, deep-dive content, speaker bio
  - Referenced from parent `index.md`

#### Blog Posts
- **Location**: `main-docs/blog/YYYY-MM-DD-descriptive-slug/`
  - Example: `blog/2025-10-23-october-showcase-highlights/`
- **Files**:
  - `index.md` - Main blog post
  - `.context.md` - Purpose documentation
- **Requirements**:
  - Include `<!-- truncate -->` after intro
  - Validate tags against `blog/tags.yml`

#### Images
- **Location**: `main-docs/static/img/showcases/YYYY-MM/`
  - Example: `static/img/showcases/2025-10/01-title-slide.png`
- **Naming**: `NN-descriptive-name.png`
- **Metadata**: Stored in `image-metadata.json` with alt-text

#### Social Media Drafts
- **NOT committed to repository**
- Posted as PR comment for copy/paste
- Organized by platform

## Content Flow Scenarios

### Scenario 1: Full Meeting Video
1. User runs: `python pipeline.py --video-url https://youtube.com/... --mode full`
2. Pipeline processes full meeting video
3. Generates:
   - `docs/oct-2025/index.md` (monthly overview)
   - `blog/2025-10-23-october-showcase/index.md`
   - Social content (all platforms)
4. Creates PR for review
5. After merge, social content posted manually

### Scenario 2: Individual Session Video
1. User runs: `python pipeline.py --video-url https://youtube.com/... --mode session`
2. Pipeline processes individual session
3. Generates:
   - `docs/oct-2025/speaker-topic.md` (new page)
   - Updates `docs/oct-2025/index.md` (adds link)
   - `blog/2025-10-25-speaker-topic/index.md`
   - Social content highlighting speaker
4. Creates PR for review

## Error Handling & Resilience

### Checkpointing
- Use LangGraph's `MemorySaver` checkpointer
- State saved after each node completion
- Resume from last successful node on crash
- Checkpoints stored in `.langgraph_checkpoints/YYYY-MM-DD-HHmmss/`

### Retry Logic
- **Video Analysis Failures**: Retry with smaller frame batch, fallback to transcript-only
- **API Rate Limits**: Exponential backoff for Claude/Perplexity
- **Link Check Timeouts**: Mark as "needs manual review" after 3 attempts
- **Git Conflicts**: Abort gracefully with clear error message

### Graceful Degradation
- If image extraction fails → continue without images
- If fact-check API unavailable → flag for manual review
- If one social platform fails → continue with others

## Performance & Cost Optimization

### Local Processing (Free)
- Video frame extraction: ffmpeg
- Frame analysis: Ollama llama3.2-vision (M4 GPU)
- Image optimization: Pillow
- Audio transcription: Whisper (if needed)

### Cloud API Usage (Paid)
- Content generation: Claude Sonnet 4.5 (~10K tokens/video)
- Fact checking: Context7 + Perplexity (~5K tokens/video)
- Image alt-text: Claude Vision (~1K tokens/video)

**Estimated Cost per Video**: $0.50 - $1.00

### Caching Strategy
- Cache video analysis results (avoid reprocessing)
- Cache Context7 library docs for same libraries
- Cache Perplexity responses for 24 hours

## Observability & Debugging

### LangSmith Integration
- Tag runs with: `video_url`, `meeting_type`, `timestamp`
- Track token usage per node
- Log fact-check results
- Capture errors with full context

### Logging
- Structured JSON logs
- Log levels: DEBUG (development), INFO (production)
- Log to both stdout and file

## Security & Privacy

### API Keys
- Store in environment variables
- Never commit to git
- Use `.env` file locally

### Video Content
- No PII extracted or stored
- Speaker names only from video metadata
- No audio recordings saved (unless explicitly provided)

## Testing Strategy

### Unit Tests
- Each node function tested in isolation
- Mock external APIs (Ollama, Claude, Context7)
- Test state transitions

### Integration Tests
- End-to-end pipeline with sample video
- Verify file placement correctness
- Validate PR creation

### Manual Testing
- Process real AIMUG video
- Review generated content quality
- Verify fact-checking accuracy

## Future Enhancements

### Phase 2 (Post-MVP)
- Automated social media posting (Twitter API, LinkedIn API)
- Speaker bio extraction from video
- Multi-language support
- Video chapter detection
- Automated tagging based on content analysis

### Phase 3 (Advanced)
- Real-time processing during live streams
- Interactive Q&A extraction
- Code snippet extraction from demos
- Automated YouTube description generation

## Success Metrics

- **Time Savings**: Reduce content creation from 4 hours → 30 minutes
- **Quality**: 90%+ fact-check accuracy
- **Adoption**: Used for 100% of monthly showcases
- **Cost**: <$1 per video processing
- **Speed**: Content PR ready within 2 hours of video upload

## Appendices

### Appendix A: LangGraph 1.0 Code Structure

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command

# Build graph
builder = StateGraph(
    state=PipelineState,
    input=InputState,
    output=OutputState
)

# Add nodes
builder.add_node("input", input_node)
builder.add_node("video_analysis", video_analysis_node)
builder.add_node("image_decision", image_decision_node)
builder.add_node("extract_images", extract_images_node)
builder.add_node("content_generation", content_generation_node)
builder.add_node("fact_check", fact_check_node)
builder.add_node("human_review", human_review_node)
builder.add_node("pr_generation", pr_generation_node)

# Add edges
builder.add_edge(START, "input")
builder.add_edge("input", "video_analysis")
builder.add_edge("video_analysis", "image_decision")
# image_decision uses Command to route
builder.add_edge("extract_images", "content_generation")
builder.add_edge("content_generation", "fact_check")
builder.add_edge("fact_check", "human_review")
# human_review uses Command to route
builder.add_edge("pr_generation", END)

# Compile with checkpointer
checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

# Invoke
result = graph.invoke(
    {"video_url": "...", "video_type": "full_meeting"},
    config={"configurable": {"thread_id": "meeting-oct-2025"}}
)
```

### Appendix B: Example Video Analysis Output

```json
{
  "meeting_metadata": {
    "date": "2025-10-01",
    "title": "October 2025 AIMUG Showcase",
    "speakers": [
      {"name": "Colin McNamara", "topic": "LangGraph 1.0 Middleware"},
      {"name": "Ryan Booth", "topic": "A2A/AP2 Protocols"}
    ],
    "duration": "120min",
    "attendance": 60
  },
  "key_topics": [
    {
      "topic": "LangGraph Middleware",
      "timestamp": "00:15:30",
      "summary": "Introduction to LangGraph 1.0 middleware hooks",
      "speaker": "Colin McNamara"
    }
  ],
  "technical_concepts": [
    {
      "concept": "LangGraph 1.0",
      "context": "Stable release with middleware support",
      "links_mentioned": ["https://langchain-ai.github.io/langgraph/"]
    }
  ],
  "demos_shown": [
    {
      "title": "Middleware Hook Demo",
      "timestamp": "00:20:00",
      "technologies": ["Python", "LangGraph", "LangSmith"]
    }
  ],
  "resources_mentioned": [
    {
      "type": "github",
      "url": "https://github.com/aimug-org/austin_langchain",
      "context": "AIMUG community repository"
    }
  ]
}
```

### Appendix C: CLI Interface

```bash
# Full meeting processing
python pipeline.py --video-url https://youtube.com/watch?v=... --mode full

# Individual session processing
python pipeline.py --video-url https://youtube.com/watch?v=... --mode session

# With pre-existing transcript
python pipeline.py --video-url https://youtube.com/... --mode full --transcript transcript.txt

# Dry run (no PR creation)
python pipeline.py --video-url https://youtube.com/... --mode full --dry-run

# Resume from checkpoint
python pipeline.py --resume meeting-oct-2025
```

## References

- [LangGraph 1.0 Documentation](https://langchain-ai.github.io/langgraph/)
- [Ollama Model Library](https://ollama.ai/library)
- [Context7 MCP Documentation](https://context7.io)
- [AIMUG GitHub Repository](https://github.com/aimug-org/austin_langchain)
