# Phase 2A: Video Transcription Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace stub video_analysis_node with real video processing using yt-dlp, Whisper, ffmpeg, and Ollama for transcript + visual content detection.

**Architecture:** Sequential processing (download → transcribe → extract frames → analyze frames → combine). Each component is independently testable. Graceful degradation if Ollama unavailable.

**Tech Stack:** Python 3.13, yt-dlp, OpenAI Whisper, ffmpeg-python, Ollama Python client, pytest, LangGraph 1.0

---

## Task 1: Add New Dependencies

**Files:**
- Modify: `scripts/video-pipeline/requirements.txt`

**Step 1: Add new dependencies to requirements.txt**

Add these lines after existing dependencies:

```txt
# Video processing (Phase 2A additions)
ffmpeg-python>=0.2.0
ollama>=0.1.0
```

**Step 2: Install new dependencies**

```bash
cd scripts/video-pipeline
source venv/bin/activate
pip install -r requirements.txt
```

Expected: ffmpeg-python and ollama installed successfully

**Step 3: Verify imports work**

```bash
python -c "import ffmpeg; import ollama; print('Dependencies OK')"
```

Expected: "Dependencies OK"

**Step 4: Commit**

```bash
git add requirements.txt
git commit -m "deps: add ffmpeg-python and ollama for Phase 2A"
```

---

## Task 2: Update Environment Configuration

**Files:**
- Modify: `scripts/video-pipeline/.env.example`

**Step 1: Add Phase 2A environment variables**

Add these sections to .env.example:

```bash
# Ollama configuration (Phase 2A)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2-vision

# Whisper configuration (Phase 2A)
WHISPER_MODEL=base
WHISPER_DEVICE=cpu

# Video processing (Phase 2A)
MAX_KEYFRAMES=15
TEMP_DIR=/tmp/video-pipeline
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "config: add Phase 2A environment variables"
```

---

## Task 3: Video Download Component (TDD)

**Files:**
- Create: `scripts/video-pipeline/src/nodes/video_download.py`
- Create: `scripts/video-pipeline/tests/test_video_download.py`

**Step 1: Write failing test for video download**

Create `tests/test_video_download.py`:

```python
"""Tests for video download functionality."""
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock
from src.nodes.video_download import download_video, VideoDownloadError


def test_download_video_success(tmp_path):
    """Test successful video download."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        # Mock successful download
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.return_value = {
            'id': 'test123',
            'ext': 'mp4'
        }

        result = download_video(
            'https://youtube.com/watch?v=test123',
            str(tmp_path)
        )

        assert result == str(tmp_path / 'test123.mp4')
        mock_instance.extract_info.assert_called_once()


def test_download_video_invalid_url():
    """Test download with invalid URL."""
    with pytest.raises(VideoDownloadError):
        download_video('not-a-url', '/tmp')


def test_download_video_network_error(tmp_path):
    """Test download with network error."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.side_effect = Exception('Network error')

        with pytest.raises(VideoDownloadError, match='Network error'):
            download_video('https://youtube.com/watch?v=test', str(tmp_path))
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_video_download.py -v
```

Expected: FAIL with "ModuleNotFoundError: No module named 'src.nodes.video_download'"

**Step 3: Implement video download component**

Create `src/nodes/video_download.py`:

```python
"""Video download functionality using yt-dlp."""
import yt_dlp
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class VideoDownloadError(Exception):
    """Raised when video download fails."""
    pass


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
    try:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        ydl_opts = {
            'format': 'best[ext=mp4]',
            'outtmpl': str(output_path / '%(id)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            video_id = info['id']
            video_ext = info.get('ext', 'mp4')
            video_path = output_path / f"{video_id}.{video_ext}"

            logger.info(f"Downloaded video: {video_path}")
            return str(video_path)

    except Exception as e:
        raise VideoDownloadError(f"Failed to download video: {e}")
```

**Step 4: Run test to verify it passes**

```bash
pytest tests/test_video_download.py -v
```

Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add src/nodes/video_download.py tests/test_video_download.py
git commit -m "feat: add video download component with yt-dlp"
```

---

## Task 4: Audio Transcription Component (TDD)

**Files:**
- Create: `scripts/video-pipeline/src/nodes/transcription.py`
- Create: `scripts/video-pipeline/tests/test_transcription.py`

**Step 1: Write failing test for transcription**

Create `tests/test_transcription.py`:

```python
"""Tests for audio transcription functionality."""
import pytest
from unittest.mock import patch, MagicMock
from src.nodes.transcription import transcribe_audio, TranscriptionError


