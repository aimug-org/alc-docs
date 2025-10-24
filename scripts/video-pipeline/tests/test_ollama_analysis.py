"""Tests for Ollama visual analysis functionality."""
import pytest
from unittest.mock import patch, MagicMock, mock_open
from src.nodes.ollama_analysis import (
    analyze_frames_with_ollama,
    VisualAnalysisError
)


def test_analyze_frames_detects_slides():
    """Test Ollama detects slides in frames."""
    with patch('ollama.chat') as mock_chat, \
         patch('pathlib.Path.exists', return_value=True), \
         patch('builtins.open', mock_open(read_data=b'fake_image_data')):
        # Mock Ollama response indicating slides
        mock_chat.return_value = {
            'message': {
                'content': 'slide: Title slide showing AIMUG logo and event details'
            }
        }

        result = analyze_frames_with_ollama(['/path/frame1.jpg'])

        assert result['has_slides'] is True
        assert len(result['frame_descriptions']) == 1
        assert result['frame_descriptions'][0]['content_type'] == 'slide'


def test_analyze_frames_detects_diagrams():
    """Test Ollama detects diagrams."""
    with patch('ollama.chat') as mock_chat, \
         patch('pathlib.Path.exists', return_value=True), \
         patch('builtins.open', mock_open(read_data=b'fake_image_data')):
        mock_chat.return_value = {
            'message': {
                'content': 'diagram: Architecture diagram showing LangGraph flow'
            }
        }

        result = analyze_frames_with_ollama(['/path/frame1.jpg'])

        assert result['has_diagrams'] is True
        assert result['frame_descriptions'][0]['content_type'] == 'diagram'


def test_analyze_frames_detects_code():
    """Test Ollama detects code examples."""
    with patch('ollama.chat') as mock_chat, \
         patch('pathlib.Path.exists', return_value=True), \
         patch('builtins.open', mock_open(read_data=b'fake_image_data')):
        mock_chat.return_value = {
            'message': {
                'content': 'code: Python code showing function definition'
            }
        }

        result = analyze_frames_with_ollama(['/path/frame1.jpg'])

        assert result['has_code_examples'] is True
        assert result['frame_descriptions'][0]['content_type'] == 'code'


def test_analyze_frames_talking_heads_only():
    """Test frames with no technical content."""
    with patch('ollama.chat') as mock_chat, \
         patch('pathlib.Path.exists', return_value=True), \
         patch('builtins.open', mock_open(read_data=b'fake_image_data')):
        mock_chat.return_value = {
            'message': {
                'content': 'talking_head: Person speaking to camera'
            }
        }

        result = analyze_frames_with_ollama(['/path/frame1.jpg'])

        assert result['has_slides'] is False
        assert result['has_diagrams'] is False
        assert result['has_code_examples'] is False


def test_analyze_frames_ollama_unavailable():
    """Test graceful degradation when Ollama unavailable."""
    with patch('ollama.chat') as mock_chat, \
         patch('pathlib.Path.exists', return_value=True), \
         patch('builtins.open', mock_open(read_data=b'fake_image_data')):
        mock_chat.side_effect = Exception('Connection refused')

        with pytest.raises(VisualAnalysisError, match='Connection refused'):
            analyze_frames_with_ollama(['/path/frame1.jpg'])
