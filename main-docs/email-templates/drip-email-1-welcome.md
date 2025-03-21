# Drip Email 1: Welcome & Introduction

## Subject: Welcome to Austin LangChain AIMUG: Your AI Learning Journey Begins!

<!-- Logo using HTML instead of Markdown for better email client compatibility -->
<div style="text-align: center; padding: 20px 0;">
  <img src="https://aimug.org/static/email-assets/logo/austin-langchain-email.png" 
       alt="Austin LangChain AIMUG Logo" 
       width="192" 
       style="display: inline-block;">
</div>

# Welcome to Our Community, {{ subscriber.first_name | default: "there" }}!

**Your subscription to the Austin LangChain AIMUG newsletter has been confirmed!**

Thank you for joining our community of AI enthusiasts, developers, and innovators who are "Learning in the Open" together. We're excited to have you with us on this journey of exploration and discovery.

---

## Who We Are

Austin LangChain is a community dedicated to exploring artificial intelligence through the lens of LangChain and related middleware technologies. Since October 2023, we've been documenting our collective learning journey through monthly meetings, hands-on labs, and community showcases.

We believe that AI development should be:
- **Collaborative:** Learning from each other's experiences
- **Transparent:** Sharing both successes and challenges
- **Accessible:** Making AI development approachable for everyone
- **Practical:** Building real-world applications together

---

## What to Expect

Over the next two weeks, you'll receive a series of emails to help you get the most out of our community:

1. **Learning Resources** - Discover our documentation, tutorials, and learning paths
2. **Community Engagement** - Learn about our events, Discord channels, and ways to connect
3. **Recent Innovations** - See the exciting projects our community members are creating

We'll email you 1-2 times per month with valuable content, event announcements, and community highlights.

---

## Quick Start: Join Us Today

Ready to jump in? Here are three simple ways to get started:

<div style="padding: 15px; background-color: #f7f7f7; border-radius: 10px; margin: 20px 0;">
  <p style="font-weight: bold; margin-bottom: 10px;">⭐ Join our next monthly meetup</p>
  <a href="https://www.meetup.com/austin-langchain-ai-group/events/" style="color: #1E88E5; text-decoration: underline;">RSVP on Meetup</a>
  <p style="margin-top: 15px; font-weight: bold; margin-bottom: 10px;">⭐ Connect on Discord</p>
  <a href="https://discord.gg/JzWgadPFQd" style="color: #1E88E5; text-decoration: underline;">Join our Discord server</a>
  <p style="margin-top: 15px; font-weight: bold; margin-bottom: 10px;">⭐ Check out our documentation</p>
  <a href="https://aimug.org/docs/Austin-LangChain-AIMUG-Introduction" style="color: #1E88E5; text-decoration: underline;">Start learning</a>
</div>

---

## Connect With Us

<!-- Social media icons using HTML for better email client compatibility -->
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

---

We can't wait to see you at our next event!

Happy learning,

**Colin McNamara**  
Austin LangChain AIMUG

---

*You're receiving this email because you subscribed to the Austin LangChain AIMUG newsletter. If you no longer wish to receive these emails, you can [unsubscribe]({{ unsubscribe_url }}) at any time.*

*Austin LangChain AIMUG  
Austin, TX*

---

## Notes for Implementation

- Replace `{{ subscriber.first_name | default: "there" }}` with Buttondown's syntax for subscriber name (with fallback)
- Replace `{{ unsubscribe_url }}` with Buttondown's unsubscribe URL variable
- Update image paths to point to your actual hosted images
- Test the email by sending yourself a preview before deploying to all subscribers