def test_transcribe_audio_success():
    """Test successful audio transcription."""
    with patch('whisper.load_model') as mock_load:
        mock_model = MagicMock()
        mock_load.return_value = mock_model
        mock_model.transcribe.return_value = {
            'text': 'This is a test transcript.',
            'language': 'en'
        }

        result = transcribe_audio('/path/to/video.mp4')

        assert result['text'] == 'This is a test transcript.'
        assert result['language'] == 'en'
        assert 'duration' in result
        mock_load.assert_called_once()
        mock_model.transcribe.assert_called_once()


def test_transcribe_audio_with_model_choice():
    """Test transcription with specific model."""
    with patch('whisper.load_model') as mock_load:
        mock_model = MagicMock()
        mock_load.return_value = mock_model
        mock_model.transcribe.return_value = {
            'text': 'Test',
            'language': 'en'
        }

        result = transcribe_audio('/path/to/video.mp4', model='small')

        mock_load.assert_called_with('small')


def test_transcribe_audio_file_not_found():
    """Test transcription with missing file."""
    with pytest.raises(TranscriptionError, match='File not found'):
        transcribe_audio('/nonexistent/video.mp4')
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_transcription.py -v
```

Expected: FAIL with "ModuleNotFoundError: No module named 'src.nodes.transcription'"

**Step 3: Implement transcription component**

Create `src/nodes/transcription.py`:

```python
"""Audio transcription functionality using Whisper."""
import whisper
from pathlib import Path
import logging
import os

logger = logging.getLogger(__name__)


class TranscriptionError(Exception):
    """Raised when transcription fails."""
    pass


def transcribe_audio(
    video_path: str,
    model: str = 'base',
    device: str = 'cpu'
) -> dict:
    """Transcribe video audio using Whisper.

    Args:
        video_path: Path to video file
        model: Whisper model name (tiny, base, small, medium, large)
        device: Device to use (cpu, cuda, mps)

    Returns:
        {
            "text": "Full transcript...",
            "language": "en",
            "duration": 2700.5
        }

    Raises:
        TranscriptionError: If transcription fails
    """
    try:
        video_file = Path(video_path)
        if not video_file.exists():
            raise TranscriptionError(f"File not found: {video_path}")

        # Get model from environment or use default
        model_name = os.getenv('WHISPER_MODEL', model)
        device_name = os.getenv('WHISPER_DEVICE', device)

        logger.info(f"Loading Whisper model: {model_name}")
        whisper_model = whisper.load_model(model_name, device=device_name)

        logger.info(f"Transcribing audio from: {video_path}")
        result = whisper_model.transcribe(str(video_path))

        transcript = {
            'text': result['text'],
            'language': result.get('language', 'unknown'),
            'duration': result.get('duration', 0.0)
        }

        word_count = len(transcript['text'].split())
        logger.info(
            f"Transcription complete: {transcript['duration']:.1f}s "
            f"→ {word_count} words"
        )

        return transcript

    except Exception as e:
        if isinstance(e, TranscriptionError):
            raise
        raise TranscriptionError(f"Failed to transcribe audio: {e}")
```

**Step 4: Run test to verify it passes**

```bash
pytest tests/test_transcription.py -v
```

Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add src/nodes/transcription.py tests/test_transcription.py
git commit -m "feat: add audio transcription component with Whisper"
```

---

## Task 5: Frame Extraction Component (TDD)

**Files:**
- Create: `scripts/video-pipeline/src/nodes/frame_extraction.py`
- Create: `scripts/video-pipeline/tests/test_frame_extraction.py`

**Step 1: Write failing test for frame extraction**

Create `tests/test_frame_extraction.py`:

```python
"""Tests for frame extraction functionality."""
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock
from src.nodes.frame_extraction import extract_keyframes, FrameExtractionError


def test_extract_keyframes_success(tmp_path):
    """Test successful keyframe extraction."""
    with patch('ffmpeg.input') as mock_input:
        mock_stream = MagicMock()
        mock_input.return_value = mock_stream
        mock_stream.filter.return_value = mock_stream
        mock_stream.output.return_value = mock_stream

        # Create fake frame files
        frames_dir = tmp_path / 'frames'
        frames_dir.mkdir()
        for i in range(5):
            (frames_dir / f'frame_{i:03d}.jpg').touch()

        with patch('pathlib.Path.glob') as mock_glob:
            mock_glob.return_value = list(frames_dir.glob('*.jpg'))

            result = extract_keyframes('/path/to/video.mp4', str(tmp_path))

            assert len(result) == 5
            assert all(isinstance(p, str) for p in result)


def test_extract_keyframes_with_max_limit(tmp_path):
    """Test frame extraction with max frames limit."""
    with patch('ffmpeg.input') as mock_input:
        mock_stream = MagicMock()
        mock_input.return_value = mock_stream
        mock_stream.filter.return_value = mock_stream
        mock_stream.output.return_value = mock_stream

        # Create more frames than max
        frames_dir = tmp_path / 'frames'
        frames_dir.mkdir()
        for i in range(20):
            (frames_dir / f'frame_{i:03d}.jpg').touch()

        with patch('pathlib.Path.glob') as mock_glob:
            mock_glob.return_value = list(frames_dir.glob('*.jpg'))

            result = extract_keyframes(
                '/path/to/video.mp4',
                str(tmp_path),
                max_frames=10
            )

            # Should limit to max_frames
            assert len(result) <= 10


def test_extract_keyframes_video_not_found():
    """Test extraction with missing video."""
    with pytest.raises(FrameExtractionError, match='not found'):
        extract_keyframes('/nonexistent/video.mp4', '/tmp')
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_frame_extraction.py -v
```

