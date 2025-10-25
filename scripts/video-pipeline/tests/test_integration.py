"""Integration tests for full pipeline."""
import pytest
from unittest.mock import patch
from src.graph import build_graph


@patch('src.nodes.video_analysis_node.download_video')
@patch('src.nodes.video_analysis_node.transcribe_audio')
@patch('src.nodes.video_analysis_node.extract_keyframes')
@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
@patch('src.nodes.video_analysis_node.extract_metadata')
@patch('builtins.input', return_value='approve')
def test_full_pipeline_integration(
    mock_input,
    mock_metadata,
    mock_ollama,
    mock_frames,
    mock_transcribe,
    mock_download
):
    """Test complete pipeline execution from input to PR."""
    # Setup mocks
    mock_download.return_value = '/tmp/video.mp4'
    mock_transcribe.return_value = {
        'text': 'Test transcript',
        'language': 'en',
        'duration': 2700.0
    }
    mock_frames.return_value = ['/tmp/frame1.jpg']
    mock_ollama.return_value = {
        'has_slides': True,
        'has_diagrams': False,
        'has_code_examples': False,
        'frame_descriptions': [
            {'frame_num': 1, 'description': 'Test', 'content_type': 'slide'}
        ]
    }
    mock_metadata.return_value = {
        'title': 'Test Meeting',
        'date': '2025-10-24',
        'duration': '45min',
        'video_id': 'test123'
    }

    graph = build_graph()

    input_state = {
        "video_url": "https://youtube.com/watch?v=test123",
        "video_type": "full_meeting",
        "transcript": None
    }

    config = {"configurable": {"thread_id": "integration-test"}}
    result = graph.invoke(input_state, config=config)

    # Verify output structure
    assert "pr_url" in result
    assert "social_content" in result

    # Verify PR URL format
    assert result["pr_url"].startswith("https://github.com")

    # Verify social content structure
    social = result["social_content"]
    assert "aimug_twitter_thread" in social
    assert "personal_twitter_thread" in social
    assert "linkedin_post" in social
    assert "email_blast" in social


@patch('src.nodes.video_analysis_node.download_video')
@patch('src.nodes.video_analysis_node.extract_keyframes')
@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
@patch('src.nodes.video_analysis_node.extract_metadata')
@patch('builtins.input', return_value='approve')
def test_individual_session_pipeline(
    mock_input,
    mock_metadata,
    mock_ollama,
    mock_frames,
    mock_download
):
    """Test pipeline with individual session."""
    # Setup mocks (no transcription needed when transcript provided)
    mock_download.return_value = '/tmp/video.mp4'
    mock_frames.return_value = ['/tmp/frame1.jpg']
    mock_ollama.return_value = {
        'has_slides': False,
        'has_diagrams': False,
        'has_code_examples': False,
        'frame_descriptions': []
    }
    mock_metadata.return_value = {
        'title': 'Test Session',
        'date': '2025-10-24',
        'duration': '30min',
        'video_id': 'session123'
    }

    graph = build_graph()

    input_state = {
        "video_url": "https://youtube.com/watch?v=session123",
        "video_type": "individual_session",
        "transcript": "Test transcript content"
    }

    config = {"configurable": {"thread_id": "session-test"}}
    result = graph.invoke(input_state, config=config)

    # Should complete successfully
    assert "pr_url" in result
    assert result["pr_url"].startswith("https://github.com")
