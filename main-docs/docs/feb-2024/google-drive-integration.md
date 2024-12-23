# Google Drive Integration with LangChain

## Presenter
**Riccardo Pirruccio (Ricky)** is an enterprise architecture specialist who has made significant contributions to the Austin LangChain community through his work on RAG implementations and Docker containerization. His expertise in integrating Google Drive with LangChain has helped developers build robust document processing and analysis systems.

> "I work for a semiconductor manufacturing company... We're actually in the process of putting together a knowledge base for our design engineers to kind of be consistent of how to design things. Because currently, it's very inconsistent... If I could just record my meetings on teams and transcribe them, which I already can, and then just kind of have an LLM that can do RAG with my transcript, that'd be awesome."

Connect with Ricky:
- GitHub: [@RPirruccio](https://github.com/RPirruccio)
- LinkedIn: [riccardopirruccio](https://www.linkedin.com/in/riccardopirruccio)

## Lab Overview
Learn how to integrate Google Drive with LangChain applications, enabling document processing and data analysis capabilities. This lab demonstrates how to build a RAG application that can pull data from Google Drive folders, a common location where many organizations store their data.

## Technologies Used
- LangChain: Core framework for building the application
- OpenAI: Chat model and embeddings
- Streamlit: Frontend interface
- Docker: Container orchestration
- Google Drive: Document storage
- Chroma: Vector store for embeddings

## Key Topics
- Google Drive API setup
- Document processing
- Data integration
- Security practices
- Access management
- Docker containerization
- FastAPI endpoints
- Streamlit frontend integration

## Features
- Document access and processing
- Dynamic chain creation
- Chat history management
- Secure authentication
- Docker deployment
- Streamlit interface

## Technical Components
- Google Drive API integration
- Service account authentication
- Document handlers
- FastAPI endpoints
- Docker configuration
- Streamlit setup

## Implementation Steps
1. Service Account Setup
   - Create Google service account
   - Download authentication key
   - Configure environment variables

2. Docker Configuration
   - Set up backend microservice
   - Configure Streamlit frontend
   - Use docker-compose for orchestration

3. Application Setup
   - Configure FastAPI endpoints
   - Implement chain creation
   - Set up Streamlit interface
   - Handle authentication

4. Testing and Deployment
   - Local testing
   - Docker deployment
   - Security verification

## Best Practices
- Use service accounts for Docker authentication
- Configure proper folder permissions
- Implement secure key management
- Handle errors appropriately
- Optimize for performance

## Prerequisites
- Google Drive account
- Service account credentials
- Docker Desktop installation
- Basic understanding of:
  - OAuth flows
  - API integration
  - Docker concepts
  - Python programming

## Important Notes
> "Very important, whenever you share your permissions for the folder, you need to have this 'anyone with the link' selected. Otherwise, you won't be able to access this folder, you will just get an empty array."

> "A service account basically allows you to use Docker to authenticate with the Google Drive API. You can't otherwise do that."

## Resources
- [GitHub Repository](https://github.com/aimug-org/austin_langchain)
- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [LangChain Document Loaders](https://python.langchain.com/docs/modules/data_connection/document_loaders/)
- [Docker Documentation](https://docs.docker.com/)
