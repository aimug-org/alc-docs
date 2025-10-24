#!/usr/bin/env python3
"""AIMUG Video Content Pipeline CLI.

Usage:
    python pipeline.py --video-url URL --mode MODE [options]

Examples:
    # Full meeting processing
    python pipeline.py --video-url https://youtube.com/watch?v=abc123 --mode full

    # Individual session processing
    python pipeline.py --video-url https://youtube.com/watch?v=xyz789 --mode session

    # With transcript
    python pipeline.py --video-url URL --mode full --transcript transcript.txt

    # Dry run (no PR creation)
    python pipeline.py --video-url URL --mode full --dry-run
"""
import argparse
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

from src.graph import build_graph


def parse_args():
    """Parse command line arguments.

    Returns:
        Parsed argument namespace
    """
    parser = argparse.ArgumentParser(
        description="AIMUG Video Content Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )

    parser.add_argument(
        '--video-url',
        required=True,
        help='YouTube video URL to process'
    )

    parser.add_argument(
        '--mode',
        required=True,
        choices=['full', 'session'],
        help='Processing mode: full (full meeting) or session (individual speaker)'
    )

    parser.add_argument(
        '--transcript',
        help='Path to transcript file (optional)'
    )

    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Run pipeline without creating PR'
    )

    parser.add_argument(
        '--resume',
        help='Resume from checkpoint (thread ID)'
    )

    return parser.parse_args()


def load_transcript(transcript_path: str) -> str:
    """Load transcript from file.

    Args:
        transcript_path: Path to transcript file

    Returns:
        Transcript content as string
    """
    path = Path(transcript_path)
    if not path.exists():
        print(f"Error: Transcript file not found: {transcript_path}")
        sys.exit(1)

    return path.read_text()


def main():
    """Main CLI entry point."""
    # Load environment variables
    load_dotenv()

    # Parse arguments
    args = parse_args()

    # Validate required environment variables
    required_vars = ['ANTHROPIC_API_KEY', 'GITHUB_TOKEN']
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        print(f"Error: Missing required environment variables: {', '.join(missing)}")
        print("Please set them in .env file or environment")
        sys.exit(1)

    # Build graph
    print("Building video content pipeline...")
    graph = build_graph()

    # Prepare input state
    video_type = "full_meeting" if args.mode == "full" else "individual_session"

    transcript = None
    if args.transcript:
        transcript = load_transcript(args.transcript)

    input_state = {
        "video_url": args.video_url,
        "video_type": video_type,
        "transcript": transcript
    }

    # Configure execution
    thread_id = args.resume if args.resume else f"pipeline-{video_type}"
    config = {"configurable": {"thread_id": thread_id}}

    # Execute pipeline
    print(f"\nProcessing video: {args.video_url}")
    print(f"Mode: {video_type}")
    print(f"Thread ID: {thread_id}")
    print("\nStarting pipeline...\n")

    try:
        result = graph.invoke(input_state, config=config)

        print("\n" + "="*60)
        print("PIPELINE COMPLETE")
        print("="*60)
        print(f"\nPR URL: {result['pr_url']}")
        print("\nNext steps:")
        print("1. Review the generated PR")
        print("2. Check social media content in PR comments")
        print("3. Merge PR when ready")
        print("4. Post social media content")
        print("\n")

    except Exception as e:
        print(f"\nError during pipeline execution: {e}")
        print("\nTo resume from checkpoint, use:")
        print(f"  python pipeline.py --resume {thread_id}")
        sys.exit(1)


if __name__ == "__main__":
    main()
