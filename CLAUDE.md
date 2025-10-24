# Austin LangChain Community Documentation (ALC-Docs)

This repository contains the documentation and blog posts for the Austin LangChain AI Middleware User Group (AIMUG).

## Project Structure

- `/main-docs` - Main Docusaurus site
  - `/blog` - Blog posts and announcements
  - `/docs` - Technical documentation organized by month/year
  - `/src` - React components and customizations
  - `/static` - Static assets like images
  - `/email-templates` - Email templates for mailing list communications
- `/austin_langchain` - Community labs and projects
  - `/labs` - Hands-on labs organized by LangChain course numbers (101-112)
  - `/mcps` - Model Context Protocol servers
  - `/resources` - Meeting notes, presentations, and community resources
- `/scripts` - Utility scripts for automation and content generation
  - `/video-pipeline` - Video content pipeline (Python with venv)

## Video Pipeline Development

**Python Virtual Environment:**
This worktree uses a Python virtual environment for the video pipeline:
- Location: `scripts/video-pipeline/venv`
- Auto-activation: `.envrc` file (requires direnv)
- Manual activation: `source scripts/video-pipeline/venv/bin/activate`

**All Python commands MUST be run from the activated venv.**

## Technologies

- **Docusaurus** (React-based documentation framework)
- **Markdown** for content
- **Mermaid** for diagrams and visualizations
- **Python** scripts for automation
- **Node.js** (v18+) for development

## Development Commands

```bash
# Navigate to main docs directory
cd main-docs

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve built site locally
npm run serve

# Deploy to GitHub Pages
npm run deploy
```

## Content Guidelines

- Blog posts should include truncation marker (`<!-- truncate -->`) after introduction
- Check tags against defined tags in `/main-docs/blog/tags.yml`
- Follow existing naming conventions for files and directories
- Create `.context.md` files for new blog posts to document purpose
- Organize content by month/year in `/main-docs/docs/` directory

## Key Components

- **IndependenceDayPopup** - Fundraising campaign popup
- **NewsletterPopup** - Mailing list subscription popup
- **EventCard** - Displays community events
- **EventFilters** - Filters for event listings

## Community Resources

- **Mailing List**: newsletter.aimug.org
- **GitHub**: github.com/aimug-org
- **Events**: Organized monthly showcases and weekly office hours
- **Labs**: Hands-on coding workshops and tutorials

## Recent Focus Areas

- Model Context Protocol (MCP) integrations
- Agent-to-Agent (A2A) communication protocols
- Voice agent development with FastRTC
- AI workflows and automation
- LangGraph and LangChain ecosystem updates