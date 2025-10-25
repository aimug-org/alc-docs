"""Tests for video download functionality."""
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock
from src.nodes.video_download import download_video, VideoDownloadError


def test_download_video_success(tmp_path):
    """Test successful video download."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        # Mock successful download
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.return_value = {
            'id': 'test123',
            'ext': 'mp4'
        }

        result = download_video(
            'https://youtube.com/watch?v=test123',
            str(tmp_path)
        )

        assert result == str(tmp_path / 'test123.mp4')
        mock_instance.extract_info.assert_called_once()


def test_download_video_invalid_url():
    """Test download with invalid URL."""
    with pytest.raises(VideoDownloadError):
        download_video('not-a-url', '/tmp')


def test_download_video_network_error(tmp_path):
    """Test download with network error."""
    with patch('yt_dlp.YoutubeDL') as mock_ytdl:
        mock_instance = MagicMock()
        mock_ytdl.return_value.__enter__.return_value = mock_instance
        mock_instance.extract_info.side_effect = Exception('Network error')

        with pytest.raises(VideoDownloadError, match='Network error'):
            download_video('https://youtube.com/watch?v=test', str(tmp_path))
