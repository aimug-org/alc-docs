"""Video download functionality using yt-dlp."""
import yt_dlp
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class VideoDownloadError(Exception):
    """Raised when video download fails."""
    pass


def download_video(video_url: str, output_dir: str) -> str:
    """Download YouTube video using yt-dlp.

    Args:
        video_url: YouTube video URL
        output_dir: Directory to save video

    Returns:
        Path to downloaded video file

    Raises:
        VideoDownloadError: If download fails
    """
    try:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        ydl_opts = {
            'format': 'best[ext=mp4]',
            'outtmpl': str(output_path / '%(id)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            video_id = info['id']
            video_ext = info.get('ext', 'mp4')
            video_path = output_path / f"{video_id}.{video_ext}"

            logger.info(f"Downloaded video: {video_path}")
            return str(video_path)

    except Exception as e:
        raise VideoDownloadError(f"Failed to download video: {e}")
