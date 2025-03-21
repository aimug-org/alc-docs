# Email Logo Assets

This directory contains the Austin LangChain AIMUG logo optimized specifically for email use.

## Files

- **austin-langchain-email.png** - 192px wide logo optimized for email clients
  - Size: 192×192 pixels
  - Format: PNG with transparency
  - Purpose: Primary logo for email headers and signatures

## Usage Guidelines

When using the logo in email communications:

1. Always use HTML image syntax rather than Markdown:
   ```html
   <img src="https://aimug.org/static/email-assets/logo/austin-langchain-email.png" 
        alt="Austin LangChain AIMUG Logo" 
        width="192" 
        style="display: block; margin: 0 auto;">
   ```

2. For header usage, center the logo and provide adequate white space around it:
   ```html
   <div style="text-align: center; padding: 20px 0;">
     <img src="https://aimug.org/static/email-assets/logo/austin-langchain-email.png" 
          alt="Austin LangChain AIMUG Logo" 
          width="192" 
          style="display: inline-block;">
   </div>
   ```

3. For signature or footer usage, consider using a smaller display width:
   ```html
   <img src="https://aimug.org/static/email-assets/logo/austin-langchain-email.png" 
        alt="Austin LangChain AIMUG Logo" 
        width="100" 
        style="display: inline-block; vertical-align: middle;">
   ```

4. The logo has been optimized to display well on both light and dark backgrounds

## Optimization Details

This version of the logo has been specifically optimized for email use:

- File size has been reduced to improve loading times in email clients
- Dimensions are appropriate for most email layouts (recommended max display width: 200px)
- PNG format maintains transparency while ensuring compatibility
