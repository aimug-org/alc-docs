# Welcome Email Template

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

## What is LangChain?

LangChain is more than just a framework - it's a bridge that connects various AI technologies, making them accessible and practical. Think of it as a Swiss Army knife for AI development, bringing together:

- Large Language Models (like GPT-4, Claude, and local models)
- Vector Databases
- Document Processing
- Memory Systems
- And much more!

Through these integrations, our community explores the entire AI ecosystem while building practical applications.

---

## What You'll Receive

As a subscriber, you'll get regular updates about:

### 📅 Upcoming Events
Monthly meetups, weekly office hours, and special community gatherings. We host in-person events in Austin and virtual sessions for our global community.

### 💡 Technical Content
Tutorials, code examples, and the latest innovations in AI middleware. We cover everything from basic RAG implementations to cutting-edge topics like LangGraph and edge computing.

### 👥 Community News
Project spotlights, member achievements, and collaboration opportunities. See what others are building and find ways to contribute.

We'll email you 1-2 times per month with valuable content, event announcements, and community highlights.

---

## Get Connected Today

[Join Discord](https://discord.gg/JzWgadPFQd) - Chat with members, get help, and share your projects

[View Events Calendar](https://aimug.org/events) - Check our upcoming meetups and RSVP

[Explore Documentation](https://aimug.org/docs/Austin-LangChain-AIMUG-Introduction) - Browse tutorials and learning resources

---

## Featured Content: Learning Journey

Our community has grown from simple chatbots and document search applications to advanced RAG systems, AI agents, and beyond. 

**Start Here:** Check out our [Labs Timeline](https://aimug.org/labs_by_month) to see our learning progression from beginner concepts to advanced implementations.

**This Month's Highlight:** High School Sophomore Venika Kakarla recently presented her groundbreaking AI solution for detecting hepatocellular carcinoma - a testament to how accessible AI has become and the amazing work happening in our community.

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

We can't wait to see you at our next event! If you have any questions, just reply to this email or reach out on Discord.

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
