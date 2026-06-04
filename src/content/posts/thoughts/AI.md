---
title: 泛谈AI
published: 2026-06-04
description: ''
image: ''
tags: ["LLM", "AI", "Transformer", "thoughts"]
category: 'Thoughts'
draft: false 
lang: ''
---

分享一下自己的浅薄想法

稍微谈谈AI ~~其实是LLM~~

# 记忆系统
当前的前沿探索主要有两个方向：
+ 通过扩展上下文窗口增强短期记忆能力
+ 通过外部工具如 RAG / VDB / harness 提供持久化记忆

可是这与人类的记忆系统差别很大，我们在学习时不会记住所有完全的信息，再在其中进行检索，这中间是有一步抽象的过程的。

Transformer通过上下文实现的上下文内记忆是不可持续扩展的
+ Compact也是一种抽象过程，基于文本的抽象和心智模型/高层抽象表示有本质不同，它们相对于模型是完全外置的
+ 模型在上下文中学习的能力不强（存在统计惯性、[RLHF](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback)偏好影响），时常发生运行时的灾难性遗忘和对代码库语义理解的偏差

不断对上下文窗口的扩展是在试图忽略房间里的大象：

## [在线学习](https://en.wikipedia.org/wiki/Online_machine_learning)
目前对于离线学习的LLM，他们有很多缺点：

**缺少行动能力**，我们当然可以说目前的Agent已经在很大程度上模拟了人类行为，但这里讨论的是不可避免的劣势

**难以做到完美的多模态**，灾难性遗忘，MCP、各种Tool、Skill的发明都在为这一缺陷擦屁股。
幽默的是，大家为Agent做a11y的动力远大于给残疾人做a11y的动力，而Agent实际上比残疾人强不到哪里去。

主体性缺失，依赖人类指引，上下文有限而人类之需求无限，而LLM无法更新知识且具有惰性（在参数中固化的知识和调用工具时的新知识很不一样，模型大概更倾向使用已经习得的知识），有时写出了很bad smell的代码，模型"知道"这不好，但仍然选择直接输出。

如何在学习新数据时也能产生记忆互动？

## 我们真的需要这么多数据集吗？
人类不需要学习非常多（相对LLM数据集来说）的数据集以获取对其中概念的理解

这种极其强大的[One-shot learning](https://en.wikipedia.org/wiki/One-shot_learning_(computer_vision))能力要如何实现呢。


# 可解释性
Transformer是如何学到知识的？我们能从它的架构中提取什么经验？


抱歉写的很胡言乱语，谢谢你能读到这里