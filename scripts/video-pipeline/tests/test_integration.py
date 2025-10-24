"""Integration tests for full pipeline."""
import pytest
from unittest.mock import patch
from src.graph import build_graph


@patch('builtins.input', return_value='approve')
def test_full_pipeline_integration(mock_input):
    """Test complete pipeline execution from input to PR."""
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


@patch('builtins.input', return_value='approve')
def test_individual_session_pipeline(mock_input):
    """Test pipeline with individual session."""
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
