"""Tests for video analysis node."""
import pytest
from unittest.mock import patch, MagicMock
from src.nodes.video_analysis_node import video_analysis_node


@patch('src.nodes.video_analysis_node.download_video')
@patch('src.nodes.video_analysis_node.transcribe_audio')
@patch('src.nodes.video_analysis_node.extract_keyframes')
@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
@patch('src.nodes.video_analysis_node.extract_metadata')
def test_video_analysis_node_returns_structured_data(
    mock_metadata,
    mock_ollama,
    mock_frames,
    mock_transcribe,
    mock_download
):
    """Test video_analysis_node returns correct structure (existing test)."""
    # Setup mocks
    mock_download.return_value = '/tmp/video.mp4'
    mock_transcribe.return_value = {'text': 'Test', 'language': 'en', 'duration': 100}
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
        'duration': '1min',
        'video_id': 'test123'
    }

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


@patch('src.nodes.video_analysis_node.download_video')
@patch('src.nodes.video_analysis_node.extract_keyframes')
@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
@patch('src.nodes.video_analysis_node.extract_metadata')
def test_video_analysis_node_with_transcript(
    mock_metadata,
    mock_ollama,
    mock_frames,
    mock_download
):
    """Test video_analysis_node with provided transcript (existing test)."""
    # Setup mocks
    mock_download.return_value = '/tmp/video.mp4'
    mock_frames.return_value = []
    mock_ollama.return_value = {
        'has_slides': False,
        'has_diagrams': False,
        'has_code_examples': False,
        'frame_descriptions': []
    }
    mock_metadata.return_value = {
        'title': 'Test',
        'date': '2025-10-24',
        'duration': '1min',
        'video_id': 'test123'
    }

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


@patch('src.nodes.video_analysis_node.download_video')
@patch('src.nodes.video_analysis_node.extract_keyframes')
@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
@patch('src.nodes.video_analysis_node.extract_metadata')
def test_video_analysis_node_ollama_unavailable(
    mock_metadata,
    mock_ollama,
    mock_frames,
    mock_download
):
    """Test graceful degradation when Ollama unavailable."""
    from src.nodes.ollama_analysis import VisualAnalysisError

    # Setup mocks
    mock_download.return_value = '/tmp/video.mp4'
    mock_frames.return_value = ['/tmp/frame1.jpg']
    mock_ollama.side_effect = VisualAnalysisError("Ollama not running")
    mock_metadata.return_value = {
        'title': 'Test',
        'date': '2025-10-24',
        'duration': '1min',
        'video_id': 'test'
    }

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
