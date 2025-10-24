"""Metadata extraction functionality using yt-dlp."""
import yt_dlp
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def extract_metadata(video_url: str) -> dict:
    """Extract video metadata from YouTube.

    Args:
        video_url: YouTube video URL

    Returns:
        {
            "title": str,
            "date": str (YYYY-MM-DD),
            "duration": str (formatted),
            "video_id": str
        }
    """
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)

        # Parse upload date
        upload_date = info.get('upload_date', '')
        if upload_date:
            date_obj = datetime.strptime(upload_date, '%Y%m%d')
            formatted_date = date_obj.strftime('%Y-%m-%d')
        else:
            formatted_date = datetime.now().strftime('%Y-%m-%d')

        # Format duration
        duration_sec = info.get('duration', 0)
        if duration_sec >= 3600:
            hours = duration_sec // 3600
            minutes = (duration_sec % 3600) // 60
            formatted_duration = f"{hours}h {minutes}min"
        else:
            minutes = duration_sec // 60
            formatted_duration = f"{minutes}min"

        metadata = {
            'title': info.get('title', 'Unknown Title'),
            'date': formatted_date,
            'duration': formatted_duration,
            'video_id': info.get('id', '')
        }

        logger.info(f"Extracted metadata: {metadata['title']} ({metadata['duration']})")
        return metadata
