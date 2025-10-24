"""Tests for content generation node."""
import pytest
from src.nodes.content_generation_node import content_generation_node


def test_content_generation_node_structure():
    """Test content_generation_node returns all required content."""
    state = {
        "video_type": "full_meeting",
        "video_analysis": {
            "meeting_metadata": {"title": "Test Meeting"},
            "key_topics": [],
            "technical_concepts": []
        },
        "extracted_images": []
    }

    result = content_generation_node(state)

    assert "learn_content" in result
    assert "blog_content" in result
    assert "social_content" in result

    # Check social content structure
    social = result["social_content"]
    assert "aimug_twitter_thread" in social
    assert "personal_twitter_thread" in social
    assert "linkedin_post" in social
    assert "email_blast" in social


def test_content_generation_node_full_meeting():
    """Test content generation for full meeting."""
    state = {
        "video_type": "full_meeting",
        "video_analysis": {
            "meeting_metadata": {"title": "October Showcase"},
            "key_topics": [{"topic": "LangGraph"}]
        },
        "extracted_images": []
    }

    result = content_generation_node(state)

    # Full meeting should have learn_content
    assert result["learn_content"] is not None


def test_content_generation_node_individual_session():
    """Test content generation for individual session."""
    state = {
        "video_type": "individual_session",
        "video_analysis": {
            "meeting_metadata": {"title": "Speaker Session"},
            "key_topics": []
        },
        "extracted_images": []
    }

    result = content_generation_node(state)

    # Should still have blog and social content
    assert result["blog_content"] != ""
    assert len(result["social_content"]) > 0
