"""Tests for frame extraction functionality."""
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock
from src.nodes.frame_extraction import extract_keyframes, FrameExtractionError


def test_extract_keyframes_success(tmp_path):
    """Test successful keyframe extraction."""
    with patch('ffmpeg.input') as mock_input, \
         patch('ffmpeg.run') as mock_run, \
         patch('pathlib.Path.exists') as mock_exists:
        mock_stream = MagicMock()
        mock_input.return_value = mock_stream
        mock_stream.filter.return_value = mock_stream
        mock_stream.output.return_value = mock_stream
        mock_exists.return_value = True

        # Create fake frame files in tmp_path/frames
        frames_dir = tmp_path / 'frames'
        frames_dir.mkdir()
        for i in range(5):
            (frames_dir / f'frame_{i:03d}.jpg').touch()

        result = extract_keyframes('/path/to/video.mp4', str(tmp_path))

        assert len(result) == 5
        assert all(isinstance(p, str) for p in result)


def test_extract_keyframes_with_max_limit(tmp_path):
    """Test frame extraction with max frames limit."""
    with patch('ffmpeg.input') as mock_input, \
         patch('ffmpeg.run') as mock_run, \
         patch('pathlib.Path.exists') as mock_exists:
        mock_stream = MagicMock()
        mock_input.return_value = mock_stream
        mock_stream.filter.return_value = mock_stream
        mock_stream.output.return_value = mock_stream
        mock_exists.return_value = True

        # Create more frames than max
        frames_dir = tmp_path / 'frames'
        frames_dir.mkdir()
        for i in range(20):
            (frames_dir / f'frame_{i:03d}.jpg').touch()

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
