---
sidebar_position: 4
---

# LLM Inference Provider Frameworks

**Presenter**: Dmitri Iourovitski
**Date**: October 1, 2025
**Duration**: 15 minutes

## Overview

Dmitri Iourovitski provided a comprehensive comparison of local LLM inference providers, focusing on practical trade-offs between ease of use, performance, and production readiness.

## Scope & Focus

**Covered**: Local inference providers
- Ollama / Llama.cpp
- Hugging Face Transformers
- VLLM

**Not Covered**: Cloud providers
- Reasoning: Cloud providers (OpenAI, Anthropic, etc.) have figured this out; refer to their documentation
- Better to learn from provider-specific resources

## Provider 1: Ollama / Llama.cpp

### Overview

- **Ollama is a wrapper** around Llama.cpp
- Makes model downloading easier
- Simplified local deployment

### Key Features

**Focus**: Local execution with ease
- Designed for quick demos
- GGUF format optimization
- CPU-friendly architecture
- Easy setup and use

### GGUF Format

**What it is**: Binary format optimized for CPU execution

**Advantages**:
- Easy for CPUs to process
- Apple M1 chip compatibility
- AMD CPU+GPU hybrid chip support
- Accelerator-friendly

**Use case**: Quick prototyping and demos

### Strengths

✅ **Ease of Use**:
- Simplest to install and run
- No GPU required
- Minimal configuration
- Great for beginners

✅ **Platform Support**:
- macOS (M1/M2/M3 chips)
- Windows
- Linux
- CPU-only systems

✅ **Quick Demos**:
- Fastest path to running models locally
- Immediate gratification
- Low barrier to entry

### Limitations

❌ **No Batch Processing**:
- Cannot process multiple requests efficiently
- Single-threaded approach
- Poor for production workflows
- Example: Processing 100 PDF pages requires sequential processing

❌ **Opaque Memory Management**:
```bash
ollama ps  # Check model loading and memory usage
```

**Problems**:
- Automatic CPU/GPU memory splitting
- No control over placement
- Unpredictable behavior as context grows
- Models silently move between CPU/GPU

**Example Issue**:
- You have a GPU
- Model loads partially to GPU
- As max sequence length increases
- Model silently offloads to CPU
- Performance degrades unexpectedly

❌ **Not Production-Tuned**:
- Limited concurrent request handling
- No proper batching
- Can quickly run out of memory
- Server settings insufficient for real workloads

**Configuration Options** (exist but limited):
- Number of models running simultaneously
- Requests per model
- But: No batching means memory issues remain

### When to Use Ollama

✅ **Good for**:
- Local development
- Quick demos
- Testing models
- Learning LLMs
- macOS development

❌ **Avoid for**:
- Production deployments
- Batch processing
- High-throughput needs
- Critical applications

## Provider 2: Hugging Face Transformers

### Overview

**Amazing inference stack** with fine-grained control over every aspect of model execution.

### Key Features

**Fine-Grained Control**:
- Layer-by-layer device assignment
- Accelerator selection per layer
- Partial layer sharding across GPUs
- Complete memory management control

**Example Capabilities**:
- "Layer 1-10 on GPU 1"
- "Layer 11-20 on GPU 2"
- "Layer 21 split 50/50 across GPU 1 & 2"

### Strengths

✅ **Cutting-Edge Features**:
- First to implement new techniques
- Flash Attention support (since 2023!)
- Latest model architectures
- Immediate access to new releases

**Flash Attention**:
- Ollama: Recently added for limited models
- Transformers: Easy setup since 2023
- Significant performance improvement

✅ **Feature-Rich**:
- Advanced quantization (AWQ, etc.)
- Dynamic quantization during inference
- Near full-precision with quantization
- Extensive optimization options

✅ **Model Architecture Flexibility**:
- Non-standardized approach
- Each model has own architecture
- Can use models before official release
- Architecture available before weights

**Example**: Qwen3-Next
- Architecture released early
- Transformers support immediate
- Run models day-one when weights drop
- No waiting for provider support

✅ **Production Ready**:
- Used in production successfully
- Reliable and stable
- Extensive tooling
- Strong community support

### Performance Example

**Q1 2.5 VL (7B model) - OCR on 20 pages of images**:

| Provider | Time | Quantization |
|----------|------|--------------|
| Ollama (3090) | 35 minutes | GGUF standard |
| Transformers (3090) | 8 minutes | AWQ (aggressive) |

**Note**: Transformers was faster despite MORE aggressive quantization due to Flash Attention and optimization

### Quantization Options

**AWQ (Activation-aware Weight Quantization)**:
- Dynamic during inference
- Maintains near-full precision
- Better than static GGUF quantization
- Performance + quality