Expected: FAIL with "ModuleNotFoundError: No module named 'src.nodes.frame_extraction'"

**Step 3: Implement frame extraction component**

Create `src/nodes/frame_extraction.py`:

```python
"""Frame extraction functionality using ffmpeg."""
import ffmpeg
from pathlib import Path
import logging
import os

logger = logging.getLogger(__name__)


class FrameExtractionError(Exception):
    """Raised when frame extraction fails."""
    pass


def extract_keyframes(
    video_path: str,
    output_dir: str,
    max_frames: int = 15,
    scene_threshold: float = 0.4
) -> list[str]:
    """Extract keyframes at scene changes using ffmpeg.

    Args:
        video_path: Path to video file
        output_dir: Directory to save frames
        max_frames: Maximum number of frames to extract
        scene_threshold: Scene detection threshold (0.0-1.0)

    Returns:
        List of frame file paths

    Raises:
        FrameExtractionError: If extraction fails
    """
    try:
        video_file = Path(video_path)
        if not video_file.exists():
            raise FrameExtractionError(f"Video file not found: {video_path}")

        # Create frames directory
        frames_dir = Path(output_dir) / 'frames'
        frames_dir.mkdir(parents=True, exist_ok=True)

        output_pattern = str(frames_dir / 'frame_%03d.jpg')

        logger.info(f"Extracting keyframes from: {video_path}")

        # Use ffmpeg to extract frames at scene changes
        stream = ffmpeg.input(str(video_path))
        stream = stream.filter('select', f'gt(scene,{scene_threshold})')
        stream = stream.output(
            output_pattern,
            vsync='vfr',
            format='image2',
            **{'q:v': 2}  # JPEG quality (2 = high)
        )

        # Run ffmpeg
        ffmpeg.run(stream, quiet=True, overwrite_output=True)

        # Get extracted frames
        frame_files = sorted(frames_dir.glob('frame_*.jpg'))

        # Limit to max_frames if needed (take evenly spaced)
        if len(frame_files) > max_frames:
            step = len(frame_files) / max_frames
            indices = [int(i * step) for i in range(max_frames)]
            frame_files = [frame_files[i] for i in indices]

        frame_paths = [str(f) for f in frame_files]

        logger.info(f"Extracted {len(frame_paths)} keyframes")
        return frame_paths

    except Exception as e:
        if isinstance(e, FrameExtractionError):
            raise
        raise FrameExtractionError(f"Failed to extract frames: {e}")
```

**Step 4: Run test to verify it passes**

```bash
pytest tests/test_frame_extraction.py -v
```

Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add src/nodes/frame_extraction.py tests/test_frame_extraction.py
git commit -m "feat: add frame extraction component with ffmpeg"
```

---

## Task 6: Ollama Visual Analysis Component (TDD)

**Files:**
- Create: `scripts/video-pipeline/src/nodes/ollama_analysis.py`
- Create: `scripts/video-pipeline/tests/test_ollama_analysis.py`

**Step 1: Write failing test for Ollama analysis**

Create `tests/test_ollama_analysis.py`:

```python
"""Tests for Ollama visual analysis functionality."""
import pytest
from unittest.mock import patch, MagicMock
from src.nodes.ollama_analysis import (
    analyze_frames_with_ollama,
    VisualAnalysisError
)


def test_analyze_frames_detects_slides():
    """Test Ollama detects slides in frames."""
    with patch('ollama.chat') as mock_chat:
        # Mock Ollama response indicating slides
        mock_chat.return_value = {
            'message': {
                'content': 'slide: Title slide showing AIMUG logo and event details'
            }
        }

        result = analyze_frames_with_ollama(['/path/frame1.jpg'])

        assert result['has_slides'] is True
        assert len(result['frame_descriptions']) == 1
        assert result['frame_descriptions'][0]['content_type'] == 'slide'


