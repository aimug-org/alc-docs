---
sidebar_position: 3
---

# AI-Powered Cancer Detection Research

**Presenter**: Venika Kakarla
**Date**: October 1, 2025
**Duration**: 15 minutes
**Institution**: Stanford University School of Medicine, Donna Saker Lab

## Overview

High school student Venika Kakarla presented her summer research internship at Stanford University's Donna Saker Lab, focusing on spatial analysis of hepatocellular carcinoma (liver cancer) using advanced data analysis techniques and machine learning.

## Background

### The Donna Saker Lab

**Focus Areas**:
- Gastroenterology research
- Digestive system studies
- Hepatocellular carcinoma (HCC)

**Significance**:
- HCC is the **third leading cause** of cancer-related deaths worldwide
- Critical need for better detection and prognosis methods
- Integration of technology with biological research

### Personal Motivation

Venika's research builds on her previous work detecting the cancer that killed her grandfather, demonstrating how AI can:
- Reduce computational requirements (2,500 hours → 5 minutes)
- Democratize research access (expensive clusters → Google Colab)
- Accelerate medical discoveries

## Lab Procedures

### 1. Immunohistochemistry (IHC)

**Purpose**: Locate specific cell types within tumor regions

**Method**:
- Staining techniques highlight different cell types
- Brown vs. white areas indicate cell presence
- Spatial mapping of immune cells, tumor cells, etc.

**Value**: Helps researchers identify drug targeting locations

### 2. Cell Culture

- Growing cells in laboratory conditions
- Controlled research environments
- Detailed cellular study

### 3. Cryostat Sectioning

- Precise tumor sample cutting
- Microscopy preparation
- Spatial analysis enablement

### 4. Proteomics

- Protein expression analysis
- Understanding cellular manufacturing
- Functional insights

## Research Project: Angiogenic Influence

### Project Overview

**Goal**: Understand how blood vessel cells (endothelial cells) influence tumor growth in hepatocellular carcinoma

**Significance**:
- Endothelial cells form capillaries
- They deliver blood to tumors
- Critical for tumor progression

### Four Analysis Components

1. **Direct Interaction Study** (30-50 micrometers)
2. **Indirect Interaction Study** (100+ micrometers)
3. **MVD Analysis** (Microvessel Density)
4. **Clustering Analysis**

## Data & Methodology

### Dataset

**Source**: Codex software (cell classification and spatial positioning)

**Size**: ~1.4 million cells across 124-128 regions

**Data Points**:
- Cell ID
- Cell type (13 different types)
- Cohort (Primary vs. Residual HCC)
- X, Y coordinates (spatial data)
- Protein expression levels

### Cohort Definitions

- **Primary HCC**: First occurrence of tumor
- **Residual HCC**: Recurrent tumor (second+ occurrence)

## Analysis 1: Direct Interactions (30-50μm)

### Methodology

- Analyzed cells within 30-50 micrometer radius of endothelial cells
- Compared cell type distributions
- Statistical significance testing

### Key Findings

**Primary vs. Residual Differences**:
- Increased fibroblasts as tumor cells decrease
- Significant differences in multiple cell types
- Green bars = statistically significant differences

**Implication**: Tumor microenvironment changes significantly with recurrence

### Tools Used

- **Python**: Primary programming language
- **PyCharm & Jupyter Lab**: Development environments
- **Matplotlib**: Graph creation
- **Pandas & NumPy**: Excel/data handling
- **SciPy.stats**: Statistical analysis

## Analysis 2: Indirect Interactions (100-200μm)

### Methodology

- Examined cells 100-200 micrometers from endothelial cells
- Farther radius analysis
- Comparative study

### Key Findings

**Distance-Based Patterns**:
- More tumor cells farther from endothelial cells
- More fibroblasts at distance
- Fewer immune cells reaching tumor

**Implication**: **Immune exclusion** - immune cells aren't reaching tumors effectively, while blood delivery continues

**Research Impact**: Identifies potential therapeutic targets for improving immune cell access

## Analysis 3: MVD (Microvessel Density)

### Methodology

**Grid-Based Approach**:
1. Divide each region into 8x8 grid
2. Count endothelial cells per grid square
3. Normalize by total cells per square
4. Categorize as Low MVD vs. High MVD
5. Compare cell type distributions

### Visualization

```
Region → 8x8 Grid → Count cells per square → Classify MVD → Compare patterns
```

### Key Findings

**MVD Impact on Cell Distributions**:
- Significant differences in cell proportions
- High MVD areas show distinct patterns
- Box plots reveal distribution variations

**Implication**: Blood vessel density correlates with specific cellular environments

### Value

Provides **granular, small-scale insights** into tumor microenvironment composition

## Analysis 4: Clustering with Voronoi Tessellations

### Voronoi Tessellation Method

**Concept**:
1. Take each cell as a data point
2. Find nearest neighboring cells
3. Calculate average distance
4. Draw boundaries at midpoints
5. Create spatial partitions

**Result**: Visual representation of cell clustering vs. dispersion

### Interpretation

