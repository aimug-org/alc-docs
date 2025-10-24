"""Tests for CLI interface."""
import pytest
from unittest.mock import patch, MagicMock
import sys


def test_parse_args_full_meeting():
    """Test argument parsing for full meeting mode."""
    # Mock src.graph only for this test module
    with patch.dict('sys.modules', {'src.graph': MagicMock()}):
        from pipeline import parse_args

        test_args = [
            'pipeline.py',
            '--video-url', 'https://youtube.com/watch?v=abc123',
            '--mode', 'full'
        ]

        with patch.object(sys, 'argv', test_args):
            args = parse_args()

            assert args.video_url == 'https://youtube.com/watch?v=abc123'
            assert args.mode == 'full'
            assert args.transcript is None


def test_parse_args_with_transcript():
    """Test argument parsing with transcript file."""
    with patch.dict('sys.modules', {'src.graph': MagicMock()}):
        from pipeline import parse_args

        test_args = [
            'pipeline.py',
            '--video-url', 'https://youtube.com/watch?v=abc123',
            '--mode', 'session',
            '--transcript', 'transcript.txt'
        ]

        with patch.object(sys, 'argv', test_args):
            args = parse_args()

            assert args.transcript == 'transcript.txt'


def test_parse_args_dry_run():
    """Test argument parsing with dry-run flag."""
    with patch.dict('sys.modules', {'src.graph': MagicMock()}):
        from pipeline import parse_args

        test_args = [
            'pipeline.py',
            '--video-url', 'https://youtube.com/watch?v=abc123',
            '--mode', 'full',
            '--dry-run'
        ]

        with patch.object(sys, 'argv', test_args):
            args = parse_args()

            assert args.dry_run is True