def test_analyze_frames_detects_diagrams():
    """Test Ollama detects diagrams."""
    with patch('ollama.chat') as mock_chat:
        mock_chat.return_value = {
            'message': {
                'content': 'diagram: Architecture diagram showing LangGraph flow'
            }
        }

        result = analyze_frames_with_ollama(['/path/frame1.jpg'])

        assert result['has_diagrams'] is True
        assert result['frame_descriptions'][0]['content_type'] == 'diagram'


def test_analyze_frames_detects_code():
    """Test Ollama detects code examples."""
    with patch('ollama.chat') as mock_chat:
        mock_chat.return_value = {
            'message': {
                'content': 'code: Python code showing function definition'
            }
        }

        result = analyze_frames_with_ollama(['/path/frame1.jpg'])

        assert result['has_code_examples'] is True
        assert result['frame_descriptions'][0]['content_type'] == 'code'


def test_analyze_frames_talking_heads_only():
    """Test frames with no technical content."""
    with patch('ollama.chat') as mock_chat:
        mock_chat.return_value = {
            'message': {
                'content': 'talking_head: Person speaking to camera'
            }
        }

        result = analyze_frames_with_ollama(['/path/frame1.jpg'])

        assert result['has_slides'] is False
        assert result['has_diagrams'] is False
        assert result['has_code_examples'] is False


def test_analyze_frames_ollama_unavailable():
    """Test graceful degradation when Ollama unavailable."""
    with patch('ollama.chat') as mock_chat:
        mock_chat.side_effect = Exception('Connection refused')

        with pytest.raises(VisualAnalysisError, match='Connection refused'):
            analyze_frames_with_ollama(['/path/frame1.jpg'])
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_ollama_analysis.py -v
```

Expected: FAIL with "ModuleNotFoundError: No module named 'src.nodes.ollama_analysis'"

**Step 3: Implement Ollama analysis component**

Create `src/nodes/ollama_analysis.py`:

```python
"""Visual analysis functionality using Ollama."""
import ollama
from pathlib import Path
import logging
import os
import base64

logger = logging.getLogger(__name__)


class VisualAnalysisError(Exception):
    """Raised when visual analysis fails."""
    pass


def analyze_frames_with_ollama(
    frame_paths: list[str],
    model: str = 'llama3.2-vision'
) -> dict:
    """Analyze video frames with Ollama vision model.

    Args:
        frame_paths: List of frame image file paths
        model: Ollama model name (must support vision)

    Returns:
        {
            "has_slides": bool,
            "has_diagrams": bool,
            "has_code_examples": bool,
            "frame_descriptions": [
                {
                    "frame_num": int,
                    "description": str,
                    "content_type": str
                }
            ]
        }

    Raises:
        VisualAnalysisError: If Ollama unavailable or analysis fails
    """
    try:
        model_name = os.getenv('OLLAMA_MODEL', model)

        has_slides = False
        has_diagrams = False
        has_code = False
        frame_descriptions = []

        prompt = """Analyze this video frame and answer:
1. What type of content is shown? (slide, diagram, code, talking_head, other)
2. Briefly describe what you see (1-2 sentences)

Format your response as: [type]: [description]
Be concise and specific."""

        logger.info(f"Analyzing {len(frame_paths)} frames with Ollama")

        for idx, frame_path in enumerate(frame_paths, 1):
            frame_file = Path(frame_path)
            if not frame_file.exists():
                logger.warning(f"Frame not found: {frame_path}")
                continue

            # Read and encode image
            with open(frame_path, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')

            # Analyze with Ollama
            response = ollama.chat(
                model=model_name,
                messages=[{
                    'role': 'user',
                    'content': prompt,
                    'images': [image_data]
                }]
            )

            content = response['message']['content'].strip()

            # Parse response
            content_type = 'other'
            description = content

            if content.startswith('slide:'):
                content_type = 'slide'
                has_slides = True
                description = content[6:].strip()
            elif content.startswith('diagram:'):
                content_type = 'diagram'
                has_diagrams = True
                description = content[8:].strip()
            elif content.startswith('code:'):
                content_type = 'code'
                has_code = True
                description = content[5:].strip()
            elif content.startswith('talking_head:'):
                content_type = 'talking_head'
                description = content[13:].strip()

            frame_descriptions.append({
                'frame_num': idx,
                'description': description,
                'content_type': content_type
            })

        logger.info(
            f"Analysis complete: slides={has_slides}, "
            f"diagrams={has_diagrams}, code={has_code}"
        )

        return {
            'has_slides': has_slides,
            'has_diagrams': has_diagrams,
            'has_code_examples': has_code,
            'frame_descriptions': frame_descriptions
        }

    except Exception as e:
        raise VisualAnalysisError(f"Failed to analyze frames: {e}")
```

**Step 4: Run test to verify it passes**

```bash
pytest tests/test_ollama_analysis.py -v
```

Expected: PASS (all 5 tests)

**Step 5: Commit**

```bash
git add src/nodes/ollama_analysis.py tests/test_ollama_analysis.py
git commit -m "feat: add Ollama visual analysis component"
```

---

## Task 7: Metadata Extraction Component (TDD)

**Files:**
- Create: `scripts/video-pipeline/src/nodes/metadata_extraction.py`
- Create: `scripts/video-pipeline/tests/test_metadata_extraction.py`

**Step 1: Write failing test for metadata extraction**

Create `tests/test_metadata_extraction.py`:

```python
"""Tests for metadata extraction functionality."""
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime
from src.nodes.metadata_extraction import extract_metadata


def test_extract_metadata_success():
    """Test successful metadata extraction."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.return_value = {
            'title': 'October 2025 AIMUG Showcase',
            'upload_date': '20251015',
            'duration': 6300,  # 105 minutes
            'id': 'abc123xyz'
        }

        result = extract_metadata('https://youtube.com/watch?v=abc123xyz')

        assert result['title'] == 'October 2025 AIMUG Showcase'
        assert result['date'] == '2025-10-15'
        assert result['duration'] == '1h 45min'
        assert result['video_id'] == 'abc123xyz'


def test_extract_metadata_short_video():
    """Test metadata for short video (under 1 hour)."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.return_value = {
            'title': 'Short Demo',
            'upload_date': '20251024',
            'duration': 1800,  # 30 minutes
            'id': 'short123'
        }

        result = extract_metadata('https://youtube.com/watch?v=short123')

        assert result['duration'] == '30min'


