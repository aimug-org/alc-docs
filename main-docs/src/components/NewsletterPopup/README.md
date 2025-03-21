# Newsletter Popup Component

This component displays a newsletter subscription popup on blog post pages when users scroll to 50% of the content. It's designed to encourage mailing list signups while avoiding annoying existing subscribers.

## Features

- Appears only on blog post pages (not on documentation, homepage, etc.)
- Shows when users scroll to 50% of the article content
- Doesn't show to users who have already subscribed (using localStorage)
- Doesn't show to users who have dismissed the popup for 7 days
- Responsive design that works on all device sizes
- Accessible with keyboard navigation and screen reader support
- Integrates with the existing subscription flow

## Implementation Details

### Files

- `index.js` - Main component implementation
- `styles.module.css` - Component styling
- `utils.js` - Helper functions for localStorage and scroll detection

### How It Works

1. The component is added to the site layout via a swizzled Layout component
2. On blog post pages, it sets up a scroll listener to detect when users reach 50% of the page
3. When triggered, it displays a popup with a subscription form
4. Users can subscribe (redirecting to the subscription flow) or dismiss the popup
5. The component uses localStorage to remember user preferences:
   - `alcNewsletterSubscribed` - Set to 'true' when a user confirms subscription
   - `alcNewsletterDismissed` - Set with a timestamp when a user dismisses the popup
   - `alcNewsletterLastShown` - Set with a timestamp when the popup is shown

### Integration Points

- The popup form submits to the existing `/subscribe-success` page
- The `/subscribe-confirmed.js` page sets the localStorage flag when a user confirms their subscription
- The swizzled `Layout` component in `src/theme/Layout/index.js` adds the popup to all pages

## Customization

To modify the popup behavior:

- Change the scroll threshold in `index.js` (default: 50%)
- Adjust the dismissal period in `utils.js` (default: 7 days)
- Modify the popup styling in `styles.module.css`
- Update the popup content and messaging in `index.js`

## Future Enhancements

Potential improvements for the future:

- A/B testing different messages
- Tracking conversion rates
- Adding animation options
- Supporting different trigger methods (time-based, exit intent)