### Limitations

❌ **Developer-Centric**:
- Requires understanding of:
  - Layer offloading
  - Sharding parameters
  - Memory management
  - Model architecture

**Risk**: Can misconfigure and severely impact performance

❌ **Steep Learning Curve**:
- Not standardized across models
- Each model = different architecture
- Manual configuration required
- Need to understand internals

**Architecture Variability**:
- Llama: Own architecture
- BERT: Own architecture
- Qwen: Own architecture
- No universal interface

❌ **Manual Memory Management**:
- You control everything
- Complexity increases
- Easy to make mistakes
- Requires expertise

### When to Use Transformers

✅ **Good for**:
- Production deployments (with expertise)
- Maximum performance needs
- Latest model access
- Custom optimization
- Advanced use cases
- GPU-equipped systems

✅ **Acceptable Requirements**:
- Single GPU (12GB+)
- Developer expertise
- Time to optimize
- Performance critical

❌ **Avoid for**:
- Beginners
- Quick prototypes
- Limited GPU memory (&lt;12GB)
- CPU-only systems

### Developer Tooling

**Advantages**:
- Extensive debugging tools
- Profiling capabilities
- Memory analyzers
- Performance metrics

**PyTorch Backend**:
- Uses PyTorch underneath
- Can use other backends
- Flexible architecture
- Strong ecosystem

## Provider 3: VLLM

### Overview

**Optimized for high-throughput production inference**

### Key Innovation: Paged Attention

**Problem**: Traditional attention loads everything to one device
- Device overload = crash
- Memory management issues

**Flash Attention**: Controls matrix construction
- Smart optimization
- Still single-device focused

**Paged Attention** (VLLM):
- Pages attention like virtual memory
- Prevents memory overflow
- Distributed attention
- Production-grade reliability

### Strengths

✅ **Production Ready**:
- Out-of-the-box production optimization
- Designed for scale
- Robust handling
- Enterprise-grade

✅ **High Throughput**:
- Efficient batching
- Concurrent request handling
- Maximum GPU utilization
- Optimized for volume

✅ **First-Class Batching**:
- Batching as core feature
- Extensive documentation
- Request batching controls
- Token allocation per request
- Seamless implementation

✅ **Enterprise Use Cases**:
- PDF processing at scale
- RAG implementations
- Multiple concurrent services
- Production workloads

### Limitations

❌ **Heavy Setup**:
- Complex installation
- Configuration intensive
- Steep learning curve

**Installation Tip**: Use Docker for easier setup

❌ **GPU Requirements**:
- Minimum: ~12GB GPU
- Optimal: High-end GPUs (3090, 4090, 5090)
- Not suitable for smaller GPUs
- Won't work on macOS

**Under 12GB**: Limited value, constant paging overhead

❌ **Overkill for Small Scale**:
- Not worth it for single requests
- Overhead for simple use cases
- Better alternatives for low volume

### When to Use VLLM

✅ **Perfect for**:
- Production GPU clusters
- High-throughput needs
- Multiple concurrent users
- Batch processing
- Enterprise deployments

✅ **Hardware Requirements**:
- 3090, 4090, 5090 GPUs
- 12GB+ VRAM
- Multiple GPUs (ideal)

✅ **Use Cases**:
- PDF processing pipelines
- RAG at scale
- Open WebUI + background processing
- Multiple simultaneous services

**Example Scenario**:
- Open WebUI for chatting
- Background RAG processing
- PDF analysis running
- All sharing same GPU efficiently

### Concurrent Request Problem (Ollama)

**Issue**: Using Ollama + Open WebUI + background tasks
- Processes wait on each other
- Memory duplication
- Hardware throttling (especially M1 chips)
- Performance degradation

**VLLM Solution**:
- Proper request queuing
- Efficient batching
- No duplication
- Optimized resource use

## Comparison Matrix

| Feature | Ollama/Llama.cpp | HF Transformers | VLLM |
|---------|------------------|-----------------|------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐ Moderate | ⭐ Difficult |
| **Performance** | ⭐⭐ Low | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Maximum |
| **Batching** | ❌ No | ✅ Manual | ✅ Automatic |
| **Production** | ❌ No | ✅ Yes | ✅ Yes |
| **GPU Needs** | ❌ CPU OK | ⚠️ 1 GPU | ✅ Multiple GPUs |
| **Learning Curve** | Low | Steep | Very Steep |
| **Platform** | Any (Mac OK) | GPU/PyTorch | GPU only |
| **Setup Time** | Minutes | Hours | Hours/Days |
| **Batching Docs** | N/A | Manual | Extensive |

## Key Takeaways

### 1. Choose Based on Use Case

