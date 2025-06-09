# AIMUG Stripe Quick Donate Products Setup

## Product Configuration for Stripe Dashboard

### **$10 - "AI Token Booster"**
- **Product Name:** AI Token Booster
- **Price:** $10.00 USD (one-time)
- **Description:** Power AIMUG's AI-driven website updates and keep our digital presence cutting-edge. Your contribution fuels the AI tokens that help us create content, update documentation, and maintain our community resources. Every token counts!
- **Statement Descriptor:** AIMUG AI Tokens
- **Category:** Donation

### **$25 - "Pizza & Community Fund"**
- **Product Name:** Pizza & Community Fund
- **Price:** $25.00 USD (one-time)
- **Description:** Feed 5 hungry developers at our next meetup! Your support provides the fuel that powers our in-person gatherings, keeping our community connected over shared meals and meaningful conversations about AI middleware.
- **Statement Descriptor:** AIMUG Pizza Fund
- **Category:** Donation

### **$50 - "Stream Team Supporter"**
- **Product Name:** Stream Team Supporter
- **Price:** $50.00 USD (one-time)
- **Description:** Enable professional streaming of our events to YouTube, Twitch, and Austin Public Access TV. Your contribution ensures our workshops and showcases reach the broader Austin tech community and beyond.
- **Statement Descriptor:** AIMUG Streaming
- **Category:** Donation

### **$100 - "Workshop Enabler"**
- **Product Name:** Workshop Enabler
- **Price:** $100.00 USD (one-time)
- **Description:** Unlock a full workshop's worth of API credits for hands-on learning. Your support provides the computational resources needed for our community to experiment with cutting-edge AI tools and frameworks during our educational sessions.
- **Statement Descriptor:** AIMUG Workshop
- **Category:** Donation

### **$200 - "Speaker & Venue Sponsor"**
- **Product Name:** Speaker & Venue Sponsor
- **Price:** $200.00 USD (one-time)
- **Description:** Bring expert speakers to Austin or secure professional venues for special events. Your generous support covers travel expenses for out-of-town AI experts or helps us host larger community gatherings.
- **Statement Descriptor:** AIMUG Speaker Fund
- **Category:** Donation

### **Custom Amount - "Choose Your Impact"**
- **Product Name:** Choose Your Impact
- **Price:** Custom amount (minimum $1.00)
- **Description:** Every dollar directly supports AIMUG's mission to advance AI middleware skills in Austin. Choose any amount and know that 100% goes toward real community needs - from name badges to neural networks!
- **Statement Descriptor:** AIMUG Custom
- **Category:** Donation

## Stripe Setup Instructions

### 1. Create Products in Stripe Dashboard
1. Go to Products → Add Product
2. Enter the product name and description from above
3. Set pricing as one-time payment
4. Add statement descriptor for bank statements
5. Set category as "Donation" for tax purposes

### 2. Payment Link Configuration
- **Success URL:** Redirect to `/support?success=true`
- **Cancel URL:** Redirect to `/support?canceled=true`
- **Collect customer information:** Email address (for receipts)
- **Allow promotion codes:** Yes
- **Tax collection:** Automatic (if applicable)

### 3. Receipt Email Template
**Subject:** Thank you for supporting AIMUG! 🚀

**Body:**
```
Hi {CUSTOMER_NAME},

Thank you for your generous ${AMOUNT} donation to Austin LangChain AIMUG!

Your contribution will directly support:
[Product-specific impact based on tier]

You're helping us build Austin's premier AI middleware community. Every dollar makes a real difference in our ability to provide high-quality events, cutting-edge content, and valuable networking opportunities.

What's Next?
- Join our Discord: https://discord.gg/JzWgadPFQd
- Attend our weekly office hours: Tuesdays @ 5 PM CT
- Follow us for updates: [social media links]

With gratitude,
The AIMUG Team

P.S. This receipt serves as your donation record for tax purposes.
```

### 4. Website Integration
Replace placeholder links in `/src/pages/support.md` with actual Stripe payment links:

```markdown
| [**$10**](https://buy.stripe.com/9B628raLHagxgzV3dZ57W01) | AI tokens for website updates | ... |
| [**$25**](https://buy.stripe.com/cNi3cvf1XewNbfB29V57W02) | Pizza for 5 attendees | ... |
| [**$50**](https://buy.stripe.com/28EfZh0734Wd0AX4i357W03) | One month of streaming services | ... |
| [**$100**](https://buy.stripe.com/7sY00jf1XbkBabxeWH57W04) | API credits for a full workshop | ... |
| [**$200**](https://buy.stripe.com/9B6bJ1g61fARcjF9Cn57W05) | Guest speaker travel support | ... |
| [**Custom Amount**](https://donate.stripe.com/dRmeVd3jfdsJ1F1cOz57W06) | Your choice! | ... |
```
## Analytics & Tracking
🎯 Monthly Community Membership
Join our sustaining members and help us plan for the future!

Tier	Monthly	Benefits
☕ Coffee Supporter	$5	Keep our office hours caffeinated! + Newsletter recognition
https://buy.stripe.com/4gMbJ12fbdsJcjF9Cn57W07

🍕 Community Sustainer	$15	Help provide pizza at events + Newsletter recognition + Early event access
https://donate.stripe.com/bJe5kD7zv4WderN5m757W08

🎪 Event Champion	$25	Support streaming & educational tools + All above + Special Discord role
https://donate.stripe.com/3cI8wP1b73S983p4i357W09

💻 Tech Advocate	$50	Enable API access for workshops + All above + Quarterly supporter office hours
https://donate.stripe.com/4gM14naLH74lgzV29V57W0b

🌟 Community Leader	$100	Make special events possible + All above + Event planning input + Annual appreciation event
https://donate.stripe.com/cNi14ncTPdsJ3N98yj57W0c


## Analytics & Tracking

### Recommended Stripe Metadata
Add these metadata fields to track donation patterns:
- `source`: "website_quick_donate"
- `tier`: "10", "25", "50", "100", "200", or "custom"
- `campaign`: "impact_menu_2025"

### Google Analytics Events
Track these events when users click donation links:
- Event: `donation_click`
- Parameters: `tier`, `amount`, `source`

## Tax Considerations
- Ensure your organization's tax-exempt status is properly configured
- Consider adding tax collection if required in your jurisdiction
- Provide proper donation receipts for tax deduction purposes

## Testing Checklist
- [ ] Test each payment link
- [ ] Verify receipt emails are sent
- [ ] Check success/cancel page redirects
- [ ] Confirm metadata is captured
- [ ] Test custom amount functionality
- [ ] Verify statement descriptors appear correctly

---

*This document contains the complete setup information for AIMUG's Stripe quick donate products. Keep this file updated as you modify products or pricing.*
