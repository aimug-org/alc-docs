# Weekly RSS Digest Email (Simple Version)

## Subject: Austin LangChain Weekly: {{ item.title }} | {{ month }} {{ email.publish_date | date:"d, Y" }}

![Austin LangChain AIMUG Logo](https://aimug.org/static/email-assets/logo/austin-langchain-email.png)

# Weekly AI Digest: {{ month }} {{ email.publish_date | date:"d, Y" }}

Hello {{ subscriber.metadata.first_name | default: "AI Enthusiast" }}!

Here's your weekly roundup of the latest content from the Austin LangChain community:

---

## 🔍 Top Story

### [{{ item.title }}]({{ item.url }})
*{{ item.publish_date }} by {{ item.author | default: "Austin LangChain Community" }}*

{{ item.description }}

[Read the full article →]({{ item.url }})

---

## 📚 This Week's Content

{% for item in items limit:5 offset:1 %}
### [{{ item.title }}]({{ item.url }})
*{{ item.publish_date | date:"M d" }} by {{ item.author | default: "Austin LangChain Community" }}*

{{ item.description | truncatewords: 20 }}

[Read more →]({{ item.url }})

{% endfor %}

---

## 📅 Upcoming Events

- **Monthly Meetup**: First Wednesday of {{ month }} at 6:00 PM
- **Community Call**: Every Thursday at 2:00 PM
- **Office Hours**: Every Tuesday at 2:00 PM

[View All Events](https://www.meetup.com/austin-langchain-ai-group/events/)

---

## 🔗 Quick Links

- [Join our Discord](https://discord.gg/JzWgadPFQd)
- [Explore our Documentation](https://aimug.org/docs/)
- [Follow us on Twitter](https://twitter.com/AustinLangChain)

---

*You're receiving this email because {{ subscriber.email }} subscribed to the Austin LangChain AIMUG newsletter. If you no longer wish to receive these emails, you can [unsubscribe]({{ unsubscribe_url }}) at any time.*

*Austin LangChain AIMUG  
Austin, TX*

{% if medium == 'web' %}
{{ subscribe_form }}
{% endif %}

---

## Notes for Implementation

- This is a simplified version of the weekly RSS digest template
- It focuses on just the most essential elements: top story, recent content, and upcoming events
- Use this template for special editions or when you want a more concise email
- The template uses the same Buttondown RSS feed variables as the comprehensive version
