"""Video analysis node for extracting insights from videos.

TODO: Implement actual video processing with Ollama + Whisper.
This is a stub that returns mock data for pipeline development.
"""
from typing import Dict, Any


def video_analysis_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze video and extract structured insights (STUB).

    Args:
        state: Pipeline state with video_url and optional transcript

    Returns:
        Dictionary with video_analysis containing structured insights

    Note:
        This is a stub implementation. Real implementation will:
        - Extract keyframes from video
        - Run Ollama llama3.2-vision on frames
        - Process audio with Whisper if no transcript
        - Combine visual + audio into structured format
    """
    # TODO: Implement actual video processing
    # For now, return mock structure for pipeline development

    return {
        "video_analysis": {
            "meeting_metadata": {
                "date": "2025-10-24",
                "title": "Test Meeting",
                "speakers": [],
                "duration": "60min"
            },
            "key_topics": [],
            "technical_concepts": [],
            "demos_shown": [],
            "resources_mentioned": []
        }
    }
