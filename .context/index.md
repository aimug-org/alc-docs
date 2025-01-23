# Codebase Context

## Project Overview
- **Name**: alc-docs
- **Description**: Documentation and event management system for Austin LangChain AI Middleware User Group
- **Main Technologies**: 
  - Docusaurus
  - React
  - Markdown
  - Python
  - Node.js >= 20.0

## Directory Structure
```
/
├── main-docs/               # Main documentation site
│   ├── docs/               # Core documentation content
│   │   └── {month}-{year}/ # Monthly content directories
│   ├── blog/               # Blog posts and announcements
│   └── src/
│       └── pages/          # Static pages
├── scripts/                # Utility scripts
└── .context/              # AI assistance files
```

## Conventions

### Documentation
- All content written in Markdown
- Monthly organization in /main-docs/docs/{month}-{year}/
- Event pages auto-generated using Python scripts

### File Naming
- Use kebab-case for file names
- Python scripts use snake_case
- React components use PascalCase
- CSS modules use camelCase

### Blog Posts
- Truncation marker (<!-- truncate -->) after first paragraph
- Only use tags from /main-docs/blog/tags.yml
- Link authors to GitHub profiles
- Include proper frontmatter (slug, title, authors, tags)

### Development
- Node.js version 20+ required
- npm for package management
- Python for automation scripts
- React for custom components

## Related Resources
- [Docusaurus Documentation](https://docusaurus.io/docs)
- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
- [Austin LangChain Community](https://aimug.org)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)

## Excluded from Analysis
- Build outputs (main-docs/build/, .docusaurus/)
- Dependencies (node_modules/)
- Environment files (.env*)
- IDE and editor files
- Temporary and cache files
- Generated files (except specific images)

## Notes for AI Assistance
- Use update_events.py for modifying event pages
- Follow monthly directory structure for new docs
- Maintain consistent Markdown formatting
- Verify tags exist in tags.yml before use
- Ensure Node.js 20+ compatibility
- Check .contextignore for excluded patterns
