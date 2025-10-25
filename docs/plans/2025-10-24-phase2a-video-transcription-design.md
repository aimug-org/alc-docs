# Phase 2A: Video Transcription & Basic Visual Analysis

**Date:** 2025-10-24
**Status:** Design Approved
**Phase:** 2A of Video Content Pipeline
**Scope:** Replace stub video_analysis_node with real video processing (audio transcription + basic visual analysis)

## Overview

Phase 2A implements real video processing for the AIMUG video content pipeline, replacing the stub implementation with:
- YouTube video download via yt-dlp
- Audio transcription via Whisper
- Keyframe extraction via ffmpeg
- Visual content detection via Ollama llama3.2-vision
- Metadata extraction from YouTube

This provides the foundation for intelligent content generation and image extraction decisions in later phases.

## Architecture Decision

**Chosen Approach:** Sequential Processing (Approach 1)

**Rationale:**
- Simple, debuggable implementation
- TDD-friendly (easy to test each component)
- Clear error handling at each step
- Can cache intermediate results
- Optimization to parallel processing can come later if needed

**Rejected Alternatives:**
- Parallel Processing (Approach 2): More complex, harder to debug for initial implementation
- Streaming Analysis (Approach 3): Too complex for MVP, no clear benefit

## High-Level Architecture

### Component Structure

```
src/nodes/video_analysis_node.py
├── video_analysis_node(state)          # Main orchestrator
├── download_video(url, output_dir)     # yt-dlp wrapper
├── transcribe_audio(video_path)        # Whisper wrapper
├── extract_keyframes(video_path)       # ffmpeg wrapper
├── analyze_frames_with_ollama(frames)  # Ollama vision API
├── extract_metadata(video_path, url)   # YouTube metadata
└── check_system_dependencies()         # Dependency checker
```

### Data Flow

```
Input: state with video_url, optional transcript
  ↓
1. Check if transcript provided
   YES → Skip to step 4
   NO  → Continue to step 2
  ↓
2. Download video with yt-dlp
   → /tmp/video-pipeline/{video_id}.mp4
  ↓
3. Transcribe audio with Whisper
   → transcript text, language, duration
  ↓
4. Extract keyframes (10-20 frames)
   → /tmp/video-pipeline/frames/frame_*.jpg
  ↓
5. Analyze frames with Ollama vision
   → detect slides, diagrams, code examples
  ↓
6. Extract metadata from YouTube
   → title, date, duration, video_id
  ↓
7. Combine results into structured output
  ↓
8. Cleanup temp files
  ↓
Output: video_analysis with transcript + visual_content + metadata
```

## Component Details

### 1. Video Download (yt-dlp)

```python
def download_video(video_url: str, output_dir: str) -> str:
    """Download YouTube video using yt-dlp.

    Args:
        video_url: YouTube video URL
        output_dir: Directory to save video

    Returns:
        Path to downloaded video file

    Raises:
        VideoDownloadError: If download fails
    """
    # yt-dlp options:
    # - Format: best video+audio (mp4)
    # - Max resolution: 1080p (sufficient for analysis)
    # - Output template: {output_dir}/%(id)s.%(ext)s
    # - Quiet mode with progress

    # Returns: {output_dir}/{video_id}.mp4
```

**Configuration:**
- Max resolution: 1080p (no need for 4K)
- Format: mp4 (widely compatible)
- Output: `/tmp/video-pipeline/{video_id}.mp4`

### 2. Audio Transcription (Whisper)

```python
def transcribe_audio(video_path: str) -> dict:
    """Transcribe video audio using Whisper.

    Args:
        video_path: Path to video file

    Returns:
        {
            "text": "Full transcript...",
            "language": "en",
            "duration": 2700.5
        }

    Raises:
        TranscriptionError: If transcription fails
    """
    # Use openai-whisper library
    # Model: "base" (faster, good accuracy) or "small" (more accurate)
    # Device: CPU, CUDA, or MPS (Mac M4)
    # Return full transcript with language detection
```

**Configuration:**
- Default model: `base` (good balance of speed/accuracy)
- Fallback model: `tiny` (if base fails due to memory)
- Device: Auto-detect (CUDA, MPS, or CPU)

