"""Tests for audio transcription functionality."""
import pytest
from unittest.mock import patch, MagicMock
from src.nodes.transcription import transcribe_audio, TranscriptionError


def test_transcribe_audio_success():
    """Test successful audio transcription."""
    with patch('whisper.load_model') as mock_load, \
         patch('pathlib.Path.exists', return_value=True):
        mock_model = MagicMock()
        mock_load.return_value = mock_model
        mock_model.transcribe.return_value = {
            'text': 'This is a test transcript.',
            'language': 'en'
        }

        result = transcribe_audio('/path/to/video.mp4')

        assert result['text'] == 'This is a test transcript.'
        assert result['language'] == 'en'
        assert 'duration' in result
        mock_load.assert_called_once()
        mock_model.transcribe.assert_called_once()


def test_transcribe_audio_with_model_choice():
    """Test transcription with specific model."""
    with patch('whisper.load_model') as mock_load, \
         patch('pathlib.Path.exists', return_value=True):
        mock_model = MagicMock()
        mock_load.return_value = mock_model
        mock_model.transcribe.return_value = {
            'text': 'Test',
            'language': 'en'
        }

        result = transcribe_audio('/path/to/video.mp4', model='small')

        mock_load.assert_called_with('small', device='cpu')


def test_transcribe_audio_file_not_found():
    """Test transcription with missing file."""
    with pytest.raises(TranscriptionError, match='File not found'):
        transcribe_audio('/nonexistent/video.mp4')
