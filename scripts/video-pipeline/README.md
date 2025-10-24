# AIMUG Video Content Pipeline

Automated pipeline for processing AIMUG meeting videos into documentation and social media content.

## Features
- Video analysis with local Ollama models
- AI-assisted fact-checking
- Multi-platform social media content generation
- GitHub PR workflow integration

## Requirements
- Python 3.9+
- Ollama with llama3.2-vision
- GitHub CLI (gh)
- Environment variables (see .env.example)

## Usage
```bash
# Full meeting processing
python pipeline.py --video-url https://youtube.com/... --mode full

# Individual session processing
python pipeline.py --video-url https://youtube.com/... --mode session
```

## Architecture
See: docs/plans/2025-10-24-video-content-pipeline-design.md