**Model Sizes:**
- tiny: ~1GB RAM, 32x faster, 90% accuracy
- base: ~1.5GB RAM, 16x faster, 95% accuracy
- small: ~2.5GB RAM, 6x faster, 98% accuracy

### 3. Keyframe Extraction (ffmpeg)

```python
def extract_keyframes(video_path: str, max_frames: int = 15) -> List[str]:
    """Extract keyframes at scene changes.

    Args:
        video_path: Path to video file
        max_frames: Maximum number of frames to extract

    Returns:
        List of frame file paths
    """
    # Use ffmpeg scene detection
    # Threshold: 0.4 (detect significant scene changes)
    # Limit: max_frames (evenly distributed if more detected)
    # Format: JPG with 85% quality
    # Output: /tmp/video-pipeline/frames/frame_{num:03d}.jpg
```

**Configuration:**
- Scene change threshold: 0.4
- Max frames: 15 (balance between coverage and processing time)
- Format: JPG, 85% quality
- Resolution: Original (no downscaling)

### 4. Visual Analysis (Ollama)

```python
def analyze_frames_with_ollama(frame_paths: List[str]) -> dict:
    """Analyze frames with Ollama llama3.2-vision.

    Args:
        frame_paths: List of frame image paths

    Returns:
        {
            "has_slides": bool,
            "has_diagrams": bool,
            "has_code_examples": bool,
            "frame_descriptions": [
                {
                    "frame_num": 1,
                    "description": "Title slide showing...",
                    "content_type": "slide" | "diagram" | "code" | "talking_head"
                }
            ]
        }

    Raises:
        VisualAnalysisError: If Ollama unavailable (non-critical)
    """
    # For each frame:
    #   - Send to Ollama with vision prompt
    #   - Parse response to detect content type
    # Aggregate results:
    #   - has_slides: any frame contains slides
    #   - has_diagrams: any frame contains diagrams/architecture
    #   - has_code_examples: any frame shows code
```

**Ollama Prompt Template:**
```
Analyze this video frame and answer:
1. What type of content is shown? (slide, diagram, code, people talking, other)
2. Briefly describe what you see (1-2 sentences)
3. Does it contain technical information worth preserving as an image?

Be concise and specific.
```

**Configuration:**
- Model: `llama3.2-vision` (11B vision model)
- Host: `http://localhost:11434` (default Ollama)
- Timeout: 30s per frame
- Graceful degradation: Skip visual analysis if Ollama unavailable

### 5. Metadata Extraction

```python
def extract_metadata(video_path: str, video_url: str) -> dict:
    """Extract video metadata.

    Args:
        video_path: Path to video file (for duration)
        video_url: YouTube URL (for YouTube metadata)

    Returns:
        {
            "title": "YouTube video title",
            "date": "2025-10-24",
            "duration": "45min",
            "video_id": "abc123"
        }
    """
    # Use yt-dlp info extraction (no download)
    # Parse: upload_date, title, duration, video_id
    # Format duration: "XXmin" or "Xh XXmin"
```

## Output Schema

```python
{
    "video_analysis": {
        "meeting_metadata": {
            "date": "2025-10-24",           # From YouTube upload_date
            "title": "October 2025 AIMUG Showcase",  # From YouTube
            "duration": "1h 45min",         # Formatted duration
            "video_id": "abc123xyz"         # YouTube video ID
        },
        "transcript": "Full transcript text...",  # From Whisper
        "visual_content": {
            "has_slides": True,             # Aggregated from Ollama
            "has_diagrams": True,
            "has_code_examples": False,
            "frame_descriptions": [
                {
                    "frame_num": 1,
                    "timestamp": "00:05",
                    "description": "Title slide with AIMUG logo",
                    "content_type": "slide"
                },
                {
                    "frame_num": 5,
                    "timestamp": "02:30",
                    "description": "Architecture diagram showing LangGraph flow",
                    "content_type": "diagram"
                }
            ]
        },
        # Still stubbed for Phase 2C
        "key_topics": [],
        "technical_concepts": [],
        "demos_shown": [],
        "resources_mentioned": []
    }
}
```

## Dependencies

### New Python Packages

