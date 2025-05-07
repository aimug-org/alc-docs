# ALC-Docs Project Context

This project contains documentation and blog posts for the Austin LangChain AI Middleware User Group.

## Project Structure

- `/main-docs` - Main Docusaurus site
  - `/blog` - Blog posts and announcements
  - `/docs` - Technical documentation organized by month/year
  - `/src` - React components and customizations
  - `/static` - Static assets like images
  - `/email-templates` - Email templates for mailing list communications

## Recent Updates

- Added blog post: "Tonight @ AIMUG: Lightning Talks, LangChain Voice-Agent Lab & Mixer" (2025-05-07)
  - Located at: `/main-docs/blog/2025-05-07-tonight-aimug-lightning-talks-langchain-voice-agent-lab/`
  - Announces the May 7th AIMUG event featuring community lightning talks and a hands-on lab
  - Provides detailed agenda, lab resources, and logistics information
  - Features lightning talks on AI automation for ERP tasks and Agent-to-Agent (A2A) interactions
  - Includes hands-on lab for building voice agents with FastRTC and Jupyter
  - Highlights both in-person and remote attendance options

- Added blog post: "AIMUG Office Hours Recap - Model Context Protocol (MCP) and Agent Architectures" (2025-04-30)
  - Located at: `/main-docs/blog/2025-04-30-aimug-office-hours-mcp-agent-architectures/`
  - Covers discussions on MCP implementations and agent-to-agent interactions
  - Highlights insights on deploying MCP beyond local implementations
  - Features alternative agent frameworks like Lindy
  - Discusses observability and governance in agent ecosystems
  - Includes featured image in the img directory
  - Updated newsletter link to newsletter.aimug.org/#subscribe-form

- Added blog post: "Austin LangChain Office Hours Recap: MCP Architecture, A2A Protocol, and Voice Applications" (2025-04-23)
  - Located at: `/main-docs/blog/2025-04-23-langchain-office-hours-recap/`
  - Covers the April 22nd office hours discussion on emerging AI middleware technologies
  - Includes a mermaid diagram visualizing key concepts
  - Highlights discussions on MCP architecture, A2A protocol, and voice applications
  - Features direct quotes from participants and action items
  - Source: April 22nd, 2025 Office Hours meeting

- Added blog post: "Integrating AI Workflows: Karim Lalani's Deep Dive into MCP, OpenWeb UI, LangChain, and LangGraph" (2025-03-28)
  - Located at: `/main-docs/blog/2025-03-05-integrating-ai-workflows-karim-lalani/`
  - Covers Karim Lalani's presentation on integrating various AI tools and technologies
  - Includes embedded YouTube video of the full presentation
  - Highlights MCP, OpenWeb UI pipelines, LangGraph, and LangChain integration
  - Published on March 31, 2025
  - Source: March 5, 2025 Meeting - "March Mixer - Off SXSW Edition"

- Added weekly RSS digest email templates (2025-03-21)
  - Created comprehensive and simple versions for weekly content roundups
  - Implemented Buttondown RSS feed variable integration
  - Added content categorization, community spotlight, and personalized sections
  - Designed for sending every Sunday with latest community content
  - Updated README.md and .context.md with detailed documentation

- Added blog newsletter popup for mailing list subscriptions (2025-03-21)
  - Created popup that appears when users scroll to 50% of blog posts
  - Implemented localStorage tracking to avoid showing to existing subscribers
  - Added combined messaging about learning, events, and innovation
  - Integrated with existing subscription confirmation workflow
  - Created with responsive design for all device sizes

- Added email drip campaign sequence (2025-03-21)
  - Created 4-email onboarding sequence for new subscribers
  - Designed to send over a 2-week period at strategic intervals
  - Structured to build engagement and community participation
  - Includes welcome, resources, community, and showcase emails
  - Added `.context.md` file with detailed template guidelines

- Added email-optimized assets for marketing communications (2025-03-20)
  - Created dedicated email-assets directory structure
  - Added optimized logo (192px) and social media icons (32px)
  - Provided comprehensive documentation for each asset type
  - Designed for maximum email client compatibility

- Added welcome email template for mailing list (2025-03-20)
  - Created welcome email template with Buttondown integration
  - Updated to use HTML formatting for better email client compatibility
  - Added documentation for template usage and maintenance
  - Created in new `/main-docs/email-templates/` directory

- Added confirmed subscription page (2025-03-20)
  - Created a dedicated page at /subscribe-confirmed
  - Shows post-verification success message and welcome
  - Highlights newsletter benefits and community resources
  - Features social media links and next steps guidance

- Added unsubscribe confirmation page (2025-03-20)
  - Created a dedicated page at /unsubscribe-success
  - Offers feedback collection option and easy resubscribe path
  - Provides alternative ways to stay connected
  - Matches design language of subscription pages

- Added unconfirmed subscription page (2025-03-20)
  - Repurposed page at /subscribe-success for pending subscriptions
  - Includes email verification instructions and steps
  - Provides quick access to other community platforms
  - Designed for redirect after initial Buttondown form submission

- Improved feature card usability on homepage (2025-03-20)
  - Added visual indicators for clickable cards
  - Enhanced hover effects with shadow and transformation
  - Added "Learn more →" text that appears on hover
  - Improved color contrast for better accessibility

- Added newsletter subscription forms to improve community engagement (2025-03-20)
  - Added to homepage with prominent styling
  - Made the mailing list the first option on the community page
  - Connected to Buttondown for email management
  - Updated main navigation to direct users to community page

- Added March 2025 documentation for AI Cancer Detection (2025-03-20)
  - Located at: `/main-docs/docs/mar-2025/`
  - Contains technical details on Venika Kakarla's multi-algorithm machine learning approach
  - Includes Mermaid diagrams visualizing the ML architecture
  - Links to related blog post and resources

- Added Mermaid diagram utilities for blog post visualizations (2025-03-20)
  - Located at: `/scripts/mermaid-utilities/`
  - Includes tools for generating PNG images from Mermaid diagrams
  - Provides a workflow for creating visual content for blog posts and documentation

- Added blog post: "High School Sophomore Creates Groundbreaking AI Solution for Detecting Fatal Liver Cancer" (2025-03-20)
  - Located at: `/main-docs/blog/2025-03-20-ai-cancer-detection-breakthrough/`
  - Covers Venika Kakarla's presentation on using AI/ML to detect hepatocellular carcinoma
  - Features interactive Mermaid diagrams to visualize the ML model architecture
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
