"""Input validation node for video pipeline."""
import re
from typing import Dict, Any


def validate_youtube_url(url: str) -> bool:
    """Validate that URL is a YouTube video URL.

    Args:
        url: URL string to validate

    Returns:
        True if valid YouTube URL, False otherwise
    """
    youtube_patterns = [
        r'https?://(?:www\.)?youtube\.com/watch\?v=[\w-]+',
        r'https?://youtu\.be/[\w-]+'
    ]

    return any(re.match(pattern, url) for pattern in youtube_patterns)


def input_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and process input state.

    Args:
        state: Input state containing video_url, video_type, transcript

    Returns:
        Validated state dictionary

    Raises:
        ValueError: If video URL is invalid
    """
    video_url = state["video_url"]

    if not validate_youtube_url(video_url):
        raise ValueError(f"Invalid YouTube URL: {video_url}")

    return {
        "video_url": video_url,
        "video_type": state["video_type"],
        "transcript": state.get("transcript")
    }