Add to `requirements.txt`:
```txt
# Already present:
# yt-dlp>=2024.0.0
# openai-whisper>=20231117

# NEW packages:
ffmpeg-python>=0.2.0        # Python wrapper for ffmpeg
ollama>=0.1.0              # Official Ollama Python client
```

### System Dependencies

**Required:**
- `ffmpeg` - Video/audio processing
  - macOS: `brew install ffmpeg`
  - Linux: `apt-get install ffmpeg`

- `Ollama` - Vision model inference
  - Already installed (user confirmed)
  - Requires: llama3.2-vision model pulled

**Optional:**
- CUDA/MPS - GPU acceleration for Whisper

### Environment Configuration

Add to `.env.example`:
```bash
# Ollama configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2-vision

# Whisper configuration
WHISPER_MODEL=base          # Options: tiny, base, small, medium, large
WHISPER_DEVICE=cpu          # Options: cpu, cuda, mps

# Video processing
MAX_KEYFRAMES=15
TEMP_DIR=/tmp/video-pipeline
```

## Error Handling

### Error Categories

**1. Critical Errors (Fail Fast)**
- `VideoDownloadError`: Cannot download video
- `TranscriptionError`: Cannot transcribe audio
- Invalid YouTube URL
- Missing system dependencies (ffmpeg)

**2. Non-Critical Errors (Graceful Degradation)**
- `VisualAnalysisError`: Ollama unavailable → Skip visual analysis, continue
- Individual frame analysis fails → Skip that frame, continue with others
- Keyframe extraction fails → Skip visual analysis, continue with transcript

### Cleanup Strategy

```python
import tempfile
import shutil
from pathlib import Path

def video_analysis_node(state: Dict[str, Any]) -> Dict[str, Any]:
    # Create temp directory
    temp_dir = Path(tempfile.mkdtemp(prefix="video-pipeline-"))

    try:
        # Process video...

    except VideoDownloadError as e:
        raise ValueError(f"Failed to download video: {e}")

    except TranscriptionError as e:
        raise ValueError(f"Failed to transcribe video: {e}")

    except VisualAnalysisError as e:
        logger.warning(f"Visual analysis failed: {e}")
        # Continue with transcript-only

    finally:
        # Always cleanup temp files
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
```

### Graceful Degradation

**If Ollama unavailable:**
- Log warning
- Return `visual_content` with all False flags
- Continue with transcript-only analysis

**If Whisper fails:**
- Try smaller model (base → tiny)
- If still fails, raise error (transcription is critical)

**If ffmpeg missing:**
- Skip frame extraction
- Skip visual analysis
- Continue with transcript-only

## Testing Strategy

### Unit Tests (with Mocks)

**New test files:**
```
tests/
├── test_video_download.py          # yt-dlp wrapper
├── test_transcription.py           # Whisper wrapper
├── test_frame_extraction.py        # ffmpeg wrapper
├── test_ollama_analysis.py         # Ollama vision
├── test_metadata_extraction.py     # Metadata
└── test_video_analysis_node.py     # Updated integration
```

**Test approach:**
1. **RED**: Write failing test
2. **GREEN**: Implement minimal code to pass
3. **REFACTOR**: Clean up and add error handling

**Mock external dependencies:**
- `yt_dlp.YoutubeDL` - Mock downloads
- `whisper.load_model` - Mock transcription
- `subprocess.run` - Mock ffmpeg
- `requests.post` - Mock Ollama API

### Integration Tests

**Add to test_video_analysis_node.py:**
```python
@pytest.mark.integration
@pytest.mark.skipif(not OLLAMA_AVAILABLE, reason="Ollama not running")
@pytest.mark.slow
def test_video_analysis_real_video():
    """Test with actual short YouTube video (10-30 seconds)."""
    # Use a known short test video
    # Run full pipeline with real dependencies
    # Assert transcript exists
    # Assert visual_content structure correct
```

### Test Fixtures

```python
@pytest.fixture
def temp_video_dir(tmp_path):
    """Provide temporary directory for test videos."""
    video_dir = tmp_path / "videos"
    video_dir.mkdir()
    yield video_dir

@pytest.fixture
def mock_video_file(temp_video_dir):
    """Create a small mock video file."""
    # Create minimal valid MP4 for tests
```

## Implementation Order (TDD)

