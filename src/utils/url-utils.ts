import I18nKey from "@i18n/i18nKey";
import { getTranslation, isEnglishLang } from "@i18n/translation";
import { siteConfig } from "@/config";

export function pathsEqual(path1: string, path2: string): boolean {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlBySlug(slug: string): string {
	return url(`/posts/${slug}/`);
}

export function getTagUrl(tag: string, lang: string = siteConfig.lang): string {
	if (!tag) return getArchiveUrl(lang);
	return `${getArchiveUrl(lang)}?tag=${encodeURIComponent(tag.trim())}`;
}

export function getCategoryUrl(
	category: string | null,
	lang: string = siteConfig.lang,
): string {
	const t = getTranslation(lang);
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === t[I18nKey.uncategorized].toLowerCase()
	)
		return `${getArchiveUrl(lang)}?uncategorized=true`;
	return `${getArchiveUrl(lang)}?category=${encodeURIComponent(category.trim())}`;
}

/** Root URL of the site in a given language (`/` or `/en/`). */
export function getHomeUrl(lang: string = siteConfig.lang): string {
	return isEnglishLang(lang) ? url("/en/") : url("/");
}

/** Archive URL in a given language. */
export function getArchiveUrl(lang: string = siteConfig.lang): string {
	return isEnglishLang(lang) ? url("/en/archive/") : url("/archive/");
}

/** About URL in a given language. */
export function getAboutUrl(lang: string = siteConfig.lang): string {
	return isEnglishLang(lang) ? url("/en/about/") : url("/about/");
}

/**
 * Maps a pathname to its counterpart in another language.
 * Site pages: `/...` <-> `/en/...`; posts: `/posts/x` <-> `/posts/en/x`.
 */
export function getLangUrl(pathname: string, targetLang: string): string {
	if (pathname.startsWith("/posts/")) {
		if (isEnglishLang(targetLang)) {
			return pathname.startsWith("/posts/en/")
				? pathname
				: pathname.replace(/^\/posts\//, "/posts/en/");
		}
		return pathname.replace(/^\/posts\/en\//, "/posts/");
	}
	if (isEnglishLang(targetLang)) {
		return pathname.startsWith("/en/")
			? pathname
			: `/en/${pathname.replace(/^\//, "")}`;
	}
	return pathname.replace(/^\/en\//, "/");
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function getContentDir(id: string): string {
	// In Astro 6 with glob loader, index.md files have IDs without the "index" part
	// e.g., "coding/typescript-type-expansion" instead of "coding/typescript-type-expansion/index"
	// So we need to return the full path as a directory
	if (!id.includes(".") || id.endsWith("/")) {
		return id.endsWith("/") ? id : `${id}/`;
	}
	return getDir(id);
}

export function url(path: string): string {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
