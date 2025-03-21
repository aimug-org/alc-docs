# Email Templates for Austin LangChain AIMUG

This directory contains email templates for various communications with the Austin LangChain AIMUG community. These templates are designed to be used with Buttondown or other email service providers that support markdown formatting.

## Templates

### Welcome Email
- **File:** [welcome-email.md](./welcome-email.md)
- **Purpose:** Sent to new subscribers after they confirm their subscription
- **Key Features:** 
  - Introduction to Austin LangChain AIMUG
  - Overview of what to expect from the newsletter
  - Links to community resources
  - Call to action for getting involved

### Drip Campaign Emails

The following sequence of emails is designed to be sent over a 2-week period to new subscribers:

#### 1. Welcome & Introduction
- **Files:** 
  - HTML/MD Hybrid: [drip-email-1-welcome.md](./drip-email-1-welcome.md)
  - Pure Markdown: [drip-email-1-welcome-md.md](./drip-email-1-welcome-md.md)
- **When to Send:** Immediately after subscription confirmation
- **Purpose:** Welcome new subscribers and provide an introduction to the community
- **Key Features:**
  - Warm welcome to the community
  - Overview of community values and mission
  - Preview of upcoming emails in the sequence
  - Quick-start links to engage immediately

#### 2. Learning Resources
- **Files:** 
  - HTML/MD Hybrid: [drip-email-2-resources.md](./drip-email-2-resources.md)
  - Pure Markdown: [drip-email-2-resources-md.md](./drip-email-2-resources-md.md)
- **When to Send:** 3 days after Email 1
- **Purpose:** Provide educational resources for different skill levels
- **Key Features:**
  - Learning paths for beginners, intermediate, and advanced users
  - Monthly labs timeline and progression
  - Featured recent tutorial
  - Weekly learning opportunities

#### 3. Community Engagement
- **Files:** 
  - HTML/MD Hybrid: [drip-email-3-community.md](./drip-email-3-community.md)
  - Pure Markdown: [drip-email-3-community-md.md](./drip-email-3-community-md.md)
- **When to Send:** 5 days after Email 2
- **Purpose:** Highlight ways to engage with the community
- **Key Features:**
  - In-person events information
  - Virtual engagement opportunities
  - Online communities (Discord, YouTube)
  - Ways to contribute to the community

#### 4. Recent Showcase & Invitation
- **Files:** 
  - HTML/MD Hybrid: [drip-email-4-showcase.md](./drip-email-4-showcase.md)
  - Pure Markdown: [drip-email-4-showcase-md.md](./drip-email-4-showcase-md.md)
- **When to Send:** 7 days after Email 3
- **Purpose:** Highlight a recent innovation and invite to upcoming events
- **Key Features:**
  - Featured showcase of a community member's project
  - Invitation to the next monthly meetup
  - Opportunity to present at future events
  - Conclusion of the welcome sequence

### Weekly RSS Digest Emails

The following templates are designed for weekly newsletters that automatically pull content from your RSS feed:

#### Comprehensive Weekly Digest
- **File:** [weekly-rss-digest-md.md](./weekly-rss-digest-md.md)
- **When to Send:** Every Sunday
- **Purpose:** Provide a comprehensive weekly roundup of community content and AI news
- **Key Features:**
  - Featured article highlight
  - Content categorized by type (Technical, Learning, Projects)
  - Community spotlight section
  - "From the Archives" section for older relevant content
  - AI industry news roundup
  - Interactive elements (challenges, polls)
  - Personalized content recommendations based on subscriber tags
  - Upcoming events and quick links

#### Simple Weekly Digest
- **File:** [weekly-rss-digest-simple-md.md](./weekly-rss-digest-simple-md.md)
- **When to Send:** Alternative to comprehensive digest when a simpler format is desired
- **Purpose:** Provide a streamlined weekly content update
- **Key Features:**
  - Top story highlight
  - List of recent content
  - Upcoming events
  - Quick links to community resources

## Format Versions

Each drip email template is available in two formats:

### HTML/Markdown Hybrid
Files without the `-md` suffix use a hybrid of Markdown and HTML formatting for better email client compatibility, particularly for:
- Centering images
- Creating styled containers and cards
- Formatting buttons with background colors
- Creating advanced layouts like side-by-side columns

### Pure Markdown
Files with the `-md` suffix use only standard Markdown formatting without HTML elements. These are useful for:
- Email clients that strip HTML formatting
- Platforms that only accept plain Markdown
- Better accessibility for screen readers
- Easier editing without dealing with HTML syntax

## Using These Templates

1. Copy the content of the desired template
2. Paste into your email service provider's editor
3. Update any placeholder content (text between `{{ }}`)
4. Update image URLs to point to your hosted images
5. Test the email by sending a preview to yourself before sending to subscribers

## Buttondown-Specific Information

These templates use Buttondown's templating syntax for personalization:

- `{{ subscriber.first_name | default: "there" }}` - Displays the subscriber's first name if available, or "there" if not
- `{{ unsubscribe_url }}` - Automatically inserts the unsubscribe link

Check [Buttondown's documentation](https://buttondown.email/features/templating) for more details on available variables and functions.

## Template Maintenance

When updating templates:

1. Keep consistent formatting and tone across all emails
2. Ensure all links are fully qualified URLs (starting with https://)
3. Test all links and images before sending
4. Keep a copy of updated templates in this directory for future reference

## Image Hosting

If you need to update images used in these emails:

1. Place images in your website's static directory
2. Use fully qualified URLs (e.g., `https://aimug.org/static/img/logo.png`)
3. Ensure images are optimized for email (usually under 1MB)