- **Larger areas** = cells are more dispersed
- **Smaller areas** = cells are clustered together
- **Residual HCC** shows greater dispersion around endothelial cells

### Key Finding

Residual (recurrent) HCC demonstrates:
- Higher area measurements
- Greater cell dispersion
- Different spatial organization than primary HCC

## Future Work: Graph Attention Networks (GAT)

### Proposed Implementation

**GAT Architecture**:
- **Nodes**: Represent individual cells
- **Edges**: Spatial relationships
- **Features**: Cell type + patient data

### Input Data Integration

**Spatial Information**:
- Cell positions
- Cell types
- Clustering patterns
- Proximity relationships

**Clinical Data**:
- Patient age
- Treatment history
- Previous therapies
- Recurrence status

### Prediction Goals

1. **Recurrence Probability**: Likelihood of cancer returning
2. **Progression Risk**: Speed of cancer worsening
3. **Treatment Response**: Patient-specific predictions

### Multimodal ML Potential

**Integration Possibilities**:
- Previous protein thermal stability research
- Spatial clustering analysis
- Clinical metadata
- Expression profiles

**Goal**: Comprehensive predictive model combining multiple data types

## Previous Research Connection

### Thermal Stability Research

**Previous Work**:
- Protein thermal stability analysis
- Cancer progression speed detection
- Breakthrough efficiency (2,500 hours → 5 minutes)

**Integration Plan**:
- Combine thermal stability data
- Add spatial analysis
- Incorporate clinical records
- Create multimodal ML model

**Outcome**: Enhanced prediction of:
- Cancer onset probability
- Recurrence likelihood
- Patient survival rates

## Technical Skills Demonstrated

### Data Analysis
- Large-scale dataset handling (1.4M+ cells)
- Statistical significance testing
- Spatial data processing
- Visualization techniques

### Programming
- Python proficiency
- Jupyter notebook workflows
- Scientific computing libraries
- Statistical analysis tools

### Research Methods
- Experimental design
- Hypothesis testing
- Results interpretation
- Scientific communication

## Impact & Recognition

### Stanford Internship
- Summer research position
- Donna Saker Lab
- School of Medicine placement
- Mentorship from university researchers

### Community Mentorship
- Mentored by Colin McNamara
- Supported by AIMUG community
- Previous presentation in March 2025
- Ongoing research guidance

### Publication Plans
- Research paper in progress
- Publication process underway
- Future sharing with community

### Future Goals
- Continue Stanford research
- Potential full-time enrollment
- Further AI/ML integration
- Medical research advancement

## Key Takeaways

1. **AI Democratizes Research**: Complex analysis accessible via Python/Colab

2. **Spatial Patterns Matter**: Cell positioning reveals cancer progression mechanisms

3. **Multi-Scale Analysis**: Different distance scales reveal different insights

4. **Recurrence Has Signatures**: Primary vs. residual HCC show distinct spatial patterns

5. **ML Future**: Graph Attention Networks can integrate spatial + clinical data

6. **Young Researchers**: High school students can contribute to cutting-edge research

## Community Impact

### Inspiration
- High school student doing university-level research
- Democratization of AI/ML tools
- Accessible research methodologies
- Mentorship model success

### Knowledge Sharing
- Open presentation of methods
- Educational value for community
- Reproducible techniques
- Encouragement for others

## Resources

### Previous Work
- March 2025 AIMUG presentation (more AI-focused)
- LinkedIn profile with additional projects

### Tools & Technologies
- **Python**: Data analysis
- **Google Colab**: Accessible computing
- **Codex**: Cell classification
- **Matplotlib**: Visualization
- **SciPy**: Statistical testing
- **Pandas/NumPy**: Data manipulation

### Research Context
- Donna Saker Lab, Stanford
- Hepatocellular carcinoma research
- Spatial biology methods
- Graph neural networks

## Questions & Answers

### Q: How does this relate to your previous cancer detection research?

**A**: Both projects can be integrated into a multimodal ML model:
- Thermal stability data (previous work)
- Spatial clustering data (current work)
- Clinical data
- Combined prediction of recurrence and progression

### Audience Reaction

- Standing ovation
- Community pride in student achievement
- Recognition of groundbreaking work
- Encouragement for continued research

## Call to Action

### For Researchers
- Explore spatial analysis techniques
- Consider Graph Attention Networks
- Integrate multiple data modalities
- Share methods openly

### For Students
- Research opportunities available
- AI/ML accessible to beginners
- Community support available
- Real impact possible

### For Community
- Support young researchers
- Provide mentorship
- Share knowledge
- Encourage innovation

---

**Related Sessions**:
- [LangGraph Middleware](langgraph-middleware)
- [A2A/AP2 Protocols](a2a-ap2-protocols)
- [March 2025 AI Cancer Detection Talk](../mar-2025/ai-cancer-detection)

**Video**: Watch the full presentation in the [October 2025 showcase recording](https://youtu.be/RvG3KXRiURQ)

**Future Updates**: Follow Venika's LinkedIn for publication announcements and research updates