**Ollama/Llama.cpp**:
- 📱 Local development
- 🎓 Learning
- 🔬 Prototyping
- 💻 macOS development

**Hugging Face Transformers**:
- 🔧 Flexible production
- 🚀 Latest models
- ⚡ Performance tuning
- 🎯 Single GPU optimization

**VLLM**:
- 🏢 Production at scale
- 📊 High throughput
- 🖥️ GPU clusters
- 🔄 Concurrent requests

### 2. Hardware Matters

| Hardware | Recommendation |
|----------|----------------|
| CPU only | Ollama |
| Single GPU (&lt;12GB) | Ollama or Transformers |
| Single GPU (12-24GB) | Transformers |
| Single High-End GPU | VLLM or Transformers |
| Multiple GPUs | VLLM |
| macOS M-series | Ollama |

### 3. Memory Management Philosophy

**Ollama**: Automatic (opaque)
- ➕ Easy
- ➖ Unpredictable

**Transformers**: Manual (transparent)
- ➕ Complete control
- ➖ Complex

**VLLM**: Managed (optimized)
- ➕ Production-grade
- ➖ Heavy

### 4. Flash Attention Importance

**Why it matters**:
- Significant performance boost
- Memory efficiency
- Should be standard (2023 tech!)

**Support**:
- ❌ Ollama: Limited/recent
- ✅ Transformers: Full (since 2023)
- ✅ VLLM: Full

### 5. Batching is Critical

**For production**:
- Required for efficiency
- Cost optimization
- Resource utilization
- User experience

**Provider Support**:
- ❌ Ollama: None
- ⚠️ Transformers: Manual
- ✅ VLLM: First-class

## Real-World Scenarios

### Scenario 1: Personal AI Assistant

**Requirements**:
- Single user
- Occasional queries
- macOS laptop
- No GPU

**Recommendation**: **Ollama**
- Easy setup
- Sufficient performance
- No GPU needed
- Perfect for personal use

### Scenario 2: Development Team RAG

**Requirements**:
- 10-20 developers
- Document processing
- Single 3090 GPU
- Custom models

**Recommendation**: **Hugging Face Transformers**
- Manual batching acceptable
- Latest models access
- Custom optimization
- Developer flexibility

### Scenario 3: Production SaaS

**Requirements**:
- 1000s of users
- 24/7 availability
- Multiple GPUs
- Cost optimization critical

**Recommendation**: **VLLM**
- Production-grade reliability
- Automatic batching
- Maximum throughput
- Proven at scale

### Scenario 4: Research Lab

**Requirements**:
- Latest models immediately
- Custom architectures
- Experimentation
- Multiple GPUs

**Recommendation**: **Hugging Face Transformers**
- Day-one model access
- Architecture flexibility
- Research features
- Complete control

## Advanced Topics

### Combining Providers

**VLLM + Transformers**:
- VLLM can use Transformers as backend
- Best of both worlds
- Production + flexibility

### SG Lang

**Mentioned but not covered**:
- Alternative to VLLM
- Worth investigating
- Similar use cases

### Architecture Standardization

**PyTorch vs. Transformers**:
- PyTorch: Push for standardization
- Transformers: Embrace variability
- Trade-offs in flexibility vs. consistency

## Q&A Highlights

### Q: Llama.cpp has serving capabilities - have you tried?

**A**: Yes, tried it. Fundamental limitations:
- Not optimized for dynamic batching
- Design choices prevent deep optimization
- CPU activity overhead
- Not primary goal of project

### Q: Can you repeat the question? (Audience member)

**A**: (Questions repeated for recording/clarity throughout talk)

## Resources

### Official Documentation
- [Ollama Documentation](https://ollama.ai/docs)
- [Llama.cpp GitHub](https://github.com/ggerganov/llama.cpp)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers)
- [VLLM Documentation](https://vllm.ai/)

### Installation

**Ollama**:
```bash
# macOS
brew install ollama

# Linux
curl https://ollama.ai/install.sh | sh
```

**Transformers**:
```bash
pip install transformers torch
```

**VLLM** (Docker recommended):
```bash
docker pull vllm/vllm-openai:latest
```

### Community Resources
- AIMUG Discord
- Hugging Face Forums
- VLLM GitHub discussions

## Future Considerations

### Monitoring Trends
- New providers emerging
- Protocol standardization
- Performance improvements
- Hardware evolution

### Optimization Techniques
- Quantization advances
- Attention mechanisms
- Distributed inference
- Memory efficiency

---

**Related Sessions**:
- [LangGraph Middleware](langgraph-middleware)
- [A2A/AP2 Protocols](a2a-ap2-protocols)

**Video**: Watch the full presentation in the [October 2025 showcase recording](https://youtu.be/RvG3KXRiURQ)
