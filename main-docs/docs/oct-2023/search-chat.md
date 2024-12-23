# Search-Enhanced Chat Interface

## Presenter
**Colin McNamara** is Engineer 🔧 | Entrepreneur 💼 | Sustainability Champion 🌱 | Supply Chain Strategist 🔗 | Private Label Pioneer 🏷️ | Build a Better Tomorrow 🌍
Currently at Always Cool Brands in Austin, TX.

> "Our focus is really low-stress learning and sharing. We're not trying to be experts. We're all learning. This is a fast-moving project. We are here to connect with other early adopters of AI middleware, and specifically, focused around the LangChain project."

Connect with Colin:
- GitHub: [@colinmcnamara](https://github.com/colinmcnamara)
- Twitter: [@colinmcnamara](https://twitter.com/colinmcnamara)
- Website: [https://colinmcnamara.com](https://colinmcnamara.com)

## Workshop Details

### What to Expect
During this session, you'll discover how to harness the power of ChatGPT models via API access and customize a web interface. Rest assured, your data going through this API will not be used for training.

### Requirements
- A working computer.
- A free Google Colab account (Google login) for Jupyter notebooks
- A working paid OpenAI API key - https://platform.openai.com/account/api-keys
- A can-do attitude and an eagerness to explore this exciting new form of software
- If you prefer to attend the lecture and soak in the concepts without participating in the lab, that's perfectly fine too!
- This event is part of our multi-part lecture and lab series designed to equip you with the skills to set up your own AI microservices centered around LangChain.

## Lab Overview
Learn how to build a chat interface with integrated search capabilities, combining conversation and document retrieval functionalities using LangChain. This lab demonstrates how to create an AI assistant that can search the internet in real-time to provide up-to-date information while maintaining conversation context.

## Lab Materials
- [View Lab Notebook](https://github.com/aimug-org/austin_langchain/blob/main/labs/LangChain_101/101-3-search-chat.ipynb)

## Key Components
- Agent System:
  ```python
  from langchain.agents import ConversationalChatAgent, AgentExecutor
  from langchain.callbacks import StreamlitCallbackHandler
  from langchain.chat_models import ChatOpenAI
  from langchain.memory import ConversationBufferMemory
  from langchain.memory.chat_message_histories import StreamlitChatMessageHistory
  from langchain.tools import DuckDuckGoSearchRun
  ```

- Memory Management:
  - StreamlitChatMessageHistory for UI integration
  - ConversationBufferMemory for context retention
  - Message history reset functionality

## Technical Implementation

### Agent Configuration
```python
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    openai_api_key=openai_api_key,
    streaming=True
)
tools = [DuckDuckGoSearchRun(name="Search")]
chat_agent = ConversationalChatAgent.from_llm_and_tools(
    llm=llm,
    tools=tools
)
```

### Executor Setup
```python
executor = AgentExecutor.from_agent_and_tools(
    agent=chat_agent,
    tools=tools,
    memory=memory,
    return_intermediate_steps=True,
    handle_parsing_errors=True
)
```

## Features
- Interactive chat interface
- Real-time web search integration
- Conversation history management
- Intermediate step visualization
- Error handling and recovery
- Streaming responses
- Status updates for search operations

## Implementation Steps
1. Environment Setup:
   ```bash
   pip install langchain openai streamlit duckduckgo-search
   ```

2. Memory Configuration:
   - Initialize StreamlitChatMessageHistory
   - Configure ConversationBufferMemory
   - Set up message history management

3. Agent Setup:
   - Configure ChatOpenAI model
   - Set up DuckDuckGo search tool
   - Initialize ConversationalChatAgent

4. Interface Implementation:
   - Create Streamlit chat interface
   - Implement message display
   - Add search status indicators
   - Configure streaming callbacks

## Technical Components
- ChatOpenAI for language model interaction
- DuckDuckGoSearchRun for web search
- StreamlitCallbackHandler for UI updates
- ConversationBufferMemory for context
- AgentExecutor for tool orchestration

## Advanced Features
- Intermediate step visualization
- Search operation status tracking
- Error handling and recovery
- Message history persistence
- Real-time response streaming
- Tool execution logging

## Best Practices
- Initialize chat history properly
- Handle API key securely
- Implement proper error handling
- Display search progress
- Maintain conversation context
- Provide clear status updates

## Prerequisites
- Google Colab account
- OpenAI API key
- Basic Python knowledge
- Understanding of:
  - Conversational AI
  - Search systems
  - Web interfaces
  - Agent-based systems

## Implementation Details
1. Message Management:
   - Store messages in StreamlitChatMessageHistory
   - Display with appropriate avatars
   - Track intermediate steps
   - Handle message history reset

2. Search Integration:
   - Configure DuckDuckGo search tool
   - Display search status
   - Show search results
   - Handle search errors

3. Agent Execution:
   - Process user input
   - Execute search operations
   - Generate responses
   - Update conversation history

## Resources
- [GitHub Repository](https://github.com/aimug-org/austin_langchain)
- [LangChain Chat Models](https://python.langchain.com/docs/modules/model_io/models/chat/)
- [LangChain Memory](https://python.langchain.com/docs/modules/memory/)
- [LangChain Agents](https://python.langchain.com/docs/modules/agents/)
- [Streamlit Documentation](https://docs.streamlit.io)
- [DuckDuckGo Search API](https://duckduckgo.com/api)