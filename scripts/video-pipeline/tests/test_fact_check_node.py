"""Tests for fact checking node."""
import pytest
from src.nodes.fact_check_node import fact_check_node, validate_links


def test_validate_links_valid():
    """Test link validation with valid URLs."""
    content = "Check out https://github.com/aimug-org"

    results = validate_links(content)

    assert len(results) == 1
    assert results[0]["url"] == "https://github.com/aimug-org"
    assert results[0]["status"] == "valid"


def test_validate_links_extracts_multiple():
    """Test link extraction finds multiple URLs."""
    content = """
    Visit https://aimug.org and https://github.com/aimug-org
    """

    results = validate_links(content)

    assert len(results) == 2


def test_fact_check_node_structure():
    """Test fact_check_node returns expected structure."""
    state = {
        "learn_content": "# Test\nLink: https://aimug.org",
        "blog_content": "Blog with https://github.com",
        "social_content": {
            "aimug_twitter_thread": ["Tweet https://aimug.org"]
        }
    }

    result = fact_check_node(state)

    assert "fact_check_results" in result
    assert "claims_flagged" in result
    assert isinstance(result["fact_check_results"], list)
    assert isinstance(result["claims_flagged"], int)


def test_fact_check_node_counts_issues():
    """Test fact_check_node counts flagged items."""
    state = {
        "learn_content": "Content",
        "blog_content": "Content",
        "social_content": {}
    }

    result = fact_check_node(state)

    # Stub should report 0 issues
    assert result["claims_flagged"] == 0
