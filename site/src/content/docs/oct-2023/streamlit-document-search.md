# Document Search with Streamlit

## Lab Overview
Learn how to implement document search functionality using Streamlit and LangChain, creating a powerful search interface for your documents. This lab demonstrates how to build a conversational document search system that allows users to upload PDFs and interact with their content through natural language queries.

## Lab Materials
- [View Lab Notebook](https://github.com/aimug-org/austin_langchain/blob/main/labs/LangChain_101/101-2-streamlit_document_search.ipynb)

## Key Components
- Document Processing:
  - PDF loading with PyPDFLoader
  - Text splitting with RecursiveCharacterTextSplitter
  - Chunk size: 1500 characters
  - Chunk overlap: 200 characters

- Embedding and Search:
  - HuggingFace embeddings (all-MiniLM-L6-v2 model)
  - DocArrayInMemorySearch vector store
  - MMR (Maximal Marginal Relevance) search
  - Configurable search parameters (k=5, fetch_k=10)

- Chat Interface:
  - Streaming responses
  - Conversation memory
  - Context retrieval display
  - Message history management

## Technical Implementation
```python
# Core components
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import PyPDFLoader
from langchain.memory import ConversationBufferMemory
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.vectorstores import DocArrayInMemorySearch
```

### Document Processing Pipeline
1. File Upload:
   - Accept multiple PDF files
   - Create temporary directory for processing
   - Load documents using PyPDFLoader

2. Text Processing:
   - Split documents into manageable chunks
   - Create embeddings using HuggingFace model
   - Store in DocArray vector database

3. Retrieval System:
   - Configure MMR search for diversity in results
   - Set up conversation memory
   - Initialize ChatOpenAI model
   - Create conversational retrieval chain

## Features
- Document upload and processing
- Full-text search capabilities
- Result highlighting
- Interactive search interface
- Real-time streaming responses
- Conversation history
- Context-aware responses
- Multiple document support

## Implementation Steps
1. Environment Setup:
   ```bash
   pip install langchain streamlit openai pypdf sentence_transformers docarray
   ```

2. Configure Streamlit Interface:
   - Set up page configuration
   - Create file upload widget
   - Implement chat interface
   - Add API key management

3. Document Processing:
   - Implement document loading
   - Configure text splitting
   - Set up vector store
   - Initialize retrieval system

4. Chat System:
   - Set up conversation memory
   - Configure LLM
   - Implement streaming responses
   - Add context retrieval display

## Advanced Features
- Streaming response handler for real-time updates
- Context retrieval display for transparency
- Conversation buffer memory for contextual chat
- MMR search for diverse result retrieval
- Temperature control for consistent responses

## Prerequisites
- Google Colab account
- OpenAI API key
- Basic Python knowledge
- Understanding of:
  - Document processing
  - Search concepts
  - Web interfaces
  - Vector embeddings

## Best Practices
- Use streaming for better user experience
- Implement proper error handling
- Cache resource-intensive operations
- Manage conversation context effectively
- Display search context for transparency

## Resources
- [GitHub Repository](https://github.com/aimug-org/austin_langchain)
- [Streamlit Documentation](https://docs.streamlit.io)
- [LangChain Document Loaders](https://python.langchain.com/docs/modules/data_connection/document_loaders/)
- [HuggingFace Models](https://huggingface.co/models)
- [DocArray Documentation](https://docarray.jina.ai/)
