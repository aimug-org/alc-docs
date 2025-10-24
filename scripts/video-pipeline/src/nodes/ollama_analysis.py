"""Visual analysis functionality using Ollama."""
import ollama
from pathlib import Path
import logging
import os
import base64

logger = logging.getLogger(__name__)


class VisualAnalysisError(Exception):
    """Raised when visual analysis fails."""
    pass


def analyze_frames_with_ollama(
    frame_paths: list[str],
    model: str = 'llama3.2-vision'
) -> dict:
    """Analyze video frames with Ollama vision model.

    Args:
        frame_paths: List of frame image file paths
        model: Ollama model name (must support vision)

    Returns:
        {
            "has_slides": bool,
            "has_diagrams": bool,
            "has_code_examples": bool,
            "frame_descriptions": [
                {
                    "frame_num": int,
                    "description": str,
                    "content_type": str
                }
            ]
        }

    Raises:
        VisualAnalysisError: If Ollama unavailable or analysis fails
    """
    try:
        model_name = os.getenv('OLLAMA_MODEL', model)

        has_slides = False
        has_diagrams = False
        has_code = False
        frame_descriptions = []

        prompt = """Analyze this video frame and answer:
1. What type of content is shown? (slide, diagram, code, talking_head, other)
2. Briefly describe what you see (1-2 sentences)

Format your response as: [type]: [description]
Be concise and specific."""

        logger.info(f"Analyzing {len(frame_paths)} frames with Ollama")

        for idx, frame_path in enumerate(frame_paths, 1):
            frame_file = Path(frame_path)
            if not frame_file.exists():
                logger.warning(f"Frame not found: {frame_path}")
                continue

            # Read and encode image
            with open(frame_path, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')

            # Analyze with Ollama
            response = ollama.chat(
                model=model_name,
                messages=[{
                    'role': 'user',
                    'content': prompt,
                    'images': [image_data]
                }]
            )

            content = response['message']['content'].strip()

            # Parse response
            content_type = 'other'
            description = content

            if content.startswith('slide:'):
                content_type = 'slide'
                has_slides = True
                description = content[6:].strip()
            elif content.startswith('diagram:'):
                content_type = 'diagram'
                has_diagrams = True
                description = content[8:].strip()
            elif content.startswith('code:'):
                content_type = 'code'
                has_code = True
                description = content[5:].strip()
            elif content.startswith('talking_head:'):
                content_type = 'talking_head'
                description = content[13:].strip()

            frame_descriptions.append({
                'frame_num': idx,
                'description': description,
                'content_type': content_type
            })

        logger.info(
            f"Analysis complete: slides={has_slides}, "
            f"diagrams={has_diagrams}, code={has_code}"
        )

        return {
            'has_slides': has_slides,
            'has_diagrams': has_diagrams,
            'has_code_examples': has_code,
            'frame_descriptions': frame_descriptions
        }

    except Exception as e:
        raise VisualAnalysisError(f"Failed to analyze frames: {e}")