1. ✅ **Video Download**
   - Write tests for download_video()
   - Implement yt-dlp wrapper
   - Test with mock and real URL

2. ✅ **Transcription**
   - Write tests for transcribe_audio()
   - Implement Whisper wrapper
   - Test with mock audio

3. ✅ **Frame Extraction**
   - Write tests for extract_keyframes()
   - Implement ffmpeg wrapper
   - Test with mock video

4. ✅ **Ollama Analysis**
   - Write tests for analyze_frames_with_ollama()
   - Implement Ollama client
   - Test with mock frames and Ollama

5. ✅ **Metadata Extraction**
   - Write tests for extract_metadata()
   - Implement yt-dlp info extraction
   - Test with mock video

6. ✅ **Integration**
   - Update test_video_analysis_node.py
   - Implement main orchestrator
   - Test with real short video

7. ✅ **Error Handling**
   - Add exception handling
   - Test failure scenarios
   - Verify cleanup works

## Logging & Progress

### Structured Logging

```python
import logging
logger = logging.getLogger(__name__)

logger.info(f"Downloading video: {video_url}")
logger.info(f"Video downloaded: {file_size_mb} MB")
logger.info(f"Starting transcription ({model_name})...")
logger.info(f"Transcription complete: {duration}s → {word_count} words")
logger.info(f"Extracting keyframes (max {max_frames})...")
logger.info(f"Extracted {len(frames)} frames")
logger.info(f"Analyzing frames with Ollama...")
logger.info(f"Visual analysis: slides={has_slides}, diagrams={has_diagrams}")
```

### CLI Progress Output

```
============================================================
VIDEO ANALYSIS
============================================================
Video URL: https://youtube.com/watch?v=abc123

[1/5] Downloading video...
✓ Downloaded: 125 MB in 15s

[2/5] Transcribing audio with Whisper (base model)...
✓ Transcribed: 45min audio → 8,500 words

[3/5] Extracting keyframes...
✓ Extracted: 12 frames

[4/5] Analyzing frames with Ollama...
✓ Analyzed: 12 frames (3 slides, 2 diagrams detected)

[5/5] Extracting metadata...
✓ Complete

Analysis complete!
============================================================
```

## Performance Considerations

### Expected Processing Times (45min video)

- Download (1080p): ~2-5 min (network dependent)
- Transcription (base model, CPU): ~5-10 min
- Transcription (base model, MPS): ~2-3 min
- Keyframe extraction: ~30 sec
- Ollama analysis (15 frames): ~30-60 sec
- Total: ~10-20 min on Mac M4

### Optimization Opportunities (Future)

- Cache transcripts (skip re-transcription)
- Parallel processing (Whisper + frame extraction)
- Smaller Whisper model for speed
- Batch Ollama requests
- Stream processing (no temp files)

## Success Criteria

**Phase 2A Complete When:**
- ✅ All unit tests pass (100% coverage of new code)
- ✅ Integration test with real YouTube video passes
- ✅ Graceful degradation works (Ollama off = transcript-only)
- ✅ Error handling tested for all failure modes
- ✅ Temp file cleanup verified
- ✅ Can process 45min AIMUG video end-to-end
- ✅ Output schema matches existing structure
- ✅ Ready for Phase 2B (image extraction uses visual_content)

## Future Phases

**Phase 2B:** Image Extraction
- Use `visual_content.has_slides/diagrams` to decide extraction
- Extract specific frames identified by Ollama
- Save to `static/img/showcases/YYYY-MM/`

**Phase 2C:** Content Generation
- Use transcript + visual_content for Claude prompts
- Generate Learn docs, blog posts, social content

**Phase 2D:** Fact Checking
- Validate technical claims from transcript
- Check links with Context7/Perplexity

**Phase 2E:** PR Generation
- Real git operations
- Create PR with generated content

## References

- Phase 1 Implementation: `docs/plans/2025-10-24-video-content-pipeline-implementation.md`
- Design Document: `docs/plans/2025-10-24-video-content-pipeline-design.md`
- Whisper Documentation: https://github.com/openai/whisper
- Ollama API: https://github.com/ollama/ollama
- yt-dlp: https://github.com/yt-dlp/yt-dlp
