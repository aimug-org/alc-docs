"""State schemas for video content pipeline."""
from typing import TypedDict, Optional, Literal


class InputState(TypedDict):
    """User-provided input state."""
    video_url: str
    video_type: Literal["full_meeting", "individual_session"]
    transcript: Optional[str]
    dry_run: bool


class OutputState(TypedDict):
    """Final output state returned to user."""
    pr_url: str
    social_content: dict


class PipelineState(InputState, OutputState):
    """Complete internal pipeline state."""
    # Video analysis
    video_analysis: dict

    # Image extraction
    extract_images: bool
    image_candidates: list
    extracted_images: list

    # Generated content
    learn_content: Optional[str]
    blog_content: str
    social_content: dict

    # Fact checking
    fact_check_results: list
    claims_flagged: int

    # Review
    human_approved: bool
