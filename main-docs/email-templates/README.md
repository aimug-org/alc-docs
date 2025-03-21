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
