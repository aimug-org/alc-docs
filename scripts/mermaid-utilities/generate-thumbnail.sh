#!/bin/bash

# Check if proper arguments are provided
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <path-to-mmd-file> <output-png-path> [width] [height]"
    echo "Example: $0 blog/post/diagram.mmd blog/post/img/thumbnail.png 1200 630"
    exit 1
fi

SOURCE_MMD="$1"
OUTPUT_PNG="$2"
WIDTH=${3:-1200}
HEIGHT=${4:-630}

# Ensure the source file exists
if [ ! -f "$SOURCE_MMD" ]; then
    echo "Error: Source file '$SOURCE_MMD' not found!"
    exit 1
fi

# Create output directory if it doesn't exist
OUTPUT_DIR=$(dirname "$OUTPUT_PNG")
mkdir -p "$OUTPUT_DIR"

# Install mermaid-cli if not already installed
if ! command -v mmdc &> /dev/null; then
    echo "Installing mermaid-cli..."
    npm install -g @mermaid-js/mermaid-cli
    
    # Check if installation was successful
    if [ $? -ne 0 ]; then
        echo "Failed to install mermaid-cli. Please install it manually: npm install -g @mermaid-js/mermaid-cli"
        exit 1
    fi
fi

# Generate PNG from Mermaid file
echo "Generating thumbnail image..."
mmdc -i "$SOURCE_MMD" -o "$OUTPUT_PNG" -w "$WIDTH" -H "$HEIGHT" -b transparent

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo "Thumbnail generated successfully at $OUTPUT_PNG"
else
    echo "Error generating thumbnail. Please check your Mermaid syntax."
    exit 1
fi
