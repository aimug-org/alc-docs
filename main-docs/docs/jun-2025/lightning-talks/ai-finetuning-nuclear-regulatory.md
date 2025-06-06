---
sidebar_position: 5
---

# Fine-tuning Embeddings for Nuclear Power

A lightning talk by Rob Whelan from Gridway AI demonstrating how to fine-tune embeddings models specifically for nuclear power domain language and improve search accuracy in nuclear regulatory documents.

## Overview

This session presented a practical approach to fine-tuning embeddings for the nuclear power industry, addressing the challenge of domain-specific jargon and terminology. Rob Whelan demonstrated how better embeddings lead to better search results when working with nuclear regulatory documents and technical specifications.

## 📹 Video Recording

<iframe width="100%" height="500" src="https://www.youtube.com/embed/Owvcy7GIvEY?start=2053" title="June 2025 AIMUG - Fine-tuning Embeddings for Nuclear Power" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Presentation Materials

Access the complete presentation materials from this lightning talk:

- 📄 [Presentation Slides (PDF)](./Fine%20tuning%20embeddings%20for%20nuclear%20power.pdf) - Full presentation deck on fine-tuning embeddings for nuclear power applications
- 📓 [Jupyter Notebook](./finetune-embeddings-notebook.ipynb) - Complete code implementation for fine-tuning embeddings
- 📊 [Training Data](./embedding_data_hard_negs_4.jsonl) - Sample training data with hard negatives for embedding fine-tuning

## The Challenge: Nuclear Domain Jargon

### Why Nuclear Needs Specialized Embeddings

The nuclear industry is filled with domain-specific terminology and acronyms that general-purpose embeddings models don't understand well:

- **Acronyms galore** - The industry uses countless specialized acronyms
- **Context-specific meanings** - Terms like "LWR" (Light Water Reactors) have completely different meanings than "GEN4+" reactors
- **Technical precision** - Words like "coolant" and "moderator" have very specific nuclear meanings different from general usage

### The Impact on Search

When embeddings don't understand nuclear terminology:
- Search results are less relevant
- Important documents may be missed
- Users need to know exact terminology to find information

## Better Embeddings = Better Search

### Understanding Embeddings

Embeddings are vector representations of words and phrases - arrays of floats like `[0.133, -1.533, 2.122, 0.001,...]`. The quality of search depends on how well these vectors capture semantic meaning in your specific domain.

### Before and After Fine-tuning

The presentation showed dramatic improvements in semantic understanding:

**Before fine-tuning:**
- "coolant" was too far from nuclear-specific terms like "moderator"
- General embeddings didn't understand nuclear context

**After fine-tuning:**
- "coolant" and "moderator" are properly related in nuclear context
- The model understands domain-specific relationships
- Search results become much more relevant

## Technical Implementation

### Infrastructure Requirements

The fine-tuning process requires:
- **GPU with plenty of memory** - Used AWS `ml.g6.16xlarge` instance
- **PyTorch** - For model training
- **Base embeddings model** - Started with `BAAI/bge-base-en-v1.5` (768 dimensions)

### Training Approach

The implementation used:
- **MultipleNegativesRankingLoss** - Loss function for training
- **Positive and negative pairs** - Including "hard negatives" that are difficult to differentiate
- **80/20 train/validation split** - Standard ML practice
- **10,000 training examples** - Generated using GPT-4o-mini from regulatory source texts

### Training Data Generation

The training data (`embedding_data_hard_negs_4.jsonl`) was created by:
1. Using dozens of regulatory source texts
2. Generating positive and negative pairs with GPT-4o-mini
3. Including "hard negatives" - similar but importantly different examples

## Using the Fine-tuned Model

### Code Example

```python
from sentence_transformers import SentenceTransformer, util

# Load the fine-tuned model
model = SentenceTransformer("gridwayai/nuclear-licensing-embeddings-768")

# Example nuclear-specific sentences
sentences = [
    'What is the purpose of the Rapid Borate Stop Valve in Reactor Control?',
    'Locates and discusses opening 1CV175, Rapid Borate Stop Valve by disengaging clutch and rotating handwheel (counterclockwise).',
    'CLOSE the Air Supply Isolation Valve, 12CV160 A/S, AIR SUPPLY FOR 12CV160.',
]

# Generate embeddings
embeddings = model.encode(sentences)
# Returns a list of vector arrays
```

### Model Availability

The fine-tuned model is publicly available:
- **Hugging Face**: [gridwayai/nuclear-licensing-embeddings-768](https://huggingface.co/gridwayai/nuclear-licensing-embeddings-768)
- **Gridway AI SDK**: [GitHub Repository](https://github.com/gridwayai/gridwayai-sdk)

## Practical Applications

### Improved Search Capabilities

With fine-tuned embeddings, nuclear organizations can:
- **Find relevant procedures faster** - Better understanding of technical queries
- **Improve compliance searches** - More accurate retrieval of regulatory documents
- **Enable natural language queries** - Users don't need to know exact terminology
- **Cross-reference related concepts** - Automatically find related safety procedures

### Example Use Cases

Real-world applications include:
- **Operator training** - Finding relevant procedures and documentation
- **Regulatory compliance** - Searching through vast regulatory databases
- **Incident investigation** - Quickly finding related historical events
- **Maintenance planning** - Locating specific technical specifications

## Key Insights from the Presentation

### Why This Matters

1. **Domain specificity is crucial** - General embeddings miss nuclear-specific meanings
2. **Better search saves time and improves safety** - Operators find the right information faster
3. **Accessible technology** - Fine-tuning is now practical with modern tools
4. **Open source contribution** - The model is freely available for the nuclear community

### Technical Takeaways

- **Start with a good base model** - BAAI/bge-base-en-v1.5 provides solid foundation
- **Quality training data is key** - Even 10,000 examples can make a significant difference
- **Hard negatives improve performance** - Include challenging examples in training
- **GPU requirements are manageable** - AWS instances make this accessible

## About the Speaker

**Rob Whelan** - Gridway AI
- Presented at AIMUG (AI Model User Group) in Austin, TX
- June 4, 2025
- Focused on practical applications of AI in nuclear power

## Resources and Next Steps

### Available Resources
- **Model on Hugging Face**: [gridwayai/nuclear-licensing-embeddings-768](https://huggingface.co/gridwayai/nuclear-licensing-embeddings-768)
- **Gridway AI SDK**: [GitHub Repository](https://github.com/gridwayai/gridwayai-sdk)
- **Training notebook**: Available in the presentation materials
- **Sample training data**: 10,000 examples with hard negatives

### Getting Started
1. Try the model on Hugging Face
2. Explore the Jupyter notebook for implementation details
3. Adapt the approach for your specific nuclear domain needs
4. Consider contributing improvements back to the community

---

*This lightning talk demonstrated how fine-tuning embeddings for nuclear-specific language can dramatically improve search and information retrieval in nuclear power applications. The open-source model and implementation details are available for the community to use and improve.*
