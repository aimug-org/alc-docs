"""Tests for human review node."""
import pytest
from unittest.mock import patch
from langgraph.types import Command
from src.nodes.human_review_node import human_review_node


def test_human_review_node_no_issues():
    """Test human_review_node auto-proceeds with no flagged items."""
    state = {
        "claims_flagged": 0,
        "fact_check_results": []
    }

    result = human_review_node(state)

    assert isinstance(result, Command)
    assert result.goto == "pr_generation"


@patch('builtins.input', return_value='approve')
def test_human_review_node_user_approves(mock_input):
    """Test human_review_node with user approval."""
    state = {
        "claims_flagged": 2,
        "fact_check_results": [
            {"claim": "Test claim", "status": "needs_review"}
        ]
    }

    result = human_review_node(state)

    assert isinstance(result, Command)
    assert result.goto == "pr_generation"
    assert result.update["human_approved"] is True


@patch('builtins.input', return_value='abort')
def test_human_review_node_user_aborts(mock_input):
    """Test human_review_node with user abort."""
    state = {
        "claims_flagged": 1,
        "fact_check_results": [{"claim": "Test"}]
    }

    result = human_review_node(state)

    assert isinstance(result, Command)
    assert result.goto == "__end__"
