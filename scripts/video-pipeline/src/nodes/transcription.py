"""Audio transcription functionality using Whisper."""
import whisper
from pathlib import Path
import logging
import os

logger = logging.getLogger(__name__)


class TranscriptionError(Exception):
    """Raised when transcription fails."""
    pass


def transcribe_audio(
    video_path: str,
    model: str = 'base',
    device: str = 'cpu'
) -> dict:
    """Transcribe video audio using Whisper.

    Args:
        video_path: Path to video file
        model: Whisper model name (tiny, base, small, medium, large)
        device: Device to use (cpu, cuda, mps)

    Returns:
        {
            "text": "Full transcript...",
            "language": "en",
            "duration": 2700.5
        }

    Raises:
        TranscriptionError: If transcription fails
    """
    try:
        video_file = Path(video_path)
        if not video_file.exists():
            raise TranscriptionError(f"File not found: {video_path}")

        # Get model from environment or use default
        model_name = os.getenv('WHISPER_MODEL', model)
        device_name = os.getenv('WHISPER_DEVICE', device)

        logger.info(f"Loading Whisper model: {model_name}")
        whisper_model = whisper.load_model(model_name, device=device_name)

        logger.info(f"Transcribing audio from: {video_path}")
        result = whisper_model.transcribe(str(video_path))

        transcript = {
            'text': result['text'],
            'language': result.get('language', 'unknown'),
            'duration': result.get('duration', 0.0)
        }

        word_count = len(transcript['text'].split())
        logger.info(
            f"Transcription complete: {transcript['duration']:.1f}s "
            f"→ {word_count} words"
        )

        return transcript

    except Exception as e:
        if isinstance(e, TranscriptionError):
            raise
        raise TranscriptionError(f"Failed to transcribe audio: {e}")
