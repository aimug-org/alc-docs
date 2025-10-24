"""Tests for image decision node."""
import pytest
from langgraph.types import Command
from src.nodes.image_decision_node import image_decision_node, should_extract_images


def test_should_extract_images_with_slides():
    """Test extraction decision with slide content."""
    video_analysis = {
        "demos_shown": [{"title": "Architecture Demo"}],
        "key_topics": [{"topic": "Code Example"}]
    }

    assert should_extract_images(video_analysis) is True


def test_should_extract_images_talking_heads_only():
    """Test extraction decision with no visual content."""
    video_analysis = {
        "demos_shown": [],
        "key_topics": []
    }

    assert should_extract_images(video_analysis) is False


def test_image_decision_node_extract():
    """Test image_decision_node returns extract command."""
    state = {
        "video_analysis": {
            "demos_shown": [{"title": "Test Demo"}],
            "key_topics": []
        }
    }

    result = image_decision_node(state)

    assert isinstance(result, Command)
    assert result.goto == "extract_images"
    assert result.update["extract_images"] is True


def test_image_decision_node_skip():
    """Test image_decision_node returns skip command."""
    state = {
        "video_analysis": {
            "demos_shown": [],
            "key_topics": []
        }
    }

    result = image_decision_node(state)

    assert isinstance(result, Command)
    assert result.goto == "content_generation"
    assert result.update["extract_images"] is False
