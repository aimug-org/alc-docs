# AIMUG Video Content Pipeline

Automated pipeline for processing AIMUG meeting videos into documentation and social media content.

## Status

**Phase 1 Complete:** Core pipeline infrastructure with stub implementations.

### Implemented
- ✅ Project structure and dependencies
- ✅ State schema with TypedDict
- ✅ Input validation node
- ✅ LangGraph 1.0 pipeline with Command routing
- ✅ All nodes with stub implementations
- ✅ Human review workflow
- ✅ CLI interface
- ✅ Integration tests

### Stub Implementations (TODO)
- ⏳ Video analysis with Ollama + Whisper
- ⏳ Image extraction and optimization
- ⏳ Content generation with Claude API
- ⏳ Fact-checking with Context7/Perplexity MCPs
- ⏳ Git operations and PR creation

## Features
- Video analysis with local Ollama models
- AI-assisted fact-checking
- Multi-platform social media content generation
- GitHub PR workflow integration
- Resumable execution with checkpoints

## Requirements
- Python 3.9+
- Ollama with llama3.2-vision
- GitHub CLI (gh)
- Environment variables (see .env.example)

## Installation

```bash
cd scripts/video-pipeline
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys
```

## Usage

```bash
# Full meeting processing
python pipeline.py --video-url https://youtube.com/... --mode full

# Individual session processing
python pipeline.py --video-url https://youtube.com/... --mode session

# With transcript
python pipeline.py --video-url URL --mode full --transcript transcript.txt

# Dry run (no PR creation)
python pipeline.py --video-url URL --mode full --dry-run

# Resume from checkpoint
python pipeline.py --resume pipeline-full_meeting
```

## Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_graph.py -v

# Run with coverage
pytest --cov=src --cov-report=html
```

## Architecture

See: `docs/plans/2025-10-24-video-content-pipeline-design.md`

**Pipeline Flow:**
1. Input validation
2. Video analysis (Ollama)
3. Image decision (AI)
4. Content generation (Claude)
5. Fact-checking (Context7/Perplexity)
6. Human review
7. PR generation (GitHub)

## Next Steps

See: `docs/plans/2025-10-24-video-content-pipeline-implementation.md`

**Phase 2:** Implement actual video processing
**Phase 3:** Implement content generation
**Phase 4:** Implement fact-checking MCPs
**Phase 5:** Implement git/PR operations
