---
title: Beeswax 
published: 2026-11-12
description: '麦克风讲话人过滤软件'
image: ./beeswax.webp
tags: 
  - tools
  - target-speaker-extraction
  - audio
  - rust
category: 'Coding'
draft: false 
lang: ''
---

# 介绍

宿舍的收音条件不太好，开组会或玩游戏时麦克风经常被舍友的声音干扰，于是一气之下开发出了此软件

::github{repo="ChickenPige0n/beeswax"}

主要的功能就是 `Target Speaker Extraction`，即`目标讲话人提取`，通过预先录制的一段注册音频 ~~滴血认主~~ 识别提取输入音频流中的目标讲话人，并剔除其他干扰声源。

模型为 [VoxLock](https://huggingface.co/arbazsiddiqui/voxlock)，软件是对此模型的封装，目前只支持 Windows。

基本上是为我个人需求开发的，效果还是非常不错的。

推荐经常被宿舍嘈杂困扰的朋友们尝试使用。