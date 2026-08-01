import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { getTranslation, isEnglishLang } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";
import { siteConfig } from "@/config";

export type PostData = {
	title: string;
	published: Date;
	updated?: Date;
	draft: boolean;
	description: string;
	image: string;
	tags: string[];
	category: string | null;
	lang: string;
	translatedBy: string;
	prevTitle: string;
	prevSlug: string;
	nextTitle: string;
	nextSlug: string;
};

type PostEntry = Omit<CollectionEntry<"posts">, "data"> & { data: PostData };

/** English translations of articles live under the `en/` prefix. */
export function isEnId(id: string): boolean {
	return id.startsWith("en/");
}

/**
 * Retrieve posts of one language and sort them by publication date.
 * `lang` defaults to the site language; English posts are those whose id
 * starts with `en/`.
 */
async function getRawSortedPosts(
	lang: string = siteConfig.lang,
): Promise<PostEntry[]> {
	const targetEnglish = isEnglishLang(lang);
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? (data as PostData).draft !== true : true;
	});

	const filtered = allBlogPosts.filter(
		(post) => isEnId(post.id) === targetEnglish,
	);

	const sorted = filtered.sort((a, b) => {
		const dateA = new Date((a.data as PostData).published);
		const dateB = new Date((b.data as PostData).published);
		return dateA > dateB ? -1 : 1;
	}) as unknown as PostEntry[];
	return sorted;
}

export async function getSortedPosts(
	lang: string = siteConfig.lang,
): Promise<PostEntry[]> {
	const sorted = await getRawSortedPosts(lang);

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].id;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].id;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	id: string;
	data: PostData;
};

/**
 * English translations of articles live under the `en/` prefix, mirroring the
 * Chinese slug (e.g. `coding/foo` <-> `en/coding/foo`). Returns the id of the
 * counterpart in the other language, regardless of whether it exists.
 */
export function getLangSiblingId(id: string): string {
	return isEnId(id) ? id.slice("en/".length) : `en/${id}`;
}
export async function getSortedPostsList(
	lang: string = siteConfig.lang,
): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts(lang);

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		id: post.id,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(
	lang: string = siteConfig.lang,
): Promise<Tag[]> {
	const targetEnglish = isEnglishLang(lang);
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? (data as PostData).draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts
		.filter((post) => isEnId(post.id) === targetEnglish)
		.forEach((post) => {
			(post.data as PostData).tags.forEach((tag) => {
				if (!countMap[tag]) countMap[tag] = 0;
				countMap[tag]++;
			});
		});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(
	lang: string = siteConfig.lang,
): Promise<Category[]> {
	const targetEnglish = isEnglishLang(lang);
	const t = getTranslation(lang);
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? (data as PostData).draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts
		.filter((post) => isEnId(post.id) === targetEnglish)
		.forEach((post) => {
			const postData = post.data as PostData;
			if (!postData.category) {
				const ucKey = t[I18nKey.uncategorized];
				count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
				return;
			}

			const categoryName =
				typeof postData.category === "string"
					? postData.category.trim()
					: String(postData.category).trim();

			count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
		});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c, lang),
		});
	}
	return ret;
}
