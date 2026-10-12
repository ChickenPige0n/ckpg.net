---
title: Alien Mind
published: 2026-09-15
description: ''
image: ''
tags:
  - LLM
  - Abstract
category: 'Thoughts'
draft: false
lang: en
translatedBy: deepseek-v4.1-flash
---

Today's mainstream LLMs are Transformer-based Next Token Prediction machines: they inject world knowledge by pretraining on massive corpora, then use SFT to reshape their output into a conversational style, and finally, through post-training methods such as RLHF and RLVR, align with human preferences, control safety risks, improve tool-call correctness, enhance generalization, and build `long-horizon agentic coding ability`.


On various occasions, at different times and in different places, I have voiced my dissatisfaction with the intelligence level of AI / LLMs / Agents more than once. Intelligence is a broad word; Wikipedia defines it as follows:

>Intelligence refers to the general mental capacity of living beings. This capacity includes the following: reasoning, understanding, planning, problem solving, abstraction, expressing ideas, as well as the abilities of language and learning. Although the definition and importance of intelligence remain debated, especially in mainstream publications, researchers are still able to hold consensus on quite a few intelligence-related questions.

People lump most of their quantifiable and non-quantifiable evaluation criteria under this single concept, yet when we observe artificial intelligence along different dimensions of intelligence, we find that although it far surpasses humans in some respects — the size of its knowledge base, the speed of its thinking, its imitative ability, its capacity to rapidly self-replicate, Astra's multimodal precise understanding that far exceeds human experts — it falls short of expectations in others. These range from the [how many r's are in strawberry question](https://www.jevradar.com/projects/can-typesafeai-jev-count-the-r-s-in-strawberry) that "hallucination-free models" like Jev can still be dragged out and grilled on, to 9.8 vs 9.11 and the car wash problem, all the way to commonsense hallucinations, knowledge cutoffs that cannot be updated in time, and difficulties in aligning with human preferences and jailbreak issues. This is what is called `Jagged Intelligence`


![Jagged Intelligence](jagged_intelligence.png)


The severe deviation of artificial intelligence from humans on different measures of intelligence is determined by its training method and internal structure being completely different from ours — the so-called [Alien Mind](https://openai.com/index/an-alien-mind/).

# Born Human

According to information found online, the human brain has about $8.6\times10^{10}$ neurons, and between those neurons there are about $10^{14}$ to $10^{15}$ synaptic connections. Some research points out that, considering the complexity of protein conformations, a single synapse can store about 4.7 bits of information. Calculated this way, the storage capacity of an entire human brain can reach about $9.1\times10^{14}$ bytes (910 TB).

Current frontier AI models, taking Astra as an example, have about 10 trillion, i.e. $1.0\times10^{13}$, parameters.

In the course of evolution, humans gradually formed highly specialized cognitive structures, and these structures shaped our unique form of intelligence.

# Long-Term Memory and Online Learning

One of humans' most remarkable advantages is powerful **long-term memory** and **few-shot learning**. A baby only needs to see a "cat" a few times to build up a concept of cats and to keep recognizing cats of every breed in the future. This ability depends on the brain's online learning mechanism — we do not need to retrain the entire neural network; instead, through cooperation between the hippocampus and the neocortex, short-term experience is rapidly consolidated into long-term memory.

More importantly, human memory has **relatedness** and **connectivity**. When we recall one thing, related memories are automatically activated — smelling a certain fragrance may evoke childhood memories, seeing a mathematical formula may bring physical applications to mind. This networked structure of memory lets us **make flexible use of** knowledge, calling on and updating past experience in new situations. This is also the **generalization** ability that LLMs need.

By contrast, current LLMs lack a genuine long-term memory mechanism. Although RAG (Retrieval-Augmented Generation) and long-context techniques provide a kind of "memory", this is more like consulting external notes than internalized knowledge. A model cannot truly "remember" its conversation with you, and cannot keep learning and growing beyond that conversation.

# Hierarchical Abstraction and Working Memory

Humans are good at building **hierarchical abstractions**. We can think about the same problem at different levels of abstraction — from concrete code implementation, to design patterns, to architectural principles, and finally to philosophical trade-offs. This ability lets us naturally build a comprehensive understanding of an object, and freely move our attention across abstraction levels as we think. During learning, the human brain automatically extracts visual information through abstraction into a hierarchy of characters, words, sentences, and passages, and thus can naturally move attention down to the character level to handle the question of how many r's there are in strawberry.

However, human **working memory** is limited — the psychologist George Miller's classic research pointed out that humans can only hold 7±2 "chunks" in working memory at the same time. This limitation instead became the motivation for humans to engage in abstract cognitive activity: it forces us to abstract, compress, modularize, and create hierarchical knowledge structures.


# Agency, World Models, and Embodied Cognition

Humans possess **agency** — we are independent actors with self-awareness, intentions, and goals. This agency is rooted in our internal **world model** of the world. From infancy onward, we build an understanding of causality, physical laws, and social rules through interaction with the physical world. This world model is **embodied** — we understand the world through bodily perception and action.

Personally, I think the most important thing in RSI is the Self, that is, the ability to improve one's own performance according to one's own needs, which requires extremely strong metacognition / introspection, or in other words self-awareness. The alignment of current AI models relies on values and intentions manually injected by humans; models are rarely able to be aware of their own state and to produce autonomous, responsible actions with agency.

LLMs lack embodied experience. They have never touched an object, felt gravity, or experienced the passage of time. Although multimodal models can process visual and auditory input, this is still processing at the symbolic level rather than genuine perceptual experience. As a result, LLMs perform unstably in commonsense reasoning, physical intuition, social interaction, and other areas.

# Tokens, the Medium of Thought, and the Boundaries of Abstraction

Human thought is not purely linguistic. Our thinking involves visual imagery, spatial relations, motor sensations, and emotional experience — all of which are **high-dimensional**, **continuous** representations. When we turn thought into language, **lossy compression** necessarily occurs. Many subtle feelings, intuitions, and sudden insights are hard to express precisely in words — this is the so-called "only understandable in the mind, not expressible in words".

In linguistics, Saussure distinguished the **signifier** (the form of the sign) from the **signified** (the meaning of the sign). For humans, language is a **pointer** to a richer internal representation; but for an LLM, tokens themselves are the whole of its thought. The model has no "inner experience" beyond tokens — its world is the token sequence.

This difference leads to a fundamental **boundary of thought**. Some concepts that humans can understand may not be adequately representable in token space, and the learnable statistical distribution exhibited by tokens may omit important authorial experience and intent; conversely, some patterns that LLMs discover in high-dimensional vector space may also exceed the expressive capacity of human language.


# The Hypothesis–Experiment–Verification Loop

One mechanism of human learning is the **hypothesis–experiment–verification loop**. We put forward a hypothesis, test it in the real world, and adjust our understanding according to the feedback. This process is active, interactive, and gradual. A child learns the concept of "hot" not only through linguistic description, but through touching hot water, feeling pain, and building a causal connection.

Current LLM training is offline and batch-based. Models are trained on static datasets and cannot interact with and verify against the real world in real time. Although RLHF introduces human feedback, this is still delayed and indirect. Models cannot quickly adjust their behavior through real-time trial and error the way humans do.

Agent systems try to bridge this gap by having LLMs interact with tools and environments to form a closed loop. But this is still limited by the nature of token sequences — every interaction requires a complete reasoning cycle, and it cannot achieve the kind of fast, automatic, reflexive adjustment that humans have.

[Theory is all you need](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4737265)


# Parallel I/O and Thought

The human brain is a highly parallel system. We can simultaneously:
- consciously think about a problem
- process perceptual information subconsciously
- automatically carry out skilled motor tasks
- integrate memory and emotion in the background

This **asynchronous I/O** capability lets humans handle complex multitasking scenarios efficiently. When you drive, your motor system automatically handles steering and braking, your perceptual system continuously monitors road conditions, and your higher-level cognitive system can hold a conversation or think about other problems.

LLM inference is completely synchronous and serialized. The generation of each token depends on the previous token; there is no real "background thinking" or "incubation period". Although Chain of Thought or recurrent Transformers introduce a kind of "reasoning step", this is still an explicit, linear process, lacking the multi-level parallelism of human thought. Its input and output are always conducted in half-duplex.

One of the most mysterious phenomena in human intelligence is the **'Aha' Moment** — after thinking about a problem for a long time, the answer suddenly emerges at an unexpected moment. This phenomenon reveals the **asynchronous** and **subconscious** character of human thought.

When we "think of the answer in our sleep" or "get a flash of inspiration in the shower", the brain is in fact continuing to process the problem in the background. This distributed, asynchronous cognitive processing lets humans work in parallel at different levels of thought — consciously focusing on one task while subconsciously integrating information, looking for patterns, and recombining concepts.


#
I write whatever comes to mind, and it's written very fragmentarily.
