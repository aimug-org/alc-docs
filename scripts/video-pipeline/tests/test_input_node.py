"""Tests for input validation node."""
import pytest
from src.nodes.input_node import input_node, validate_youtube_url


def test_validate_youtube_url_valid():
    """Test YouTube URL validation with valid URLs."""
    valid_urls = [
        "https://youtube.com/watch?v=abc123",
        "https://www.youtube.com/watch?v=xyz789",
        "https://youtu.be/short123"
    ]
    for url in valid_urls:
        assert validate_youtube_url(url) is True


def test_validate_youtube_url_invalid():
    """Test YouTube URL validation rejects invalid URLs."""
    invalid_urls = [
        "https://vimeo.com/123456",
        "not a url",
        "https://youtube.com/shorts/abc"
    ]
    for url in invalid_urls:
        assert validate_youtube_url(url) is False


def test_input_node_valid_input():
    """Test input_node processes valid state."""
    state = {
        "video_url": "https://youtube.com/watch?v=abc123",
        "video_type": "full_meeting",
        "transcript": None
    }
    result = input_node(state)

    assert result["video_url"] == state["video_url"]
    assert result["video_type"] == state["video_type"]
    assert result["transcript"] is None


def test_input_node_invalid_url():
    """Test input_node raises error for invalid URL."""
    state = {
        "video_url": "https://vimeo.com/123456",
        "video_type": "full_meeting",
        "transcript": None
    }

    with pytest.raises(ValueError, match="Invalid YouTube URL"):
        input_node(state)


def test_input_node_with_transcript():
    """Test input_node handles provided transcript."""
    state = {
        "video_url": "https://youtube.com/watch?v=abc123",
        "video_type": "individual_session",
        "transcript": "This is a test transcript."
    }
    result = input_node(state)

    assert result["transcript"] == "This is a test transcript."
