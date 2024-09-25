---
sidebar_position: 4
---

# Pandas DataFrame Agent

In this section, we'll explore how to use LangChain's Pandas DataFrame Agent to perform Exploratory Data Analysis (EDA) using natural language queries. This powerful tool allows you to interact with your data using questions and commands, making data analysis more intuitive and accessible.

## Introduction

Exploratory Data Analysis (EDA) is a critical first step in data analysis for data science, academic research, and understanding your own data. The Pandas DataFrame Agent in LangChain allows you to leverage Large Language Models (LLMs) to perform EDA by asking questions about your data and generating visualizations with simple commands.

We'll use OpenAI as the LLM and the LangChain framework to orchestrate the prompts and interact with a sample dataset.

## Prerequisites

Before you begin, make sure you have:

1. An OpenAI API key
2. Installed the required libraries: `langchain`, `langchain_experimental`, `langchain-openai`, `pandas`, `matplotlib`, and `seaborn`
3. A CSV file for analysis (we'll use a Starbucks drink menu dataset in this example)

## Setting Up the Environment

First, let's import the necessary libraries and set up our environment:

```python
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.agents.agent_types import AgentType
from langchain_openai import ChatOpenAI

# Set your OpenAI API key
os.environ['OPENAI_API_KEY'] = 'your-api-key-here'

# Load the dataset
df = pd.read_csv("path/to/your/starbucks_drinkMenu_expanded.csv")

# Create the Pandas DataFrame Agent
agent = create_pandas_dataframe_agent(
    ChatOpenAI(temperature=0, model="gpt-3.5-turbo-0613"),
    df,
    verbose=True,
    agent_executor_kwargs={"handle_parsing_errors": True},
    agent_type=AgentType.OPENAI_FUNCTIONS,
)
```

## Using the Pandas DataFrame Agent

Now that we have our agent set up, let's explore some ways to interact with our data:

### 1. Basic Data Exploration

You can ask simple questions about your data:

```python
# View the first 5 rows
agent.invoke("Show me the first 5 rows of the data frame")

# Get information about the dataset size
agent.invoke("How many rows and columns does my dataset contain?")

# Explore unique categories
agent.invoke("What are the categories of drinks in this dataframe?")
```

### 2. Data Visualization

The agent can generate various types of plots:

```python
# Create a heatmap of numeric data
agent.invoke('Show me a heatmap of all numeric data')

# Generate a bar chart
agent.invoke('Show a bar chart of the top ten most caloric drinks in descending order by average calories')

# Display a distribution plot
agent.invoke('Show me a distribution of the number of calories for each category')
```

### 3. Custom Queries

You can ask more specific questions about your data:

```python
# Example: Find the average calorie content for each drink category
agent.invoke("What is the average calorie content for each drink category?")

# Example: Identify the drink with the highest caffeine content
agent.invoke("Which drink has the highest caffeine content?")
```

## Best Practices

1. **Be Specific**: The more specific your questions, the better the agent can understand and provide accurate answers.
2. **Iterative Exploration**: Start with broad questions and then dive deeper based on the initial results.
3. **Verify Results**: Always cross-check the agent's outputs with traditional pandas operations to ensure accuracy.
4. **Experiment with Visualizations**: Try different types of charts and graphs to find the best way to represent your data.

## Conclusion

The Pandas DataFrame Agent in LangChain provides a powerful and intuitive way to perform Exploratory Data Analysis. By leveraging natural language processing, it makes data analysis more accessible to those who might not be experts in pandas or data visualization libraries.

In the next section, we'll explore more advanced LangChain concepts and how to apply them to real-world scenarios.