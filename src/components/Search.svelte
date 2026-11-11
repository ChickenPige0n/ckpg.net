<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { getTranslation } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import { siteConfig } from "@/config";
import type { SearchResult } from "@/global";

export let lang: string = siteConfig.lang;
const t = getTranslation(lang);
const english = lang.toLowerCase().startsWith("en");

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;

const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: {
			title: "This Is a Fake Search Result",
		},
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: {
			title: "If You Want to Test the Search",
		},
		excerpt: "Try running <mark>pnpm build && pnpm preview</mark> instead.",
	},
];

const togglePanel = () => {
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const setPanelVisibility = (show: boolean, isDesktop: boolean): void => {
	const panel = document.getElementById("search-panel");
	if (!panel || !isDesktop) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const search = async (keyword: string, isDesktop: boolean): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false, isDesktop);
		result = [];
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword, {
				filter: { lang: english ? "en" : "zh" },
			});
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
			searchResults = fakeResult;
		} else {
			searchResults = [];
			console.error("Pagefind is not available in production environment.");
		}

		result = searchResults;
		setPanelVisibility(result.length > 0, isDesktop);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(false, isDesktop);
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		if (keywordDesktop) search(keywordDesktop, true);
		if (keywordMobile) search(keywordMobile, false);
	};

	if (import.meta.env.DEV) {
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			initializeSearch();
		});

		setTimeout(() => {
			if (!initialized) {
				initializeSearch();
			}
		}, 2000);
	}
});

$: if (initialized && keywordDesktop) {
	(async () => {
		await search(keywordDesktop, true);
	})();
}

$: if (initialized && keywordMobile) {
	(async () => {
		await search(keywordMobile, false);
	})();
}
</script>

<!-- search bar for desktop view -->
<div
  id="search-bar"
  class="hidden lg:flex transition-all duration-200 items-center h-9 mr-1.5 border border-(--line-divider) focus-within:border-(--ink-strong) bg-transparent"
>
  <Icon
    icon="material-symbols:search"
    class="absolute text-[1.05rem] pointer-events-none ml-2.5 text-(--ink-muted)"
  ></Icon>
  <input
    placeholder={t[I18nKey.search]}
    data-i18n-placeholder="search"
    bind:value={keywordDesktop}
    on:focus={() => search(keywordDesktop, true)}
    class="transition-all duration-200 pl-8 pr-2.5 text-xs bg-transparent outline-0
         h-full w-32 focus:w-52 text-(--ink-strong) placeholder:text-(--ink-faint)"
  />
</div>

<!-- toggle btn for phone/tablet view -->
<button
  on:click={togglePanel}
  aria-label="Search Panel"
  id="search-switch"
  class="btn-plain scale-animation lg:hidden! w-9 h-9"
>
  <Icon icon="material-symbols:search" class="text-[1.15rem]"></Icon>
</button>

<!-- search panel -->
<div
  id="search-panel"
  class="float-panel float-panel-closed search-panel absolute md:w-[28rem]
top-16 left-0 md:left-[unset] right-0 p-2 z-50"
>
  <!-- search bar inside panel for phone/tablet -->
  <div
    id="search-bar-inside"
    class="flex relative lg:hidden transition-all items-center h-9 border border-(--line-divider) focus-within:border-(--ink-strong) mb-1"
  >
    <Icon
      icon="material-symbols:search"
      class="absolute text-[1.05rem] pointer-events-none ml-2.5 text-(--ink-muted)"
    ></Icon>
    <input
      placeholder={t[I18nKey.search]}
      data-i18n-placeholder="search"
      bind:value={keywordMobile}
      class="pl-8 pr-3 absolute inset-0 text-xs bg-transparent outline-0 text-(--ink-strong) placeholder:text-(--ink-faint)"
    />
  </div>

  <!-- search results -->
  <div class="divide-y divide-(--line-divider)">
    {#each result as item}
      <a
        href={item.url}
        class="transition-colors group block px-3 py-2.5 hover:bg-(--btn-plain-bg-hover)"
      >
        <div
          class="text-sm font-semibold text-(--ink-strong) inline-flex items-center gap-1.5 group-hover:text-(--primary) transition-colors"
        >
          <span>{item.meta.title}</span>
          <Icon
            icon="material-symbols:arrow-forward-rounded"
            class="text-[0.875rem] text-(--ink-faint) group-hover:text-(--primary) transition-transform group-hover:translate-x-0.5"
          ></Icon>
        </div>
        <div class="text-xs text-(--ink-muted) mt-0.5 leading-relaxed">
          {@html item.excerpt}
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  input:focus {
    outline: 0;
  }
  .search-panel {
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
</style>
