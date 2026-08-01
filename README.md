# ChickenPige0n's Blog (ckpg.net)

Source code for [ckpg.net](https://ckpg.net), the personal blog of ChickenPige0n.
A static site for writing about coding, tools, and whatever else comes to mind.

The site is built with [Astro](https://astro.build) and is a heavily customized
fork of the [Fuwari](https://github.com/saicaca/fuwari) blog template.

## Tech Stack

- [Astro](https://astro.build) 7 with the Cloudflare adapter (deployed to Workers)
- [Tailwind CSS](https://tailwindcss.com) 4 + [Stylus](https://stylus-lang.com)
- [Svelte](https://svelte.dev) 5 for interactive widgets
- [Swup](https://swup.js.org) for smooth page transitions
- [Pagefind](https://pagefind.app/) for full-text search
- [Expressive Code](https://expressive-code.com) for code blocks
- [KaTeX](https://katex.org) for math, [Typst](https://typst.app) via astro-typst for Typst rendering
- [PhotoSwipe](https://photoswipe.com) for image lightboxes
- [Biome](https://biomejs.dev) for linting and formatting

## Getting Started

```sh
pnpm install     # install dependencies
pnpm dev         # start the dev server at localhost:4321
```

## Commands

| Command                    | Action                                       |
|:---------------------------|:---------------------------------------------|
| `pnpm dev`                 | Start the local dev server                   |
| `pnpm build`               | Build the site and the Pagefind index to `dist/` |
| `pnpm preview`             | Preview the production build locally         |
| `pnpm preview:cf`          | Preview the Cloudflare Worker build locally  |
| `pnpm check`               | Run `astro check` for type/astro errors      |
| `pnpm type-check`          | Run `tsc --noEmit`                           |
| `pnpm lint`                | Lint and fix with Biome                      |
| `pnpm format`              | Format with Biome                            |
| `pnpm new-post <filename>` | Scaffold a new post in `src/content/posts/`  |

## Writing Posts

Posts live in `src/content/posts/` as Markdown (`.md`) or MDX (`.mdx`) files.
Create one with `pnpm new-post posts/my-post` and edit the frontmatter:

```yaml
---
title: My First Blog Post
published: 2026-08-01
updated: 2026-08-02        # optional
description: A short summary.
image: cover.png           # optional, relative to the post directory
tags:
  - astro
category: Coding
draft: false
lang: ''                   # set only if the post language differs from the site language
translatedBy: ''           # optional; credit the model that translated the post
---
```

### Writing Posts in Chinese and English

The site's default language is Chinese (`zh_CN`, configured in `src/config.ts`).
Articles can be written in either language:

- **Chinese** posts live anywhere under `src/content/posts/`. `lang` can be left
  empty (it defaults to the site language).
- **English** posts live under `src/content/posts/en/`, mirroring the Chinese
  slug, and set `lang: en` in the frontmatter. If the post is a machine
  translation, credit the model in `translatedBy` (e.g.
  `translatedBy: deepseek-v4-flash`), which shows a badge on the post page.

When a sibling exists in the other language (e.g. `coding/foo` and
`en/coding/foo`), the post page automatically shows a language switch linking
to the counterpart. The `<html lang>`, JSON-LD `inLanguage`, and the post-page
UI strings (word count, reading time, license block) all follow the post's own
language.

The English versions of the site pages live under `/en/`: the home page
(`/en/`), archive (`/en/archive/`), and about (`/en/about/`, content in
`src/content/spec/en/about.md`). On English pages the whole chrome (navbar,
sidebar widgets, search, pagination) switches to English, and lists only show
English posts. Visitors can also pick an interface language from the globe
button in the navbar (or the mobile menu) so the site chrome reads in their
language, independently of the article language.

Beyond standard GitHub Flavored Markdown, the site supports:

- Admonitions (`::note`, `::tip`, `::important`, `::caution`, `::warning`)
- GitHub repository cards (`::github{repo="user/repo"}`)
- Math with KaTeX, and Typst code blocks via astro-typst
- Collapsible sections, line numbers, and language badges in code blocks

## Configuration

Site-wide settings (title, profile, navigation, license, theme) live in
`src/config.ts`. Content collections are defined in `src/content.config.ts`,
and the i18n strings are under `src/i18n/languages/`.

## Deployment

The site builds to a static site plus a Cloudflare Worker runtime
(`@astrojs/cloudflare` adapter). The `wrangler.toml` at the repo root configures
the Worker for local preview; CI builds with `pnpm build` (which also generates
the Pagefind search index into `dist/client/pagefind`).

## License

The code in this repository is licensed under the [MIT License](LICENSE).
The content of the posts is licensed separately; see the license notice shown
on each post.
