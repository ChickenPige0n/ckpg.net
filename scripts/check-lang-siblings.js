/* Verifies that every non-draft post has a counterpart in the other
 * supported language (zh original <-> en mirror under posts/en/).
 *
 * The language switch on post pages links to the sibling only when it exists,
 * so a missing sibling silently hides the switch. This check fails the build
 * (via the prebuild lifecycle) so a zh-only or en-only post cannot be
 * published by accident. A sibling that exists but is still a draft only
 * warns: the switch will be hidden in production until it is published.
 */

import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = "src/content/posts";

/** Naive frontmatter parser: enough to read `draft`/`lang` scalars. */
function readFrontmatter(filePath) {
	const text = fs.readFileSync(filePath, "utf8");
	const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};
	const frontmatter = {};
	for (const line of match[1].split(/\r?\n/)) {
		const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
		if (m) frontmatter[m[1]] = m[2];
	}
	return frontmatter;
}

function isDraft(frontmatter) {
	return (
		typeof frontmatter.draft === "string" &&
		frontmatter.draft.trim().toLowerCase() === "true"
	);
}

function walk(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...walk(full));
		else if (/\.(md|mdx)$/.test(entry.name)) out.push(full);
	}
	return out;
}

const posts = walk(POSTS_DIR);
const missing = [];
const draftWarnings = [];

for (const file of posts) {
	const rel = path.relative(POSTS_DIR, file);
	const isEn = rel.startsWith("en/");
	const zhRel = isEn ? rel.slice("en/".length) : rel;
	const enRel = isEn ? rel : `en/${rel}`;

	const frontmatter = readFrontmatter(file);
	if (isDraft(frontmatter)) continue;

	const siblingPath = isEn
		? path.join(POSTS_DIR, zhRel)
		: path.join(POSTS_DIR, enRel);

	if (!fs.existsSync(siblingPath)) {
		missing.push(
			`${rel} -> ${isEn ? zhRel : enRel} (${isEn ? "zh" : "en"} sibling missing)`,
		);
		continue;
	}
	if (isDraft(readFrontmatter(siblingPath))) {
		draftWarnings.push(
			`${rel} is published but its sibling ${isEn ? zhRel : enRel} is still a draft`,
		);
	}
}

for (const w of draftWarnings) {
	console.warn(`WARN: ${w}`);
}

if (missing.length) {
	console.error("Missing language siblings:");
	for (const m of missing) console.error(`  - ${m}`);
	console.error(
		"Every published post should exist in both zh and en so the language switch never disappears.",
	);
	process.exit(1);
}

console.log(`OK: all ${posts.length} posts have zh/en language siblings.`);
