"""Frame extraction functionality using ffmpeg."""
import ffmpeg
from pathlib import Path
import logging
import os

logger = logging.getLogger(__name__)


class FrameExtractionError(Exception):
    """Raised when frame extraction fails."""
    pass


def extract_keyframes(
    video_path: str,
    output_dir: str,
    max_frames: int = 15,
    scene_threshold: float = 0.4
) -> list[str]:
    """Extract keyframes at scene changes using ffmpeg.

    Args:
        video_path: Path to video file
        output_dir: Directory to save frames
        max_frames: Maximum number of frames to extract
        scene_threshold: Scene detection threshold (0.0-1.0)

    Returns:
        List of frame file paths

    Raises:
        FrameExtractionError: If extraction fails
    """
    try:
        video_file = Path(video_path)
        if not video_file.exists():
            raise FrameExtractionError(f"Video file not found: {video_path}")

        # Create frames directory
        frames_dir = Path(output_dir) / 'frames'
        frames_dir.mkdir(parents=True, exist_ok=True)

        output_pattern = str(frames_dir / 'frame_%03d.jpg')

        logger.info(f"Extracting keyframes from: {video_path}")

        # Use ffmpeg to extract frames at scene changes
        stream = ffmpeg.input(str(video_path))
        stream = stream.filter('select', f'gt(scene,{scene_threshold})')
        stream = stream.output(
            output_pattern,
            vsync='vfr',
            format='image2',
            **{'q:v': 2}  # JPEG quality (2 = high)
        )

        # Run ffmpeg
        ffmpeg.run(stream, quiet=True, overwrite_output=True)

        # Get extracted frames
        frame_files = sorted(frames_dir.glob('frame_*.jpg'))

        # Limit to max_frames if needed (take evenly spaced)
        if len(frame_files) > max_frames:
            step = len(frame_files) / max_frames
            indices = [int(i * step) for i in range(max_frames)]
            frame_files = [frame_files[i] for i in indices]

        frame_paths = [str(f) for f in frame_files]

        logger.info(f"Extracted {len(frame_paths)} keyframes")
        return frame_paths

    except Exception as e:
        if isinstance(e, FrameExtractionError):
            raise
        raise FrameExtractionError(f"Failed to extract frames: {e}")
