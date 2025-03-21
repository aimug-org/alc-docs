# Weekly RSS Digest Email

## Subject: Austin LangChain Weekly: {{ item.title }} + More AI Updates | {{ month }} Week {{email.secondary_id}}

![Austin LangChain AIMUG Logo](https://aimug.org/static/email-assets/logo/austin-langchain-email.png)

{% if medium == 'web' %}
*This is the web version of our email newsletter. [Subscribe here]({{ subscribe_url }}) to get these delivered to your inbox.*
{% endif %}

# This Week in AI: {{ month }} {{ email.publish_date | date:"d, Y" }}

Hello {{ subscriber.metadata.first_name | default: "AI Enthusiast" }}!

Welcome to your weekly digest of the latest Austin LangChain community content and AI developments. Here's what's new this week:

---

## 🔍 Featured Article

### [{{ item.title }}]({{ item.url }})
*Published on {{ item.publish_date }} by {{ item.author | default: "Austin LangChain Community" }}*

{{ item.description }}

{% if medium == 'email' %}
[Read the full article →]({{ item.url }})
{% endif %}

---

## 🔬 Technical Deep Dives
{% for item in items %}
{% if item.categories contains "technical" or item.tags contains "tutorial" %}
- [{{ item.title }}]({{ item.url }}) - {{ item.publish_date | date:"M d" }}
{% endif %}
{% endfor %}

## 🎓 Learning Resources
{% for item in items %}
{% if item.categories contains "learning" or item.tags contains "beginners" %}
- [{{ item.title }}]({{ item.url }}) - {{ item.publish_date | date:"M d" }}
{% endif %}
{% endfor %}

## 🚀 Project Showcases
{% for item in items %}
{% if item.categories contains "showcase" or item.tags contains "project" %}
- [{{ item.title }}]({{ item.url }}) - {{ item.publish_date | date:"M d" }}
{% endif %}
{% endfor %}

---

## 👥 Community Spotlight

This week we're highlighting **{% if item.author %}{{ item.author }}{% else %}Community Member{% endif %}** and their contributions to our AI community.

> "{% if item.content contains 'quote' %}{{ item.content | extract_quote }}{% else %}I'm excited to be part of a community that's pushing the boundaries of AI technology while making it accessible to everyone.{% endif %}"

[See their latest project →]({{ item.url }})

---

## 📚 From the Archives

Still relevant and worth revisiting:

{% assign archive_date = email.publish_date | date: "%s" | minus: 7776000 %}
{% for item in all_items %}
{% assign item_date = item.publish_date | date: "%s" %}
{% if item_date < archive_date and item_date > archive_date | minus: 604800 %}
- [{{ item.title }}]({{ item.url }}) - *Originally shared on {{ item.publish_date | date:"M d, Y" }}*
{% endif %}
{% endfor %}

---

## 🌐 AI Industry News

Stay informed about the wider AI landscape:

- [Latest LangChain Release Notes](https://github.com/langchain-ai/langchain/releases) - What's new in the framework
- [Recent AI Research Papers](https://arxiv.org/list/cs.AI/recent) - Cutting-edge publications
- [AI Ethics Updates](https://aiethics.example.com) - Responsible AI developments

---

## 🎯 This Week's AI Challenge

**{{ weekly_challenge.title | default: "Build a Simple RAG System" }}**

{{ weekly_challenge.description | default: "Create a retrieval-augmented generation system using any framework of your choice. Bonus points for creative data sources!" }}

[Submit your solution](https://aimug.org/challenge) by Sunday to be featured in next week's newsletter!

---

## 📊 Quick Poll

{% if medium == 'web' %}
What AI topic would you like to see covered in our next meetup?
- [LLM Fine-tuning](https://aimug.org/poll/llm)
- [RAG Implementation](https://aimug.org/poll/rag)
- [Agent Systems](https://aimug.org/poll/agents)
- [AI Ethics](https://aimug.org/poll/ethics)
{% else %}
[Click here to vote]({{ email_url }}) on what AI topic we should cover in our next meetup!
{% endif %}

---

## 📌 Just For You

{% if subscriber.tags contains "python" %}
Based on your interest in Python:
- [Building LangChain Apps with Python](https://aimug.org/python-tutorial)
- [Python AI Libraries Compared](https://aimug.org/python-libraries)
{% elsif subscriber.tags contains "javascript" %}
Based on your interest in JavaScript:
- [JavaScript LLM Integration](https://aimug.org/js-llm)
- [Building React Interfaces for AI](https://aimug.org/react-ai)
{% else %}
You might be interested in:
- [Getting Started with AI Development](https://aimug.org/getting-started)
- [Choose Your First AI Project](https://aimug.org/first-project)
{% endif %}

---

## 📅 Upcoming Events

- **Community Call**: Thursday at 2 PM Central
- **Office Hours**: Tuesday at 2 PM Central
- **Monthly Meetup**: First Wednesday of {{ month }}

[View All Events](https://www.meetup.com/austin-langchain-ai-group/events/)

---

## 🔗 Quick Links

- [Join our Discord](https://discord.gg/JzWgadPFQd)
- [Explore our Documentation](https://aimug.org/docs/)
- [Follow us on Twitter](https://twitter.com/AustinLangChain)
- [Watch on YouTube](https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig)

---

{% if subscriber.can_be_upsold %}
### 🌟 Support Our Community
Enjoy our content? Consider becoming a supporting member to get access to exclusive resources and help fund our community events.

[Upgrade Membership]({{ upgrade_url }})
{% endif %}

---

*You're receiving this email because {{ subscriber.email }} subscribed to the Austin LangChain AIMUG newsletter. If you no longer wish to receive these emails, you can [unsubscribe]({{ unsubscribe_url }}) at any time.*

*Austin LangChain AIMUG  
Austin, TX*

{% if medium == 'web' %}
## Found this digest useful?
Share it with friends and colleagues who might enjoy it.
{{ subscribe_form }}
{% endif %}

{% if medium == 'email' %}
*Having trouble viewing this email? [View it in your browser]({{ email_url }})*
{% endif %}

---

## Notes for Implementation

- This template uses Buttondown's RSS feed variables to create a comprehensive weekly digest
- The template is designed to be sent every Sunday, pulling in the latest content from your RSS feed
- Replace placeholder URLs with actual URLs for your community
- Test the email by sending yourself a preview before deploying to all subscribers
- The template includes conditional content based on viewing medium (email vs. web) and subscriber metadata
- Some sections use Liquid template syntax that may need adjustment based on your specific RSS feed structure
