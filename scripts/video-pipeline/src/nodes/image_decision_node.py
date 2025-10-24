"""Image extraction decision node using Command for routing."""
from typing import Dict, Any, Literal
from langgraph.types import Command


def should_extract_images(video_analysis: Dict[str, Any]) -> bool:
    """Determine if video contains valuable static content worth extracting.

    Args:
        video_analysis: Structured video analysis data

    Returns:
        True if images should be extracted, False otherwise

    Criteria for extraction:
    - Demos or presentations shown
    - Technical concepts discussed (likely has slides)
    - Resources mentioned (likely has screenshots)
    """
    has_demos = len(video_analysis.get("demos_shown", [])) > 0
    has_topics = len(video_analysis.get("key_topics", [])) > 0
    has_resources = len(video_analysis.get("resources_mentioned", [])) > 0

    return has_demos or has_topics or has_resources


def image_decision_node(
    state: Dict[str, Any]
) -> Command[Literal["extract_images", "content_generation"]]:
    """Decide whether to extract images from video using AI analysis.

    Args:
        state: Pipeline state with video_analysis

    Returns:
        Command routing to either extract_images or content_generation
    """
    video_analysis = state["video_analysis"]

    if should_extract_images(video_analysis):
        return Command(
            goto="extract_images",
            update={
                "extract_images": True,
                "image_candidates": []  # TODO: Populate with actual frame data
            }
        )
    else:
        return Command(
            goto="content_generation",
            update={"extract_images": False}
        )
