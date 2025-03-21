# Email Assets

This directory contains optimized images and assets specifically for email communications from Austin LangChain AIMUG.

## Purpose

Email clients have specific limitations for images and rendering that differ from web browsers. This directory holds assets that are:

- Properly sized for email viewing
- Optimized for file size to ensure fast loading
- Formatted for maximum compatibility across email clients

## Directory Structure

- **logo/** - Contains the Austin LangChain logo optimized for email use
- **icons/** - Contains social media and other icons used in email footers and body content

## Usage Guidelines

When using these assets in email templates:

1. Use HTML image syntax rather than Markdown for better email client compatibility:
   ```html
   <img src="https://aimug.org/static/email-assets/logo/austin-langchain-email.png" alt="Austin LangChain AIMUG Logo" width="200" style="display: block; margin: 0 auto;">
   ```

2. Always specify width attributes to ensure consistent rendering

3. Use fully qualified URLs (with https://) rather than relative paths

4. Keep image file sizes under 100KB when possible to ensure fast loading

## Adding New Assets

When adding new assets to this directory:

1. Optimize images for file size using tools like TinyPNG, ImageOptim, or similar services
2. Keep image dimensions appropriate for email (typically 600px max width)
3. Use PNG format for images requiring transparency, JPG for photos
4. Document the purpose and usage of new assets in the appropriate README file
