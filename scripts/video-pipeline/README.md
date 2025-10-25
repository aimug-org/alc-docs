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

## Phase 2A: Video Transcription (Implemented)

**Status:** ✅ Complete

The video analysis node now supports real video processing:

- **Video Download:** YouTube videos via yt-dlp
- **Audio Transcription:** High-quality transcription with Whisper
- **Frame Extraction:** Intelligent keyframe detection with ffmpeg
- **Visual Analysis:** Content type detection (slides, diagrams, code) with Ollama
- **Metadata Extraction:** Title, date, duration from YouTube

### System Requirements

**Required:**
- Python 3.9+
- ffmpeg: `brew install ffmpeg` (macOS) or `apt-get install ffmpeg` (Linux)
- Ollama: Running locally with llama3.2-vision model

**Verify dependencies:**
```bash
ffmpeg -version          # Check ffmpeg installed
ollama list             # Check Ollama models
python -c "import whisper"  # Check Whisper installed
```

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Ollama (required for visual analysis)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2-vision

# Whisper (transcription)
WHISPER_MODEL=base      # Options: tiny, base, small, medium, large
WHISPER_DEVICE=cpu      # Options: cpu, cuda, mps

# Video processing
MAX_KEYFRAMES=15
TEMP_DIR=/tmp/video-pipeline
```

### Usage Examples

**Process a full meeting video:**
```bash
python pipeline.py \
  --video-url "https://youtube.com/watch?v=abc123" \
  --mode full
```

**Process with existing transcript:**
```bash
python pipeline.py \
  --video-url "https://youtube.com/watch?v=abc123" \
  --mode full \
  --transcript transcripts/october-2025.txt
```

**Dry run (skip PR creation):**
```bash
python pipeline.py \
  --video-url "https://youtube.com/watch?v=abc123" \
  --mode full \
  --dry-run
```

### Processing Times

For a typical 45-minute AIMUG video on Mac M4:

- Download (1080p): ~2-5 min
- Transcription (base model): ~2-3 min with MPS
- Frame extraction: ~30 sec
- Ollama analysis (15 frames): ~30-60 sec
- **Total:** ~5-10 minutes

### Graceful Degradation

If Ollama is unavailable, the pipeline continues with transcript-only analysis:
- Visual analysis is skipped
- `has_slides`, `has_diagrams`, `has_code_examples` all set to `False`
- Content generation can still proceed with transcript

### Testing

**Run unit tests:**
```bash
pytest tests/ -v
```

**Run integration test (requires Ollama):**
```bash
pytest tests/test_video_analysis_node.py::test_video_analysis_real_short_video -v -s
```

**Skip integration tests:**
```bash
pytest tests/ -v -m "not integration"
```

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
