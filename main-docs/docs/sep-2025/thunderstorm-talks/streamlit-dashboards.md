---
id: streamlit-dashboards
title: Streamlit for AI Dashboards
sidebar_label: Streamlit Dashboards
---

# Streamlit for AI Dashboards - Prototyping at the Speed of Thought

**Speaker:** Jeff Linwood  
**Duration:** 15 minutes  
**Time:** 7:30 PM - 7:45 PM

## Overview

Jeff Linwood presented Streamlit as the sweet spot between Jupyter notebooks and full React applications for building AI dashboards. Using a National Parks visitor data dashboard as an example, he demonstrated how to build interactive data visualizations with chat capabilities in just **126 lines of Python code**.

## 📺 Watch the Talk

<iframe width="100%" height="400" src="https://www.youtube.com/embed/qoLINgx8edQ" title="Streamlit for AI Dashboards - Jeff Linwood at AIMUG September 2025" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Who Uses Streamlit?

About half the room raised their hands as Streamlit users. This talk targeted beginners while welcoming input from experienced users.

## The Streamlit Sweet Spot

### The Problem Space
- **Jupyter Notebooks**: Interactive but limited UI
- **React Applications**: Powerful but time-consuming
- **Streamlit**: The middle ground - quick prototypes with rich interactivity

### Best Use Cases
- **Prototyping** and UX testing
- **Internal tools** for teams
- **Data exploration** interfaces
- **NOT recommended**: Production SaaS applications

## Live Demo: National Parks Dashboard

### Features Demonstrated
1. **Interactive Filters**: Year selection (2005-2023)
2. **Dynamic Charts**: Visitor counts visualization
3. **Data Tables**: Sortable park statistics
4. **Chat Interface**: Natural language queries about data
5. **Real-time Updates**: Reactive components

### Key Stats
- **437 National Park units** tracked
- **Blue Ridge Parkway**: Most visited (17 million)
- **Seasonal parks**: Lowest visitation

## The Magic: Chat with Your Data

### Implementation
```python
# Simple integration - no RAG needed!
1. Filter DataFrame based on UI selections
2. Convert to CSV format
3. Pass to LLM with query
4. Display response in chat interface
```

### Live Example
**Query**: "What was the most visited park?"  
**Response**: "Blue Ridge Parkway with 17 million visitors"

The system automatically used the filtered data (2005-2007) from the UI selections!

## Technical Implementation

### Core Technologies
- **Streamlit**: Web framework
- **Pandas**: Data wrangling
- **Altair**: Charting library
- **LangChain**: LLM integration
- **OpenAI**: GPT-3.5-mini for chat

### Data Processing Pipeline
1. **Raw CSV** from National Park Service
2. **Wide to Long format** conversion using `melt()`
3. **Data cleaning**: Drop empty columns, fill nulls
4. **Type conversion**: Ensure proper data types
5. **Final DataFrame**: Ready for visualization

## Code Simplicity

### Entire App: 126 Lines
- All in one `app.py` file
- Reactive without explicit state management
- Built-in components for common needs

### Key Features with Minimal Code
```python
# Sidebar filter - 1 line
year_filter = st.slider("Year", 2005, 2023)

# Chart - 3 lines
chart = alt.Chart(filtered_df).mark_bar()
st.altair_chart(chart)

# Chat interface - Built-in!
user_query = st.chat_input("Ask about the data")
```

## Multi-Page Applications

Jeff demonstrated:
- **Dashboard Overview**: KPIs and summary stats
- **Park Trends**: Time series analysis
- **Interactive switching**: Seamless navigation

## LangChain Integration

### Simple Implementation
```python
# Convert filtered DataFrame to context
context = filtered_df.to_csv()

# Build prompt
prompt = f"""
You are a helpful assistant analyzing park data.
Context: {context}
Query: {user_query}
"""

# Get response
response = llm.invoke(prompt)
```

### Important Considerations
- **Token limits**: Be mindful of context size
- **Pricing**: Monitor API costs
- **No streaming**: Simple completion calls
- **Prototype-appropriate**: Not production-optimized

## Deployment Options

### Streamlit Cloud (Demonstrated)
- **Free hosting** for public repos
- Deploy directly from GitHub
- Auto-sleep when inactive
- Perfect for demos and prototypes

### Web Deployment Process
1. Push code to GitHub
2. Connect to Streamlit Cloud
3. Automatic deployment
4. Share public URL

## Advanced Features Not Covered

### Potential Enhancements
- **RAG Integration**: For larger datasets
- **MCP (Model Context Protocol)**: API connections
- **Guardrails**: Input/output validation
- **Observability**: LangSmith integration
- **File Upload**: User CSV support

## Q&A and Community Feedback

### Colin's Comment
"We used Streamlit 2 years ago for our first labs. It didn't look as beautiful as this - really impressed with the improvements!"

### Backend Engineer Appeal
Jeff noted: "I haven't met a backend engineer that doesn't fall in love with Streamlit"

## Best Practices

### When to Use Streamlit
✅ Rapid prototyping  
✅ Internal tools  
✅ Data exploration  
✅ Teaching/demos  
✅ Proof of concepts  

### When NOT to Use Streamlit
❌ Production SaaS  
❌ High-traffic applications  
❌ Complex state management  
❌ Mobile-first apps  

## Resources

### Links Shared
- [📺 Watch Jeff's Streamlit for AI Dashboards Talk on YouTube](https://www.youtube.com/watch?v=qoLINgx8edQ)
- **GitHub Repository**: Jeff's GitHub (mentioned in talk)
- **Email**: jeff@jefflinwood.com
- **Personal Site**: JeffLinwood.com

### Documentation
- [Streamlit Docs](https://docs.streamlit.io)
- Streamlit Chat with LLM Tutorial (available in Streamlit docs)
- LangChain OpenAI integration documentation

### Tutorial Recommendations
1. Follow Streamlit's official tutorial
2. Modify for LangChain integration
3. Try with your own dataset
4. Deploy to Streamlit Cloud

## Key Takeaways

1. **126 lines of code** beats thousands in React
2. **Chat components built-in** - no custom UI needed
3. **Perfect for prototypes**, not for production SaaS
4. **Free deployment** via Streamlit Cloud
5. **LangChain integration** is trivial

## Code Highlights

### Entire LangChain Integration
```python
# Setup
llm = ChatOpenAI(temperature=0.1, model="gpt-3.5-mini")

# Chat handling
if user_query:
    context = filtered_df.to_csv()
    prompt = build_prompt(context, user_query)
    response = llm.invoke(prompt)
    st.write(response.content)
```

### That's it! No complex setup required.

## Ideas for Attendees

1. **Try your own dataset** - Replace National Parks data
2. **Different LLMs** - Swap OpenAI for Claude/Llama
3. **Add guardrails** - Prevent off-topic queries
4. **Include observability** - Add LangSmith tracing
5. **Upload functionality** - Let users bring their CSVs

## About the Speaker

Jeff Linwood is a data visualization expert who champions simplicity in AI application development. With extensive experience in both frontend and backend systems, he advocates for tools that let developers focus on functionality rather than infrastructure. Jeff's approach: "Build fast, iterate often, ship something useful."