def test_extract_metadata_invalid_url():
    """Test metadata extraction with invalid URL."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.side_effect = Exception('Invalid URL')

        with pytest.raises(Exception):
            extract_metadata('not-a-url')
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_metadata_extraction.py -v
```

Expected: FAIL with "ModuleNotFoundError: No module named 'src.nodes.metadata_extraction'"

**Step 3: Implement metadata extraction component**

Create `src/nodes/metadata_extraction.py`:

```python
"""Metadata extraction functionality using yt-dlp."""
import yt_dlp
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def extract_metadata(video_url: str) -> dict:
    """Extract video metadata from YouTube.

    Args:
        video_url: YouTube video URL

    Returns:
        {
            "title": str,
            "date": str (YYYY-MM-DD),
            "duration": str (formatted),
            "video_id": str
        }
    """
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)

        # Parse upload date
        upload_date = info.get('upload_date', '')
        if upload_date:
            date_obj = datetime.strptime(upload_date, '%Y%m%d')
            formatted_date = date_obj.strftime('%Y-%m-%d')
        else:
            formatted_date = datetime.now().strftime('%Y-%m-%d')

        # Format duration
        duration_sec = info.get('duration', 0)
        if duration_sec >= 3600:
            hours = duration_sec // 3600
            minutes = (duration_sec % 3600) // 60
            formatted_duration = f"{hours}h {minutes}min"
        else:
            minutes = duration_sec // 60
            formatted_duration = f"{minutes}min"

        metadata = {
            'title': info.get('title', 'Unknown Title'),
            'date': formatted_date,
            'duration': formatted_duration,
            'video_id': info.get('id', '')
        }

        logger.info(f"Extracted metadata: {metadata['title']} ({metadata['duration']})")
        return metadata
```

**Step 4: Run test to verify it passes**

```bash
pytest tests/test_metadata_extraction.py -v
```

Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
git add src/nodes/metadata_extraction.py tests/test_metadata_extraction.py
git commit -m "feat: add metadata extraction component with yt-dlp"
```

---

## Task 8: Integrate Components into video_analysis_node

**Files:**
- Modify: `scripts/video-pipeline/src/nodes/video_analysis_node.py`
- Modify: `scripts/video-pipeline/tests/test_video_analysis_node.py`

**Step 1: Update test to use real components**

Update `tests/test_video_analysis_node.py` to add integration test:

```python
"""Tests for video analysis node."""
import pytest
from unittest.mock import patch, MagicMock
from src.nodes.video_analysis_node import video_analysis_node


def test_video_analysis_node_returns_structured_data():
    """Test video_analysis_node returns correct structure (existing test)."""
    state = {
        "video_url": "https://youtube.com/watch?v=test123",
        "video_type": "full_meeting",
        "transcript": None
    }

    result = video_analysis_node(state)

    assert "video_analysis" in result
    assert "meeting_metadata" in result["video_analysis"]
    assert "transcript" in result["video_analysis"]
    assert "visual_content" in result["video_analysis"]


def test_video_analysis_node_with_transcript():
    """Test video_analysis_node with provided transcript (existing test)."""
    state = {
        "video_url": "https://youtube.com/watch?v=test123",
        "video_type": "full_meeting",
        "transcript": "Pre-existing transcript text"
    }

    result = video_analysis_node(state)

    assert result["video_analysis"]["transcript"] == "Pre-existing transcript text"


@patch('src.nodes.video_analysis_node.download_video')
@patch('src.nodes.video_analysis_node.transcribe_audio')
@patch('src.nodes.video_analysis_node.extract_keyframes')
@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
@patch('src.nodes.video_analysis_node.extract_metadata')
def test_video_analysis_node_full_pipeline(
    mock_metadata,
    mock_ollama,
    mock_frames,
    mock_transcribe,
    mock_download
):
    """Test full pipeline with all components."""
    # Mock all components
    mock_download.return_value = '/tmp/video.mp4'
    mock_transcribe.return_value = {
        'text': 'Test transcript',
        'language': 'en',
        'duration': 2700.0
    }
    mock_frames.return_value = ['/tmp/frame1.jpg', '/tmp/frame2.jpg']
    mock_ollama.return_value = {
        'has_slides': True,
        'has_diagrams': False,
        'has_code_examples': False,
        'frame_descriptions': [
            {'frame_num': 1, 'description': 'Title slide', 'content_type': 'slide'}
        ]
    }
    mock_metadata.return_value = {
        'title': 'Test Video',
        'date': '2025-10-24',
        'duration': '45min',
        'video_id': 'test123'
    }

    state = {
        "video_url": "https://youtube.com/watch?v=test123",
        "video_type": "full_meeting",
        "transcript": None
    }

    result = video_analysis_node(state)

    # Verify all components were called
    mock_download.assert_called_once()
    mock_transcribe.assert_called_once()
    mock_frames.assert_called_once()
    mock_ollama.assert_called_once()
    mock_metadata.assert_called_once()

    # Verify result structure
    assert result["video_analysis"]["transcript"] == "Test transcript"
    assert result["video_analysis"]["visual_content"]["has_slides"] is True
    assert result["video_analysis"]["meeting_metadata"]["title"] == "Test Video"


@patch('src.nodes.video_analysis_node.download_video')
@patch('src.nodes.video_analysis_node.extract_keyframes')
@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
@patch('src.nodes.video_analysis_node.extract_metadata')
def test_video_analysis_node_with_existing_transcript(
    mock_metadata,
    mock_ollama,
    mock_frames,
    mock_download
):
    """Test pipeline skips transcription when transcript provided."""
    mock_download.return_value = '/tmp/video.mp4'
    mock_frames.return_value = ['/tmp/frame1.jpg']
    mock_ollama.return_value = {
        'has_slides': False,
        'has_diagrams': False,
        'has_code_examples': False,
        'frame_descriptions': []
    }
    mock_metadata.return_value = {
        'title': 'Test',
        'date': '2025-10-24',
        'duration': '30min',
        'video_id': 'test'
    }

    state = {
        "video_url": "https://youtube.com/watch?v=test",
        "video_type": "full_meeting",
        "transcript": "Pre-existing transcript"
    }

    result = video_analysis_node(state)

    # Should still download for frame extraction
    mock_download.assert_called_once()
    # Should use provided transcript
    assert result["video_analysis"]["transcript"] == "Pre-existing transcript"


@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
def test_video_analysis_node_ollama_unavailable(mock_ollama):
    """Test graceful degradation when Ollama unavailable."""
    from src.nodes.ollama_analysis import VisualAnalysisError

    mock_ollama.side_effect = VisualAnalysisError("Ollama not running")

    state = {
        "video_url": "https://youtube.com/watch?v=test",
        "video_type": "full_meeting",
        "transcript": "Test transcript"
    }

    # Should not raise, should continue with transcript only
    result = video_analysis_node(state)

    assert "video_analysis" in result
    # Visual content should have all False flags
    assert result["video_analysis"]["visual_content"]["has_slides"] is False
```

**Step 2: Run test to verify it fails**

```bash
pytest tests/test_video_analysis_node.py::test_video_analysis_node_full_pipeline -v
```

Expected: FAIL (imports don't exist in video_analysis_node.py yet)

**Step 3: Implement integrated video_analysis_node**

Replace `src/nodes/video_analysis_node.py`:

```python
"""Video analysis node for extracting insights from videos."""
from typing import Dict, Any
import tempfile
import shutil
from pathlib import Path
import logging

from .video_download import download_video, VideoDownloadError
from .transcription import transcribe_audio, TranscriptionError
from .frame_extraction import extract_keyframes, FrameExtractionError
from .ollama_analysis import analyze_frames_with_ollama, VisualAnalysisError
from .metadata_extraction import extract_metadata

logger = logging.getLogger(__name__)


def video_analysis_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze video and extract structured insights.

    Args:
        state: Pipeline state with video_url and optional transcript

    Returns:
        Dictionary with video_analysis containing structured insights
    """
    video_url = state["video_url"]
    provided_transcript = state.get("transcript")

    # Create temp directory
    temp_dir = Path(tempfile.mkdtemp(prefix="video-pipeline-"))

    try:
        print("\n" + "=" * 60)
        print("VIDEO ANALYSIS")
        print("=" * 60)
        print(f"Video URL: {video_url}\n")

        # Step 1: Download video
        print("[1/5] Downloading video...")
        video_path = download_video(video_url, str(temp_dir))
        print("✓ Downloaded\n")

        # Step 2: Transcribe audio (skip if transcript provided)
        if provided_transcript:
            print("[2/5] Using provided transcript...")
            transcript_text = provided_transcript
            print("✓ Transcript ready\n")
        else:
            print("[2/5] Transcribing audio with Whisper...")
            transcript_result = transcribe_audio(video_path)
            transcript_text = transcript_result['text']
            print(f"✓ Transcribed: {len(transcript_text.split())} words\n")

        # Step 3: Extract keyframes
        print("[3/5] Extracting keyframes...")
        try:
            frame_paths = extract_keyframes(video_path, str(temp_dir))
            print(f"✓ Extracted: {len(frame_paths)} frames\n")
        except FrameExtractionError as e:
            logger.warning(f"Frame extraction failed: {e}")
            frame_paths = []
            print("⚠ Frame extraction failed, skipping visual analysis\n")

        # Step 4: Analyze frames with Ollama
        print("[4/5] Analyzing frames with Ollama...")
        visual_content = {
            'has_slides': False,
            'has_diagrams': False,
            'has_code_examples': False,
            'frame_descriptions': []
        }

        if frame_paths:
            try:
                visual_content = analyze_frames_with_ollama(frame_paths)
                print(f"✓ Analyzed: {len(frame_paths)} frames\n")
                print(f"   Slides: {visual_content['has_slides']}")
                print(f"   Diagrams: {visual_content['has_diagrams']}")
                print(f"   Code: {visual_content['has_code_examples']}\n")
            except VisualAnalysisError as e:
                logger.warning(f"Visual analysis failed: {e}")
                print("⚠ Ollama unavailable, skipping visual analysis\n")

        # Step 5: Extract metadata
        print("[5/5] Extracting metadata...")
        metadata = extract_metadata(video_url)
        print("✓ Complete\n")

        print("Analysis complete!")
        print("=" * 60 + "\n")

        return {
            "video_analysis": {
                "meeting_metadata": metadata,
                "transcript": transcript_text,
                "visual_content": visual_content,
                # Still stubbed for Phase 2C
                "key_topics": [],
                "technical_concepts": [],
                "demos_shown": [],
                "resources_mentioned": []
            }
        }

    except VideoDownloadError as e:
        raise ValueError(f"Failed to download video: {e}")

    except TranscriptionError as e:
        raise ValueError(f"Failed to transcribe video: {e}")

    finally:
        # Cleanup temp files
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
            logger.info(f"Cleaned up temp files at {temp_dir}")
