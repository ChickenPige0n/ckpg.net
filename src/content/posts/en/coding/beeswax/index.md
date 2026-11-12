---
title: Beeswax
published: 2026-11-12
description: 'A Windows tool for extracting a target speaker from microphone audio.'
image: ./beeswax.webp
tags:
  - tools
  - target-speaker-extraction
  - audio
  - rust
category: 'Coding'
draft: false
lang: en
translatedBy: Codex
---

# Introduction

My dorm room has poor acoustics, and during group meetings or gaming, my microphone would often pick up my roommates' voices. Frustrated, I built this software.

::github{repo="ChickenPige0n/beeswax"}

Its main feature is `Target Speaker Extraction`: using a short enrollment recording, it identifies the target speaker in an incoming audio stream and filters out other interfering sound sources.

The model is [VoxLock](https://huggingface.co/arbazsiddiqui/voxlock). This software wraps the model and currently supports Windows only.

I built it mainly to meet my own needs, and the results have been very good.

If noisy dorms often get in the way, give it a try.
