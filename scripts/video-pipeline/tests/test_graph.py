"""Tests for LangGraph pipeline construction."""
import pytest
from unittest.mock import patch
from src.graph import build_graph


def test_build_graph_creates_graph():
    """Test build_graph returns compiled graph."""
    graph = build_graph()

    assert graph is not None
    # Graph should be compiled and ready to invoke
    assert hasattr(graph, 'invoke')


def test_build_graph_has_nodes():
    """Test build_graph includes all required nodes."""
    graph = build_graph()

    # Get graph structure
    graph_dict = graph.get_graph()
    node_names = [node.id for node in graph_dict.nodes.values()]

    expected_nodes = [
        "input",
        "video_analysis",
        "image_decision",
        "content_generation",
        "fact_check",
        "human_review",
        "pr_generation"
    ]

    for node in expected_nodes:
        assert node in node_names, f"Missing node: {node}"


@patch('src.nodes.video_analysis_node.download_video')
@patch('src.nodes.video_analysis_node.transcribe_audio')
@patch('src.nodes.video_analysis_node.extract_keyframes')
@patch('src.nodes.video_analysis_node.analyze_frames_with_ollama')
@patch('src.nodes.video_analysis_node.extract_metadata')
@patch('builtins.input', return_value='approve')
def test_graph_invoke_full_meeting(
    mock_input,
    mock_metadata,
    mock_ollama,
    mock_frames,
    mock_transcribe,
    mock_download
):
    """Test graph can be invoked with full meeting input."""
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
        'video_id': 'abc123'
    }

    graph = build_graph()

    input_state = {
        "video_url": "https://youtube.com/watch?v=abc123",
        "video_type": "full_meeting",
        "transcript": None
    }

    # Invoke with config for checkpointing
    config = {"configurable": {"thread_id": "test-meeting"}}
    result = graph.invoke(input_state, config=config)

    assert "pr_url" in result
    assert result["pr_url"].startswith("https://github.com")