```

**Step 4: Run tests to verify they pass**

```bash
pytest tests/test_video_analysis_node.py -v
```

Expected: PASS (all tests)

**Step 5: Commit**

```bash
git add src/nodes/video_analysis_node.py tests/test_video_analysis_node.py
git commit -m "feat: integrate all components into video_analysis_node"
```

---

## Task 9: Add Integration Test with Real Video

**Files:**
- Modify: `scripts/video-pipeline/tests/test_video_analysis_node.py`

**Step 1: Add integration test marker**

Add at top of `tests/test_video_analysis_node.py`:

```python
import os

# Check if Ollama is available
OLLAMA_AVAILABLE = False
try:
    import ollama
    ollama.chat(model='llama3.2-vision', messages=[{'role': 'user', 'content': 'test'}])
    OLLAMA_AVAILABLE = True
except:
    pass
```

**Step 2: Add real video integration test**

Add to end of `tests/test_video_analysis_node.py`:

```python
@pytest.mark.integration
@pytest.mark.skipif(not OLLAMA_AVAILABLE, reason="Ollama not running")
@pytest.mark.slow
def test_video_analysis_real_short_video():
    """Test with actual short YouTube video.

    Uses a short public domain video for testing.
    This test actually downloads, transcribes, and analyzes a real video.
    """
    # Use a short (< 1 min) Creative Commons video
    # Example: YouTube's test video or a known short public video
    test_video_url = "https://www.youtube.com/watch?v=aqz-KE-bpKQ"  # "Big Buck Bunny" trailer (33 seconds)

    state = {
        "video_url": test_video_url,
        "video_type": "individual_session",
        "transcript": None
    }

    result = video_analysis_node(state)

    # Verify structure
    assert "video_analysis" in result
    analysis = result["video_analysis"]

    # Verify transcript exists and is reasonable
    assert "transcript" in analysis
    assert len(analysis["transcript"]) > 50  # Should have some content

    # Verify metadata
    assert "meeting_metadata" in analysis
    assert "title" in analysis["meeting_metadata"]
    assert "date" in analysis["meeting_metadata"]
    assert "duration" in analysis["meeting_metadata"]

    # Verify visual content structure
    assert "visual_content" in analysis
    assert "has_slides" in analysis["visual_content"]
    assert "has_diagrams" in analysis["visual_content"]
    assert "has_code_examples" in analysis["visual_content"]
    assert "frame_descriptions" in analysis["visual_content"]

    print(f"\nIntegration Test Results:")
    print(f"  Title: {analysis['meeting_metadata']['title']}")
    print(f"  Duration: {analysis['meeting_metadata']['duration']}")
    print(f"  Transcript length: {len(analysis['transcript'])} chars")
    print(f"  Frames analyzed: {len(analysis['visual_content']['frame_descriptions'])}")
