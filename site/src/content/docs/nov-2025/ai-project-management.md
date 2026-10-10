# AI Project Management Anti-Patterns

**Speaker:** [Paul Phelps](https://www.linkedin.com/in/mrpaulphelps/)
**Role:** Freelance AI Implementation Consultant
**Location:** Remote from AIMUG Panama (100 members!)
**Date:** November 5, 2025

## Overview

Paul Phelps tackled the organizational barriers that kill 95% of AI projects. Presenting remotely from the Panama chapter of AIMUG, Paul shared insights from shipping pre-LLM AI systems and current work developing a developer-focused AI project framework.

## The Central Thesis

> "The constraint for AI getting into production is not the model, but the organizational approach. Product/Project Managers still use legacy SaaS/ERP mental models."

**Key insight:** Technical excellence doesn't matter if organizational process blocks deployment.

## The 95% Failure Rate

### Industry Statistics

- **95% of AI pilots fail** to reach production
- Most failures are **organizational, not technical**
- Technical teams build working models that never deploy
- Process and PM approach are the bottleneck

### The 6-Month Notebook Problem

> "You build a model, it works perfectly in your notebook, 95% accuracy, clean code, great performance metrics, but six months later, it's still not in production. The block is almost never your system. The block is organizational process."

**Common scenario:**
1. Data scientist builds model (Week 1-4)
2. Model performs excellently in notebooks (95% accuracy)
3. Technical validation complete (Week 5)
4. Organizational approval process begins (Week 6)
5. **Six months later:** Still in stakeholder interviews
6. **Never deployed:** Lost in process bureaucracy

## Traditional Software vs AI: Key Differences

### Traditional SaaS/ERP Assumptions

**Predictability:**
- Same input → Same output
- Deterministic behavior
- Testable with unit tests

**Requirements:**
- Complete requirements gathered upfront
- Fixed scope
- Waterfall or staged delivery

**Quality:**
- Binary (works or doesn't)
- Bugs are defects to fix
- 100% accuracy achievable

**Scope:**
- Scope creep is bad
- Changes indicate poor planning
- Lock requirements early

### AI Reality

**Non-Deterministic:**
- Same input ≠ Same output
- Probabilistic behavior
- Statistical validation required

**Evolving Requirements:**
- Requirements emerge through experimentation
- Iterative discovery process
- Learn what data can do

**Quality:**
- Probabilistic correctness
- "Good enough" is the goal
- Perfect accuracy often impossible

**Adaptive Scope:**
- Scope changes signal learning
- Iteration is expected
- Requirements evolve = system working

## The Mental Model Shift

### Old PM Playbook (SaaS/ERP)

```
1. Gather all requirements (Months 1-3)
2. Design complete solution (Month 4)
3. Build to spec (Months 5-8)
4. Test against requirements (Month 9)
5. Deploy (Month 10)
```

**Assumes:**
- Known problem, known solution
- Requirements don't change
- Linear progress
- No uncertainty

### New AI Reality

```
1. Identify problem space (Week 1)
2. Quick data exploration (Week 2)
3. Build minimum viable model (Weeks 3-4)
4. Evaluate with real data (Week 5)
5. Learn what works/doesn't (Week 6)
6. Adjust approach (Week 7)
7. Repeat steps 3-6 until "good enough"
```

**Requires:**
- Tolerance for uncertainty
- Iterative development
- Developer involvement throughout
- Acceptance of "good enough"

## Framework Comparison

Paul analyzed four major AI project frameworks:

### 1. Accenture Framework

**Focus:** Organizational maturity and change management

**Strengths:**
- ✅ Excellent change management approach
- ✅ Training and upskilling programs
- ✅ Cultural transformation focus
- ✅ Executive buy-in strategies

**Weaknesses:**
- ❌ Expensive consulting required
- ❌ Not developer-focused
- ❌ Heavy on process, light on technical reality
- ❌ MBA lens, not engineering lens

**Best for:** Large enterprises with change management challenges

**Quote:** "Paperwork over arresting people" (IBM reference, but applies)

### 2. Google Framework

**Focus:** Infrastructure readiness

**Strengths:**
- ✅ Technical infrastructure emphasis
- ✅ Scalability considerations
- ✅ Production deployment focus

**Weaknesses:**
- ❌ Selling infrastructure (GCP)
- ❌ Assumes infrastructure is the constraint
- ❌ Less focus on organizational readiness
- ❌ Technical solution to organizational problem

**Best for:** Organizations with infrastructure gaps

**Reality check:** Infrastructure isn't the blocker for most organizations

### 3. AWS/Amazon Framework

**Focus:** Data readiness

**Strengths:**
- ✅ Data quality emphasis
- ✅ Data pipeline considerations
- ✅ Storage and access patterns

**Weaknesses:**
- ❌ Selling storage and data services
- ❌ Quantity over quality emphasis
- ❌ "More data is better" assumption
- ❌ Doesn't address PM process issues

**Best for:** Organizations with data infrastructure needs

**Reality check:** More data doesn't fix process problems

### 4. IBM Framework

**Focus:** Governance, documentation, compliance

**Strengths:**
- ✅ Thorough governance approach
- ✅ Compliance and regulatory focus
- ✅ Enterprise-ready processes
- ✅ Audit trail emphasis

**Weaknesses:**
- ❌ Slow and bureaucratic
- ❌ Heavy documentation requirements
- ❌ Risk-averse to a fault
- ❌ "Paperwork over arresting people"

**Best for:** Highly regulated industries (healthcare, finance)

**Reality check:** Can make simple projects take months

### Universal Framework Agreements

**All frameworks agree on these:**

1. **Well-defined business problem**
   - Clear value proposition
   - Measurable success criteria
   - Stakeholder alignment

2. **Data readiness and clarity**
   - Access to relevant data
   - Sufficient quality
   - Legal rights to use

3. **Cross-functional collaboration**
   - Business + Technical + Operations
   - Not siloed development
   - Shared ownership

**Paul's addition:**
- **Developer involvement from day one**
- **Acceptance of non-deterministic behavior**
- **Iterative discovery process**

## Red Flags: When Your AI Project Will Fail

### 🚩 Red Flag #1: Complete Requirements Before Code

**Symptom:**
- PM demands fully documented requirements
- No code until all stakeholders agree
- Months of requirements gathering
- Treating AI like enterprise software

**Why it fails:**
- Can't know requirements without experimentation
- Data reveals possibilities
- Requirements emerge through iteration

**Solution:**
- Build minimum viable prototype quickly
- Learn from data
- Iterate requirements

### 🚩 Red Flag #2: One Perfect Predetermined Solution

**Symptom:**
- PM insists on single agreed-upon approach
- No room for experimentation
- Architecture decided before prototyping
- "We'll use [specific technology]"

**Why it fails:**
- Don't know what will work until you try
- Multiple approaches often needed
- Best solution emerges through testing

**Solution:**
- Try multiple approaches
- A/B test solutions
- Let data guide architecture

### 🚩 Red Flag #3: Enterprise Infrastructure Before Validation

**Symptom:**
- Must set up full production infrastructure first
- Kubernetes, microservices, full CI/CD
- Months of infrastructure work
- No validation of core value proposition

**Why it fails:**
- Premature optimization
- Expensive before proving value
- Delays learning
- May build wrong thing

**Solution:**
- Validate in notebooks first
- Prove value before scaling
- Infrastructure follows validation

### 🚩 Red Flag #4: Months of Stakeholder Interviews

**Symptom:**
- Interview every possible stakeholder
- Consensus required before starting
- Analysis paralysis
- No actual building

**Why it fails:**
- Stakeholders don't know what AI can do
- Can't describe requirements for unknown capabilities
- Discussion without prototypes is theoretical

**Solution:**
- Build prototype quickly
- Show stakeholders working demo
- Gather feedback on real system

### 🚩 Red Flag #5: No Changes to Traditional Delivery Process

**Symptom:**
- Using same PM framework as SaaS projects
- Same stage gates
- Same approval processes
- Same success criteria

**Why it fails:**
- AI is fundamentally different
- Non-deterministic requires different approach
- Iterative vs waterfall
- Probabilistic vs binary success

**Solution:**
- New PM framework for AI
- Different stage gates
- Embrace iteration
- Probabilistic success metrics

## The Developer-Involved Model

### Why Developers Must Be Involved

**Traditional model:**
```
PM → Requirements → Hand to Dev → Build → Deploy
```

**Why this fails for AI:**
- Developers understand what's possible
- Data reveals requirements
- Technical constraints inform approach
- Iteration requires technical judgment

**AI model:**
```
Problem → Dev Exploration → Learn Possibilities →
Refine Problem → Iterate
(PM facilitates throughout)
```

### Developer Involvement Touchpoints

1. **Problem Definition**
   - Developer input on feasibility
   - Technical constraint identification
   - Data availability assessment

2. **Data Exploration**
   - Developers find patterns
   - Identify data quality issues
   - Discover possibilities

3. **Prototype Building**
   - Rapid iteration
   - Multiple approaches tested
   - Learning what works

4. **Requirements Refinement**
   - Based on prototype learning
   - Informed by data reality
   - Scoped to achievable

5. **Production Planning**
   - Technical architecture decided
   - Based on validated approach
   - Infrastructure follows validation

## Scope Changes as Success Signals

### Traditional View: Scope Creep is Bad

**Assumption:**
- Requirements should be stable
- Changes indicate poor planning
- Lock scope early

**Consequences:**
- Resistance to learning
- Building wrong thing
- Ignoring discoveries

### AI View: Scope Changes Signal Learning

**New assumption:**
- Requirements should evolve
- Changes indicate learning
- Scope adapts to data reality

**Examples:**
- "We thought we needed X, but data shows Y is more valuable"
- "Initial approach revealed Z opportunity"
- "User feedback changed our understanding"

**Healthy scope evolution:**
```
Week 1: Build sentiment classifier
Week 3: Discover topic modeling more valuable
Week 4: Pivot to topic modeling with sentiment
Week 6: Add entity extraction (emerged from usage)
Week 8: Refine to focus on entity relationships (highest value)
```

**This isn't scope creep - it's iterative discovery**

## Paul's Framework Development

### The Goal

Create a **developer-focused AI project framework** that addresses the 95% failure rate by:
- Embracing non-deterministic behavior
- Starting with developer exploration
- Iterating based on data learning
- Avoiding traditional PM pitfalls

### Seeking Input

Paul is actively developing this framework and **seeking input from developers** on:
- Blind spots in current frameworks
- Common organizational barriers
- What works in practice
- What doesn't work but is imposed anyway

**Connect on LinkedIn:** [linkedin.com/in/mrpaulphelps](https://www.linkedin.com/in/mrpaulphelps/)

### Recent Writing

Paul has published articles on:
- "95% of AI pilots fail because we're still treating AI like SaaS"
- Characteristics of successful AI initiatives
- How organizations must adopt different approaches for AI vs traditional software

## Practical Recommendations

### For Project Managers

1. **Embrace uncertainty**
   - AI is probabilistic
   - Perfect isn't possible
   - "Good enough" is the goal

2. **Enable iteration**
   - Fast cycles over long planning
   - Learn from prototypes
   - Adjust based on data

3. **Involve developers early**
   - They understand possibilities
   - Technical input crucial
   - Not just implementers

4. **Accept scope evolution**
   - Changes are learning
   - Not poor planning
   - Expected and healthy

5. **Focus on value, not perfection**
   - 80% accuracy might be transformative
   - Don't wait for 99%
   - Ship and iterate

### For Developers

1. **Engage in requirements**
   - Don't wait to be handed specs
   - Proactively explore data
   - Show possibilities

2. **Build prototypes fast**
   - Demonstrate value quickly
   - Let data speak
   - Iterate based on feedback

3. **Communicate probabilistically**
   - "85% accuracy" not "it works"
   - Explain uncertainty
   - Set realistic expectations

4. **Document learning**
   - What works
   - What doesn't
   - Why approach evolved

5. **Push back on waterfall**
   - Explain why AI is different
   - Advocate for iteration
   - Educate stakeholders

### For Organizations

1. **Create AI-specific processes**
   - Don't use SaaS playbook
   - New stage gates
   - Different success criteria

2. **Invest in PM education**
   - AI is different
   - Non-deterministic thinking
   - Iterative frameworks

3. **Reward learning**
   - Not just shipping
   - Failed experiments are valuable
   - Iteration is progress

4. **Fast-track experiments**
   - Lightweight approval for prototypes
   - Heavy approval for production
   - Enable rapid learning

5. **Cross-functional teams**
   - Not siloed
   - Business + Dev + Ops together
   - Shared ownership

## Case Study: The Failing Pattern

### Typical Failure Scenario

**Week 0:** PM assigned AI project
- Treats like previous ERP project
- Plans 3-month requirements phase

**Month 1-3:** Stakeholder interviews
- Everyone has opinions
- No prototypes built
- Theoretical discussions

**Month 4:** Requirements document
- 50-page specification
- No technical validation
- Developer sees it first time

**Month 5-6:** Developer builds
- Finds data issues immediately
- Requirements unrealistic
- No iteration allowed

**Month 7:** PM sees working model
- "This isn't what I specified"
- Back to requirements
- Frustration on all sides

**Month 9-12:** Organizational paralysis
- Debates about approach
- Committees formed
- No deployment

**Result:** Project cancelled, model never deployed, everyone blames each other

### Success Pattern

**Week 1:** Problem identified
- Developer involved from start
- Quick data exploration
- Feasibility check

**Week 2:** Prototype built
- Working demo
- Real data
- Actual results

**Week 3:** Stakeholder demo
- Concrete discussion
- Based on reality
- Informed feedback

**Week 4-6:** Iteration
- Refine based on feedback
- Improve accuracy
- Enhance features

**Week 7:** Lightweight production
- Simple deployment
- Real users
- Gather feedback

**Week 8-12:** Iterate in production
- Continuous improvement
- Data-driven refinement
- Growing value

**Result:** Deployed system, happy users, continuous improvement

## Key Takeaways

1. **95% of AI projects fail due to organizational approach, not technology**
2. **PMs using SaaS mental models kill AI projects**
3. **AI is non-deterministic - embrace it**
4. **Requirements must evolve - it's a feature, not a bug**
5. **Scope changes signal learning, not poor planning**
6. **Developers must be involved from day one**
7. **Build prototypes fast, iterate based on data**
8. **All frameworks agree on: business problem, data readiness, collaboration**
9. **Red flags: complete requirements first, no iteration, traditional processes**
10. **Success requires new PM frameworks built for AI's unique characteristics**

## AIMUG Panama

Paul leads the **Panama chapter of AIMUG** with **100 members**! The international presence demonstrates the global demand for honest, practical AI community learning.

## Resources

- [Paul Phelps LinkedIn](https://www.linkedin.com/in/mrpaulphelps/)
- Connect for collaboration on developer-focused AI framework
- AmaliaConf2025 presentation on AI initiative frameworks
- Articles on AI project success factors

## Q&A Highlights

**Q: What about regulated industries that need complete requirements?**
A: You can still iterate within compliance bounds. Do fast cycles in a compliant way. The requirement is compliance, not waterfall.

**Q: How do you convince traditional PMs to change?**
A: Show them the failure statistics. Show them working prototypes. Let data do the convincing. Sometimes you need executive buy-in first.

**Q: What's the right team size for AI projects?**
A: Small - 2-3 people to start. Developer, domain expert, PM who enables rather than gates. Grow as you validate value.

---

*Watch the full talk: [YouTube Recording](https://www.youtube.com/watch?v=JOiUYZhGhH8)*
