"""Tests for video analysis node."""
import pytest
from src.nodes.video_analysis_node import video_analysis_node


def test_video_analysis_node_returns_structured_data():
    """Test video_analysis_node returns expected structure."""
    state = {
        "video_url": "https://youtube.com/watch?v=abc123",
        "video_type": "full_meeting",
        "transcript": None
    }

    result = video_analysis_node(state)

    assert "video_analysis" in result
    assert "meeting_metadata" in result["video_analysis"]
    assert "key_topics" in result["video_analysis"]
    assert "technical_concepts" in result["video_analysis"]
    assert "demos_shown" in result["video_analysis"]
    assert "resources_mentioned" in result["video_analysis"]


def test_video_analysis_node_with_transcript():
    """Test video_analysis_node uses provided transcript."""
    state = {
        "video_url": "https://youtube.com/watch?v=abc123",
        "video_type": "full_meeting",
        "transcript": "Test transcript content"
    }

    result = video_analysis_node(state)

    # Should have video analysis
    assert "video_analysis" in result
