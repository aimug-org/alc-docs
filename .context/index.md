# ALC-Docs Project Context

This project contains documentation and blog posts for the Austin LangChain AI Middleware User Group.

## Project Structure

- `/main-docs` - Main Docusaurus site
  - `/blog` - Blog posts and announcements
  - `/docs` - Technical documentation organized by month/year
  - `/src` - React components and customizations
  - `/static` - Static assets like images

## Recent Updates

- Added blog post: "High School Sophomore Creates Groundbreaking AI Solution for Detecting Fatal Liver Cancer" (2025-03-20)
  - Located at: `/main-docs/blog/2025-03-20-ai-cancer-detection-breakthrough/`
  - Covers Vinika Kakarla's presentation on using AI/ML to detect hepatocellular carcinoma
  - Includes social media content for promotion
  - Source: March meeting presentation, YouTube video: https://www.youtube.com/watch?v=ArqkC5sQjEY

- Updated events page with SXSW Lightning Talks Party information (2025-03-08)
  - Located at: `/main-docs/src/pages/events.md`
  - Replaced "SXSW Rooftop Party" with "SXSW Lightning Talks Party" on March 12, 2025
  - Added registration links for Lu.ma and Meetup
  - Added detailed event description and speaker information
  - Updated "Last updated" date to March 8, 2025

- Updated events page with Zoom link for March 5, 2025 "March Mixer - Off SXSW Edition" event (2025-03-05)
  - Located at: `/main-docs/src/pages/events.md`
  - Updated virtual meeting link to Zoom: https://us06web.zoom.us/j/87616196733?pwd=fRonx1va43mHYpj7fy9mdrjHG6awxp.1
  - Added detailed schedule for tonight's event

- Added blog post: "Austin LangChain Office Hours: Sonnet 3.7 Impresses, AI Simulations Develop Social Media Addiction, and Custom Inference Engines Unlock New Possibilities" (2025-02-26)
  - Located at: `/main-docs/blog/2025-02-26-langchain-office-hours-sonnet-37/`
  - Covers Claude Sonnet 3.7, Pixel Valley AI simulation, and custom inference engines
  - Source: Office Hours meeting (2025-02-25)

## Main Technologies

- Docusaurus (React-based documentation framework)
- Markdown for content
- Python scripts for automation (event management, etc.)

## Development Guidelines

- Blog posts should include a truncation marker (`<!-- truncate -->`) after the introduction
- All content should be organized according to the conventions in `.context.md`
- For new blog posts, create a `.context.md` file to document purpose and related content
- Check tags against the defined tags in `/main-docs/blog/tags.yml`

## Related Resources

For more detailed project conventions and guidelines, see the root `.context.md` file.