```

**Step 3: Run integration test (optional, slow)**

```bash
pytest tests/test_video_analysis_node.py::test_video_analysis_real_short_video -v -s
```

Expected: PASS (if Ollama running) or SKIPPED (if Ollama not running)

Note: This will actually download and process a video, takes 1-2 minutes

**Step 4: Commit**

```bash
git add tests/test_video_analysis_node.py
git commit -m "test: add integration test with real short video"
```

---

## Task 10: Update README with Phase 2A Information

**Files:**
- Modify: `scripts/video-pipeline/README.md`

**Step 1: Add Phase 2A section to README**

Add after the "Features" section in `scripts/video-pipeline/README.md`:

```markdown
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
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with Phase 2A implementation details"
```

---

## Task 11: Final Testing

**Step 1: Run full test suite**

```bash
cd scripts/video-pipeline
source venv/bin/activate
pytest -v
```

Expected: All tests pass (except integration test if Ollama not running)

**Step 2: Test with real AIMUG video (manual)**

Pick a short AIMUG video (5-10 min) and test:

```bash
python pipeline.py \
  --video-url "https://youtube.com/watch?v=REAL_AIMUG_VIDEO" \
  --mode full \
  --dry-run
```

Verify:
- Video downloads successfully
- Transcript is accurate
- Keyframes extracted
- Visual analysis completes (or gracefully degrades)
- Output structure is correct

**Step 3: Document test results**

Create a test report comment for the PR with:
- Test video used
- Processing times
- Transcript quality assessment
- Visual analysis results
- Any issues encountered

---

## Success Criteria

Phase 2A is complete when:

- ✅ All unit tests pass (100% of new code)
- ✅ Integration test with real video passes (if Ollama available)
- ✅ Can process 45-minute AIMUG video end-to-end
- ✅ Graceful degradation works (Ollama unavailable)
- ✅ Error handling tested for all failure modes
- ✅ Temp file cleanup verified
- ✅ Output schema matches Phase 1 structure
- ✅ README updated with Phase 2A documentation
- ✅ All commits follow conventional commit format

---

## Execution Notes

**TDD Workflow:**
1. Write failing test first (RED)
2. Run test to confirm failure
3. Write minimal implementation (GREEN)
4. Run test to confirm pass
5. Refactor if needed
6. Commit

**Commit Message Format:**
- `feat:` - New feature
- `test:` - Test additions
- `docs:` - Documentation
- `fix:` - Bug fix
- `refactor:` - Code improvement

**Dependencies on Phase 1:**
- All Phase 1 infrastructure (LangGraph, state schemas, CLI)
- Existing test fixtures and patterns
- PR generation workflow (still uses stubs)

**Ready for Phase 2B After:**
- Video analysis provides `visual_content.has_slides/diagrams`
- Frame paths can be saved for image extraction
- Ollama analysis identifies which frames to extract
