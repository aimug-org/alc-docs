"""Tests for PR generation node."""
import pytest
from src.nodes.pr_generation_node import pr_generation_node, get_month_folder


def test_get_month_folder():
    """Test month folder name generation."""
    assert get_month_folder("2025-10-24") == "oct-2025"
    assert get_month_folder("2025-01-15") == "jan-2025"
    assert get_month_folder("2025-12-31") == "dec-2025"


def test_pr_generation_node_structure():
    """Test pr_generation_node returns PR URL."""
    state = {
        "video_url": "https://youtube.com/watch?v=abc123",
        "video_type": "full_meeting",
        "video_analysis": {
            "meeting_metadata": {"date": "2025-10-24", "title": "Test"}
        },
        "learn_content": "# Learn content",
        "blog_content": "# Blog content",
        "social_content": {"twitter": ["tweet"]},
        "fact_check_results": []
    }

    result = pr_generation_node(state)

    assert "pr_url" in result
    assert result["pr_url"].startswith("https://github.com")


def test_pr_generation_node_full_meeting():
    """Test PR generation for full meeting."""
    state = {
        "video_url": "https://youtube.com/watch?v=abc123",
        "video_type": "full_meeting",
        "video_analysis": {
            "meeting_metadata": {"date": "2025-10-24", "title": "October Showcase"}
        },
        "learn_content": "# October 2025\n\nContent...",
        "blog_content": "# Blog",
        "social_content": {}
    }

    result = pr_generation_node(state)

    # Should generate PR URL
    assert "pr_url" in result
