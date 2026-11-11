<script lang="ts">
import { onMount } from "svelte";
import { siteConfig } from "../config";
import I18nKey from "../i18n/i18nKey";
import { getTranslation } from "../i18n/translation";
import { getPostUrlBySlug } from "../utils/url-utils";

export let tags: string[];
export let categories: string[];
export let lang: string = siteConfig.lang;
export let sortedPosts: Post[] = [];

const t = getTranslation(lang);
const countLabel = (n: number) =>
	n === 1 ? t[I18nKey.postCount] : t[I18nKey.postsCount];

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface Post {
	id: string;
	data: {
		title: string;
		tags: string[];
		category?: string | null;
		published: Date;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups: Group[] = [];

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}.${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

onMount(async () => {
	let filteredPosts: Post[] = sortedPosts;

	if (tags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) => post.data.category && categories.includes(post.data.category),
		);
	}

	if (uncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;
});
</script>

<div>
  <div class="mb-6 pb-3 border-b border-(--ink-strong) flex items-baseline justify-between swiss-rule-animate">
    <div class="flex flex-wrap items-center gap-2">
      <h1 class="swiss-label text-(--ink-strong)" data-i18n="archive">{t[I18nKey.archive]}</h1>
      {#if categories.length > 0}
        <span class="swiss-label text-(--primary)">/ {categories.join(", ")}</span>
      {/if}
      {#if tags.length > 0}
        <span class="swiss-label text-(--primary)">/ #{tags.join(" #")}</span>
      {/if}
    </div>
  </div>

  <div class="space-y-10">
    {#each groups as group}
      <section class="grid grid-cols-1 md:grid-cols-[7.5rem_minmax(0,1fr)] gap-y-3 md:gap-x-6 items-start">
        <div class="flex md:flex-col items-baseline justify-between md:justify-start pt-2 border-t border-(--line-color) md:border-t-0">
          <div class="swiss-num text-2xl font-bold tracking-tight text-(--ink-strong)">
            {group.year}
          </div>
          <div class="swiss-num text-xs text-(--ink-muted) mt-0.5">
            {String(group.posts.length).padStart(2, "0")} {countLabel(group.posts.length)}
          </div>
        </div>

        <div class="divide-y divide-(--line-divider) border-t border-b border-(--line-divider)">
          {#each group.posts as post}
            <a
              href={getPostUrlBySlug(post.id)}
              aria-label={post.data.title}
              class="group grid grid-cols-[3.5rem_minmax(0,1fr)] sm:grid-cols-[4rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-3.5 px-2 -mx-2 hover:bg-(--btn-card-bg-hover) transition-colors duration-200"
            >
              <span class="swiss-num text-xs text-(--ink-muted)">
                {formatDate(post.data.published)}
              </span>

              <span class="font-medium text-(--ink-strong) group-hover:text-(--primary) transition-colors duration-200 whitespace-nowrap text-ellipsis overflow-hidden">
                {post.data.title}
              </span>

              <span class="hidden sm:block swiss-num text-xs text-(--ink-faint) whitespace-nowrap text-ellipsis overflow-hidden max-w-44 text-right">
                {formatTag(post.data.tags)}
              </span>
            </a>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</div>
