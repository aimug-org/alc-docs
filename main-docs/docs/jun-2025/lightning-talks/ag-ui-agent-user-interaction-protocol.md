---
sidebar_position: 3
---

# AG-UI: Agent-User Interaction Protocol

*Lightning Talk - 10 minutes*

> **🔗 Interactive Presentation**: [View Live Slides](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/76e1247e589a34eed9a2f3fbbb089715/1732eaca-a9a0-4414-b23a-f790090a0864/index.html?utm_source=perplexity)

## 📹 **Video Recording**

<iframe width="100%" height="500" src="https://www.youtube.com/embed/Owvcy7GIvEY?start=1259" title="June 2025 AIMUG - AG-UI Lightning Talk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## 🎯 **What is AG-UI?**

**AG-UI** is the **Agent-User Interaction Protocol** - think of it as **"USB-C for AI agents!"**

- **Open, lightweight, event-driven protocol**
- **Universal translator** for AI-driven systems
- **Standardizes frontend-to-agent communication**
- **Real-time human-AI collaboration**

## 🚨 **The Problem It Solves**

### Current Pain Points
- **Agents live in backend silos** - no standard UI integration
- **Custom WebSocket implementations** for each framework
- **No standard for real-time interaction** between humans and agents
- **Fragmented agent-to-UI communication** across platforms
- **Human-in-the-loop workflows are complex** to implement

## ⚡ **Core Capabilities**

- **🔄 Real-time interactivity** - Sub-100ms latency
- **📡 Live state streaming** - Watch agents work in real-time
- **🤝 Human-in-the-loop collaboration** - Interrupt and guide agents
- **📝 Token-by-token text streaming** - See AI thinking live
- **🔍 Tool execution transparency** - Monitor what agents are doing
- **↔️ Bidirectional communication** - True conversation flow

## 🏗️ **Event-Driven Architecture**

### **16 Standardized Event Types** across **5 Categories**:

#### **Lifecycle Events (5)**
- `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`
- `STEP_STARTED`, `STEP_FINISHED`

#### **Text Message Events (3)**
- `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`

#### **Tool Call Events (3)**
- `TOOL_CALL_START`, `TOOL_CALL_ARGS`, `TOOL_CALL_END`

#### **State Management Events (3)**
- `STATE_SNAPSHOT`, `STATE_DELTA`, `MESSAGES_SNAPSHOT`

#### **Special Events (2)**
- `RAW`, `CUSTOM`

### **Transport Options**
- **JSON events** over HTTP/SSE
- **Optional binary protocol** for 60% smaller payloads
- **Transport agnostic** - HTTP/SSE/WebSockets

## 🔧 **Framework Integrations**

### **✅ Currently Supported**
- **LangGraph** - Graph-based agent orchestration
- **CrewAI** - Multi-agent workflows
- **Mastra** - TypeScript-first agents
- **AG2** - Open-source AgentOS

### **🚧 Coming Soon**
- **Bedrock** - AWS managed agents

## 🌐 **Protocol Ecosystem**

AG-UI complements (doesn't compete with) other protocols:

### **MCP** (Model Context Protocol)
- **By**: Anthropic
- **Purpose**: Agent ↔ Tools communication

### **A2A** (Agent-to-Agent Protocol)
- **By**: Google
- **Purpose**: Agent ↔ Agent communication

### **AG-UI** (Agent-User Interaction Protocol)
- **By**: CopilotKit
- **Purpose**: Agent ↔ Human interaction

**These protocols work together to create a complete AI ecosystem!**

## 🎯 **Real-World Use Cases**

### **💻 Live Code Pairing**
AI writes code token-by-token, human can interrupt and collaborate

### **📊 Data Analysis Dashboards**
Real-time query execution with human oversight

### **🤖 Multi-Agent Orchestration**
Human supervisors monitoring agent workflows

### **🎨 Creative Design Tools**
AI generates designs with live previews and human feedback

## 🚀 **Technical Benefits**

- **Sub-100ms latency** for token streaming
- **60% smaller payloads** with binary protocol
- **Transport agnostic** (HTTP/SSE/WebSockets)
- **Framework agnostic** - works with any agent system
- **State delta syncing** reduces bandwidth
- **Built-in security and error handling**

## 🛠️ **Getting Started**

### **Resources**
- **📚 Documentation**: [docs.ag-ui.com](https://docs.ag-ui.com)
- **🧪 Live Demo**: [agui-demo.vercel.app](https://agui-demo.vercel.app)
- **💻 GitHub**: [github.com/ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)
- **🛠️ SDKs**: TypeScript and Python available

### **Quick Start**
Start building human-AI collaborative apps today with standardized real-time interaction!

## 🔗 **Related Content**

- **[MCP Architecture & A2A](../full-sessions/mcp-testing-showcase.md)** - Deep dive into protocol ecosystem
- **[AI Ecosystem 2025](./ai-ecosystem-landscape-2025.md)** - Broader context of AI development tools
- **[Resources](../resources/)** - Implementation guides and tools

---

*AG-UI represents the missing piece in the AI protocol ecosystem - standardized human-agent interaction that enables true collaborative AI applications.*
