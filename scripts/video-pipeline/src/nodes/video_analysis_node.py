"""Video analysis node for extracting insights from videos."""
from typing import Dict, Any
import tempfile
import shutil
from pathlib import Path
import logging

from .video_download import download_video, VideoDownloadError
from .transcription import transcribe_audio, TranscriptionError
from .frame_extraction import extract_keyframes, FrameExtractionError
from .ollama_analysis import analyze_frames_with_ollama, VisualAnalysisError
from .metadata_extraction import extract_metadata

logger = logging.getLogger(__name__)


def video_analysis_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze video and extract structured insights.

    Args:
        state: Pipeline state with video_url and optional transcript

    Returns:
        Dictionary with video_analysis containing structured insights
    """
    video_url = state["video_url"]
    provided_transcript = state.get("transcript")

    # Create temp directory
    temp_dir = Path(tempfile.mkdtemp(prefix="video-pipeline-"))

    try:
        print("\n" + "=" * 60)
        print("VIDEO ANALYSIS")
        print("=" * 60)
        print(f"Video URL: {video_url}\n")

        # Step 1: Download video
        print("[1/5] Downloading video...")
        video_path = download_video(video_url, str(temp_dir))
        print("✓ Downloaded\n")

        # Step 2: Transcribe audio (skip if transcript provided)
        if provided_transcript:
            print("[2/5] Using provided transcript...")
            transcript_text = provided_transcript
            print("✓ Transcript ready\n")
        else:
            print("[2/5] Transcribing audio with Whisper...")
            transcript_result = transcribe_audio(video_path)
            transcript_text = transcript_result['text']
            print(f"✓ Transcribed: {len(transcript_text.split())} words\n")

        # Step 3: Extract keyframes
        print("[3/5] Extracting keyframes...")
        try:
            frame_paths = extract_keyframes(video_path, str(temp_dir))
            print(f"✓ Extracted: {len(frame_paths)} frames\n")
        except FrameExtractionError as e:
            logger.warning(f"Frame extraction failed: {e}")
            frame_paths = []
            print("⚠ Frame extraction failed, skipping visual analysis\n")

        # Step 4: Analyze frames with Ollama
        print("[4/5] Analyzing frames with Ollama...")
        visual_content = {
            'has_slides': False,
            'has_diagrams': False,
            'has_code_examples': False,
            'frame_descriptions': []
        }

        if frame_paths:
            try:
                visual_content = analyze_frames_with_ollama(frame_paths)
                print(f"✓ Analyzed: {len(frame_paths)} frames\n")
                print(f"   Slides: {visual_content['has_slides']}")
                print(f"   Diagrams: {visual_content['has_diagrams']}")
                print(f"   Code: {visual_content['has_code_examples']}\n")
            except VisualAnalysisError as e:
                logger.warning(f"Visual analysis failed: {e}")
                print("⚠ Ollama unavailable, skipping visual analysis\n")

        # Step 5: Extract metadata
        print("[5/5] Extracting metadata...")
        metadata = extract_metadata(video_url)
        print("✓ Complete\n")

        print("Analysis complete!")
        print("=" * 60 + "\n")

        return {
            "video_analysis": {
                "meeting_metadata": metadata,
                "transcript": transcript_text,
                "visual_content": visual_content,
                # Still stubbed for Phase 2C
                "key_topics": [],
                "technical_concepts": [],
                "demos_shown": [],
                "resources_mentioned": []
            }
        }

    except VideoDownloadError as e:
        raise ValueError(f"Failed to download video: {e}")

    except TranscriptionError as e:
        raise ValueError(f"Failed to transcribe video: {e}")

    finally:
        # Cleanup temp files
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
            logger.info(f"Cleaned up temp files at {temp_dir}")
