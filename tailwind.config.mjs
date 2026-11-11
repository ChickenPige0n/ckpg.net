/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'"Inter Variable"',
					"Inter",
					'"Helvetica Neue"',
					"Helvetica",
					'"PingFang SC"',
					'"Hiragino Sans GB"',
					'"Noto Sans CJK SC"',
					'"Microsoft YaHei"',
					...defaultTheme.fontFamily.sans,
				],
				mono: [
					'"JetBrains Mono Variable"',
					...defaultTheme.fontFamily.mono,
				],
			},
		},
	},
};
