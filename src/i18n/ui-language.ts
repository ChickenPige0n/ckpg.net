import { getTranslation } from "./translation";

/** localStorage key for the explicit zh/en choice made via the switch. */
export const FULL_LANG_STORAGE = "ckpg-lang";

/** localStorage key for the UI-only language applied from preferences. */
export const UI_LANG_STORAGE = "ckpg-ui-lang";

export function normalizeLang(lang: string): string {
	return lang.toLowerCase().replace(/-/g, "_");
}

/** Languages with a full route (zh_CN, en) vs chrome-only dictionaries. */
export function isFullLang(lang: string): boolean {
	const n = normalizeLang(lang);
	return n === "en" || n === "zh_cn";
}

/**
 * The `ckpg-lang` storage value for a full language ("zh"/"en"), or null for
 * UI-only languages which never touch content routing.
 */
export function fullLangCode(lang: string): string | null {
	const n = normalizeLang(lang);
	if (n === "en") return "en";
	if (n === "zh_cn") return "zh";
	return null;
}

/** All languages with a UI dictionary, in display order for the picker. */
export const UI_LANGS: { code: string; label: string }[] = [
	{ code: "zh_cn", label: "中文" },
	{ code: "en", label: "English" },
	{ code: "ja", label: "日本語" },
	{ code: "zh_tw", label: "繁體中文" },
	{ code: "ko", label: "한국어" },
	{ code: "es", label: "Español" },
	{ code: "id", label: "Bahasa Indonesia" },
	{ code: "th", label: "ไทย" },
	{ code: "vi", label: "Tiếng Việt" },
	{ code: "tr", label: "Türkçe" },
];

/**
 * The dictionary code that applies to a raw language tag, or null when there
 * is no UI dictionary for it. Region variants ("ja-JP", "es-ES", "zh-TW")
 * all canonicalize to the base dictionary code ("ja", "es", "zh_tw") so the
 * result can be compared directly against `UI_LANGS` codes and passed to
 * `getTranslation`.
 */
export function dictLang(lang: string): string | null {
	const n = normalizeLang(lang);
	if (n.startsWith("en")) return "en";
	if (n === "zh_tw") return "zh_tw";
	if (n === "zh" || n === "zh_cn") return "zh_cn";
	if (n.startsWith("es")) return "es";
	if (n.startsWith("ja")) return "ja";
	if (n.startsWith("ko")) return "ko";
	if (n.startsWith("th")) return "th";
	if (n.startsWith("vi")) return "vi";
	if (n.startsWith("tr")) return "tr";
	if (n.startsWith("id")) return "id";
	return null;
}

/**
 * Resolve the language to apply to the UI chrome for this visit: a stored UI
 * choice (any of the ten dictionary languages) wins, otherwise the first
 * browser preference that has a UI dictionary. Returns a canonical dictionary
 * code ("en", "es", "ja", ...) or null when the preference is zh or unknown
 * (keep the default chrome). An English preference returns "en", used on
 * pages without an English mirror where the full-mode redirect cannot happen.
 */
export function resolveUiLang(
	prefs: readonly string[],
	storedUi: string | null,
): string | null {
	if (storedUi) {
		const code = dictLang(storedUi);
		if (code) return code;
	}
	for (const pref of prefs) {
		const code = dictLang(pref);
		if (!code) continue;
		// A plain Chinese preference keeps the default chrome, mirroring the
		// head-script rule that stops the zh -> en upgrade at the first zh
		// preference. (zh_TW resolves above to its own dictionary.)
		if (code === "zh_cn") return null;
		return code;
	}
	return null;
}

/**
 * Replace UI strings marked with `data-i18n` (text) or
 * `data-i18n-placeholder` (placeholder attribute) using the dictionary of
 * the given language. Only writes when the value actually changes, so it is
 * safe to call repeatedly (e.g. from a MutationObserver) without creating
 * feedback loops.
 */
export function applyUiLang(lang: string): void {
	const t = getTranslation(lang) as unknown as Record<string, string>;
	document.querySelectorAll("[data-i18n]").forEach((el) => {
		const key = el.getAttribute("data-i18n");
		if (key && t[key] && el.textContent !== t[key]) {
			el.textContent = t[key];
		}
	});
	document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
		const key = el.getAttribute("data-i18n-placeholder");
		if (key && t[key] && el.getAttribute("placeholder") !== t[key]) {
			el.setAttribute("placeholder", t[key]);
		}
	});
}
