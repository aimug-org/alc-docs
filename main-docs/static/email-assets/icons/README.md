# Email Icon Assets

This directory contains social media and UI icons optimized specifically for email use.

## Files

### Social Media Icons (32×32px)
- **twitter-icon.png** - Twitter/X icon for email footers
- **youtube-icon.png** - YouTube icon for email footers
- **github-icon.png** - GitHub icon for email footers

## Usage Guidelines

When using social media icons in email communications:

1. Keep all icons the same size for visual consistency
2. Use HTML image syntax:
   ```html
   <a href="https://twitter.com/AustinLangChain">
     <img src="https://aimug.org/static/email-assets/icons/twitter-icon.png" 
          alt="Twitter" 
          width="32" 
          style="display: inline-block; margin: 0 10px;">
   </a>
   ```

3. For a complete social media section in emails:
   ```html
   <div style="text-align: center; padding: 15px 0;">
     <a href="https://twitter.com/AustinLangChain">
       <img src="https://aimug.org/static/email-assets/icons/twitter-icon.png" 
            alt="Twitter" 
            width="32" 
            style="display: inline-block; margin: 0 10px;">
     </a>
     <a href="https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig">
       <img src="https://aimug.org/static/email-assets/icons/youtube-icon.png" 
            alt="YouTube" 
            width="32" 
            style="display: inline-block; margin: 0 10px;">
     </a>
     <a href="https://github.com/aimug-org">
       <img src="https://aimug.org/static/email-assets/icons/github-icon.png" 
            alt="GitHub" 
            width="32" 
            style="display: inline-block; margin: 0 10px;">
     </a>
   </div>
   ```

## Optimization Details

These icons have been specifically optimized for email use:

- Small file size (under 10KB each) to ensure fast loading
- Simple, recognizable designs that work at small sizes
- Consistent dimensions and styling across all icons
- PNG format with transparency for versatile placement

## Adding New Icons

When adding new icons to this collection:

1. Maintain the same dimensions (32×32px) for consistency
2. Optimize file size using compression tools
3. Use recognizable, simple designs that work well at small sizes
4. Test visibility on both light and dark backgrounds
5. Update this README to document any new additions
