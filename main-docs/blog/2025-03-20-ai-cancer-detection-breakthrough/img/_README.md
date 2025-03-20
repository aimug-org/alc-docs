# AI Cancer Detection Model Visualization

This directory contains files for generating and visualizing the AI cancer detection model created by Vinika Kakarla.

## Files

- `thumbnail.mmd` - Mermaid diagram source code
- `thumbnail.png` - Generated thumbnail image used in the blog post
- `preview-thumbnail.html` - HTML file to preview the Mermaid diagram in a browser

## How to Work with These Files

### Viewing the Diagram

1. Open `preview-thumbnail.html` in a browser to see the rendered Mermaid diagram
2. This works without any additional tools as it uses the Mermaid CDN

### Regenerating the Thumbnail

If you make changes to the Mermaid diagram in `thumbnail.mmd`, you can regenerate the PNG using the utility scripts in the `/scripts/mermaid-utilities/` directory:

```bash
# Navigate to the project root
cd /Users/colinmcnamara/Code/alc-docs

# Generate the thumbnail
scripts/mermaid-utilities/generate-thumbnail.sh \
  main-docs/blog/2025-03-20-ai-cancer-detection-breakthrough/img/thumbnail.mmd \
  main-docs/blog/2025-03-20-ai-cancer-detection-breakthrough/img/thumbnail.png
```

If you need to create a placeholder PNG before generating the actual thumbnail:

```bash
# Navigate to the project root
cd /Users/colinmcnamara/Code/alc-docs

# Create a placeholder
node scripts/mermaid-utilities/create-placeholder.js \
  main-docs/blog/2025-03-20-ai-cancer-detection-breakthrough/img/thumbnail.png
```

### Using in Other Posts

To use this type of visualization in other posts:

1. Create a similar Mermaid diagram and save it as `.mmd`
2. Generate a PNG using one of the methods above
3. Reference the PNG in your blog post's frontmatter
4. Include the Mermaid source in your post to allow Docusaurus to render it

## Notes

- The Mermaid diagram is displayed directly in the blog post via Docusaurus's built-in Mermaid support
- The PNG is referenced in the frontmatter as the `image` property, which is used for social media cards
- You can modify the Mermaid diagram in the blog post without affecting the thumbnail image
