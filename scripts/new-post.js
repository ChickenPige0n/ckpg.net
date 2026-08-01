/* This is a script to create a new post markdown file with front-matter.
 *
 * Every post on this site exists as a zh original under src/content/posts/
 * and an en translation under src/content/posts/en/, so the language switch
 * on post pages never 404s. This script scaffolds both stubs at once.
 */

import fs from "node:fs";
import path from "node:path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`);
	process.exit(1); // Terminate the script and return error code 1
}

let fileName = args[0];

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i;
if (!fileExtensionRegex.test(fileName)) {
	fileName += ".md";
}

// Strip a leading en/ if the user already included it; the zh original and
// the en mirror are derived from the slug below.
const slug = fileName.replace(/^en\//, "");

const zhPath = path.join("src/content/posts/", slug);
const enPath = path.join("src/content/posts/en/", slug);

const zhExists = fs.existsSync(zhPath);
const enExists = fs.existsSync(enPath);
if (zhExists || enExists) {
	console.error(`Error: ${zhExists ? zhPath : enPath} already exists`);
	process.exit(1);
}

// recursive mode creates multi-level directories
const zhDir = path.dirname(zhPath);
if (!fs.existsSync(zhDir)) {
	fs.mkdirSync(zhDir, { recursive: true });
}
const enDir = path.dirname(enPath);
if (!fs.existsSync(enDir)) {
	fs.mkdirSync(enDir, { recursive: true });
}

const baseName = path.basename(slug, path.extname(slug));

const zhContent = `---
title: ${baseName}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---
`;

const enContent = `---
title: ${baseName}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false
lang: en
translatedBy: ''
---
`;

fs.writeFileSync(zhPath, zhContent);
fs.writeFileSync(enPath, enContent);

console.log(`Created:
  ${zhPath}
  ${enPath}

Both stubs are created as published (draft: false). Keep draft: true on both
files until the post is ready, and remember to translate the en stub.
`);
