"""Image extraction node for extracting frames from video.

TODO: Implement actual frame extraction with Ollama vision analysis.
This is a stub that simulates image extraction.
"""
from typing import Dict, Any


def extract_images_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Extract images from video frames (STUB).

    Args:
        state: Pipeline state with image_candidates

    Returns:
        Dictionary with extracted_images list

    Note:
        This is a stub implementation. Real implementation will:
        - Use yt-dlp to extract video frames at key moments
        - Use Ollama llama3.2-vision to analyze frame quality
        - Select best frames for documentation
        - Save frames to static/img/showcases/YYYY-MM/
        - Return list of extracted image paths
    """
    # TODO: Implement actual frame extraction
    # - yt-dlp to download and extract frames
    # - Ollama vision to analyze frame content
    # - Select best frames based on quality
    # - Save to appropriate directory

    # Simulate extracting images
    image_candidates = state.get("image_candidates", [])

    print("\n" + "=" * 60)
    print("IMAGE EXTRACTION (SIMULATED)")
    print("=" * 60)
    print(f"Analyzing {len(image_candidates)} candidate frames...")
    print("Would extract and save selected frames")
    print("=" * 60 + "\n")

    # Return empty list for now
    return {"extracted_images": []}
