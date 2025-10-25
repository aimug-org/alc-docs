"""Tests for metadata extraction functionality."""
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime
from src.nodes.metadata_extraction import extract_metadata


def test_extract_metadata_success():
    """Test successful metadata extraction."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.return_value = {
            'title': 'October 2025 AIMUG Showcase',
            'upload_date': '20251015',
            'duration': 6300,  # 105 minutes
            'id': 'abc123xyz'
        }

        result = extract_metadata('https://youtube.com/watch?v=abc123xyz')

        assert result['title'] == 'October 2025 AIMUG Showcase'
        assert result['date'] == '2025-10-15'
        assert result['duration'] == '1h 45min'
        assert result['video_id'] == 'abc123xyz'


def test_extract_metadata_short_video():
    """Test metadata for short video (under 1 hour)."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.return_value = {
            'title': 'Short Demo',
            'upload_date': '20251024',
            'duration': 1800,  # 30 minutes
            'id': 'short123'
        }

        result = extract_metadata('https://youtube.com/watch?v=short123')

        assert result['duration'] == '30min'


def test_extract_metadata_invalid_url():
    """Test metadata extraction with invalid URL."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.side_effect = Exception('Invalid URL')

        with pytest.raises(Exception):
            extract_metadata('not-a-url')
