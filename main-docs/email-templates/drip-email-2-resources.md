# Drip Email 2: Learning Resources

## Subject: AI Learning Resources: Start Your LangChain Journey Today

<!-- Logo using HTML instead of Markdown for better email client compatibility -->
<div style="text-align: center; padding: 20px 0;">
  <img src="https://aimug.org/static/email-assets/logo/austin-langchain-email.png" 
       alt="Austin LangChain AIMUG Logo" 
       width="192" 
       style="display: inline-block;">
</div>

# Learning Resources for Your AI Journey, {{ subscriber.first_name | default: "there" }}!

We're excited that you've joined our Austin LangChain community! As promised, this email contains valuable resources to help you start or advance your AI development journey, regardless of your current skill level.

---

## Learning Paths

Whether you're just getting started or looking to enhance your skills, we have resources for every level:

### 🌱 Beginners
If you're new to LangChain and AI middleware, start here:

- [Austin LangChain Introduction](https://aimug.org/docs/Austin-LangChain-AIMUG-Introduction) - Learn the basics of our community and LangChain
- [Getting Started Guide](https://aimug.org/docs/getting-started) - Setup your environment and build your first LangChain application
- [RAG Quickstart](https://aimug.org/docs/nov-2023/rag-quickstart) - Create your first Retrieval-Augmented Generation system

### 🚀 Intermediate
Ready to build more advanced applications:

- [LangGraph RAG](https://aimug.org/docs/feb-2024/langgraph-rag) - Create sophisticated retrieval systems with LangGraph
- [Full-Stack AI App](https://aimug.org/docs/jan-2025/full-stack-ai-app) - Build a complete web application with AI capabilities
- [Streamlit + Ollama](https://aimug.org/docs/mar-2024/streamlit-ollama) - Create interactive AI interfaces with local models

### 🔬 Advanced
For those looking to push the boundaries:

- [Open Web UI + LangGraph](https://aimug.org/docs/nov-2024/openwebui-langgraph) - Create advanced UI workflows for language models
- [Edge Computing + Gradio](https://aimug.org/docs/dec-2024/gradio-edge-computing-lab) - Deploy AI applications at the edge
- [AI Data Scientist](https://aimug.org/docs/may-2024/ai-data-scientist) - Build automated data analysis pipelines

---

## Monthly Labs Timeline

<div style="padding: 15px; background-color: #f7f7f7; border-radius: 10px; margin: 20px 0;">
  <p style="font-weight: bold;">📚 Learning Journey Progression</p>
  <p>Our community has been documenting monthly labs since October 2023, creating a chronological learning path you can follow:</p>
  <a href="https://aimug.org/labs_by_month" style="color: #1E88E5; text-decoration: underline;">View Complete Timeline</a>
</div>

This timeline is perfect for systematic learning - start with the fundamentals and progress through increasingly advanced topics at your own pace.

---

## Featured Tutorial: Recent Highlight

<div style="border-left: 4px solid #1E88E5; padding-left: 15px; margin: 20px 0;">
  <h3 style="margin-top: 0;">AI Cancer Detection: Multi-Algorithm ML Approach</h3>
  <p>Learn about Venika Kakarla's groundbreaking approach using deep neural networks, XGBoost, and graph convolutional networks to analyze cancer mutations:</p>
  <ul>
    <li>Deep Neural Network for stability classification</li>
    <li>XGBoost Regression for numerical stability values</li>
    <li>Graph Convolutional Network for DNA binding prediction</li>
  </ul>
  <a href="https://aimug.org/docs/mar-2025/ai-cancer-detection" style="color: #1E88E5; text-decoration: underline;">Explore the Tutorial</a>
</div>

---

## Weekly Learning Opportunities

Don't learn alone! Join these regular sessions to enhance your skills:

- **Tuesday Office Hours (2 PM Central)** - Get your questions answered and troubleshoot your projects
- **Thursday Community Call (2 PM Central)** - Learn what others are building and share your progress

Both sessions are hosted on our Discord server. They're casual, supportive environments perfect for learning.

---

## Helpful Tools & Resources

To support your learning journey:

### Local Development
- [Open Web UI Local](https://aimug.org/docs/jan-2025/open-web-ui-local) - Run models locally without cloud costs
- [LangServe on Docker](https://aimug.org/docs/dec-2023/langserve-on-docker) - Containerize your LangChain applications

### Project Templates
- [Email RAG Showcase](https://aimug.org/docs/oct-2024/email-rag-showcase) - Build an email search and analysis system
- [Perplexity Clone](https://aimug.org/docs/sep-2024/perplexity-clone) - Create your own AI search engine

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

In our next email, we'll share more about community engagement opportunities and how to connect with fellow AI enthusiasts!

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
