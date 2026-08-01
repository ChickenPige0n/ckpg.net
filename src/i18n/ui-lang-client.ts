import {
	applyUiLang,
	FULL_LANG_STORAGE,
	fullLangCode,
	isFullLang,
	resolveUiLang,
	UI_LANG_STORAGE,
} from "./ui-language";

/**
 * The language currently effective for the UI chrome: an explicit UI pick
 * (ckpg-ui-lang) wins, otherwise the first browser preference with a
 * dictionary, otherwise the page's own language.
 */
export function currentUiLang(): string {
	let prefs: string[] = [];
	let storedUi: string | null = null;
	try {
		storedUi = localStorage.getItem(UI_LANG_STORAGE);
		prefs = navigator.languages?.length
			? [...navigator.languages]
			: [navigator.language || ""];
	} catch {
		/* ignore */
	}
	const pageLang =
		document.documentElement.getAttribute("data-page-lang") || "";
	const english = pageLang.toLowerCase().startsWith("en");
	return resolveUiLang(prefs, storedUi) || (english ? "en" : "zh_cn");
}

/**
 * Reflect a UI language choice in every language picker on the page (the
 * desktop navbar globe and the mobile menu) by moving the highlight and the
 * check mark. Scoped to `[data-ui-lang]` buttons so it never touches other
 * chrome.
 */
export function syncUiLangSelection(code: string): void {
	document.querySelectorAll("[data-ui-lang]").forEach((btn) => {
		const c = btn.getAttribute("data-ui-lang");
		const chk = btn.querySelector(".ui-lang-check");
		if (chk) chk.classList.toggle("hidden", c !== code);
		btn.classList.toggle("current-theme-btn", c === code);
	});
}

/**
 * Apply an explicit UI language choice (from the navbar globe picker or the
 * mobile menu). Full languages (zh_CN, en) also pin the content language and
 * navigate to the counterpart route when one exists; UI-only languages just
 * swap the chrome and drop any previous content-language pin so the explicit
 * UI choice governs. Every picker highlight follows immediately.
 */
export function selectUiLang(code: string): void {
	const pageLang =
		document.documentElement.getAttribute("data-page-lang") || "";
	const english = pageLang.toLowerCase().startsWith("en");
	const switchHref =
		document.documentElement.getAttribute("data-lang-switch-href") || "";

	try {
		localStorage.setItem(UI_LANG_STORAGE, code);
		if (isFullLang(code)) {
			const full = fullLangCode(code);
			if (full) {
				localStorage.setItem(FULL_LANG_STORAGE, full);
			}
			const target =
				code === "en" ? (english ? "" : switchHref) : english ? switchHref : "";
			if (target && target !== location.pathname) {
				syncUiLangSelection(code);
				location.assign(target);
				return;
			}
		} else {
			localStorage.removeItem(FULL_LANG_STORAGE);
		}
	} catch {
		/* ignore */
	}
	applyUiLang(code);
	syncUiLangSelection(code);
}
