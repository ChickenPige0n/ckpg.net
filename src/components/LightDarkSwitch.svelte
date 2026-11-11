<script lang="ts">
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import I18nKey from "@i18n/i18nKey";
import { getTranslation } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from "@utils/setting-utils.ts";
import { onMount } from "svelte";
import { siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
let { lang = siteConfig.lang }: { lang?: string } = $props();
const t = getTranslation(lang);
let mode: LIGHT_DARK_MODE = $state(AUTO_MODE);

onMount(() => {
	mode = getStoredTheme();
	const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
	const changeThemeWhenSchemeChanged: Parameters<
		typeof darkModePreference.addEventListener<"change">
	>[1] = (_e) => {
		applyThemeToDocument(mode);
	};
	darkModePreference.addEventListener("change", changeThemeWhenSchemeChanged);
	return () => {
		darkModePreference.removeEventListener(
			"change",
			changeThemeWhenSchemeChanged,
		);
	};
});

function switchScheme(newMode: LIGHT_DARK_MODE) {
	mode = newMode;
	setTheme(newMode);
}

function toggleScheme() {
	let i = 0;
	for (; i < seq.length; i++) {
		if (seq[i] === mode) {
			break;
		}
	}
	switchScheme(seq[(i + 1) % seq.length]);
}

function showPanel() {
	const panel = document.querySelector("#light-dark-panel");
	panel?.classList.remove("float-panel-closed");
}

function hidePanel() {
	const panel = document.querySelector("#light-dark-panel");
	panel?.classList.add("float-panel-closed");
}
</script>

<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
  <button
    aria-label="Light/Dark Mode"
    role="menuitem"
    class="relative btn-plain scale-animation h-9 w-9"
    id="scheme-switch"
    onclick={toggleScheme}
    onmouseenter={showPanel}
  >
    <div class="absolute" class:opacity-0={mode !== LIGHT_MODE}>
      <Icon
        icon="material-symbols:wb-sunny-outline-rounded"
        class="text-[1.15rem]"
      ></Icon>
    </div>
    <div class="absolute" class:opacity-0={mode !== DARK_MODE}>
      <Icon
        icon="material-symbols:dark-mode-outline-rounded"
        class="text-[1.15rem]"
      ></Icon>
    </div>
    <div class="absolute" class:opacity-0={mode !== AUTO_MODE}>
      <Icon
        icon="material-symbols:radio-button-partial-outline"
        class="text-[1.15rem]"
      ></Icon>
    </div>
  </button>

  <div
    id="light-dark-panel"
    class="hidden lg:block absolute transition float-panel-closed top-9 right-0 pt-3"
  >
    <div class="float-panel p-1.5 min-w-36">
      <button
        class="flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation h-8 px-2.5 text-xs font-medium mb-0.5"
        class:current-theme-btn={mode === LIGHT_MODE}
        onclick={() => switchScheme(LIGHT_MODE)}
      >
        <Icon
          icon="material-symbols:wb-sunny-outline-rounded"
          class="text-[1rem] mr-2.5"
        ></Icon>
        <span data-i18n="lightMode">{t[I18nKey.lightMode]}</span>
      </button>
      <button
        class="flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation h-8 px-2.5 text-xs font-medium mb-0.5"
        class:current-theme-btn={mode === DARK_MODE}
        onclick={() => switchScheme(DARK_MODE)}
      >
        <Icon
          icon="material-symbols:dark-mode-outline-rounded"
          class="text-[1rem] mr-2.5"
        ></Icon>
        <span data-i18n="darkMode">{t[I18nKey.darkMode]}</span>
      </button>
      <button
        class="flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation h-8 px-2.5 text-xs font-medium"
        class:current-theme-btn={mode === AUTO_MODE}
        onclick={() => switchScheme(AUTO_MODE)}
      >
        <Icon
          icon="material-symbols:radio-button-partial-outline"
          class="text-[1rem] mr-2.5"
        ></Icon>
        <span data-i18n="systemMode">{t[I18nKey.systemMode]}</span>
      </button>
    </div>
  </div>
</div>
