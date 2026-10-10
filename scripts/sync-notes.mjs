// One-way sync: Obsidian vault -> site content.
//   npm run sync-notes
// The vault is the source of truth. Everything this script writes is
// regenerated on every run, so never hand-edit the output files.
//
// Output:
//   src/content/notes/<slug>.md   converted cards (wikilinks, embeds, callouts)
//   src/data/notes-nav.json       sidebar sections/groups (from Home.md) + intro
//   public/notes-img/<slug>.webp  embedded images

import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import sharp from 'sharp';

sharp.cache(false); // don't hold Windows file handles on the outputs

const VAULT = process.env.NOTES_VAULT || 'D:/Sync/All You Need To Know';
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_NOTES = path.join(ROOT, 'src/content/notes');
const OUT_NAV = path.join(ROOT, 'src/data/notes-nav.json');
const OUT_IMG = path.join(ROOT, 'public/notes-img');

// Callouts whose title matches this are dropped (course assignment code).
const STRIP_CALLOUT = /\bCIS\s*\d{4}\b/i;
const MAX_IMG_DIM = 1600;

const slugify = (s) =>
	s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const headingSlug = (s) =>
	s.trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
const escapeHtml = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const defaultTitle = (name) => name.replace(/^std_/, 'std::');

function splitFrontmatter(src) {
	const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!m) return { data: {}, body: src };
	return { data: yaml.load(m[1]) || {}, body: src.slice(m[0].length) };
}

// A running `astro dev` watches the output folders, so never leave a
// half-written file there: skip unchanged files, and write the rest to a temp
// name (not matched by the *.md glob) before renaming over the target.
function writeIfChanged(file, content) {
	if (fs.existsSync(file) && fs.readFileSync(file).equals(Buffer.from(content))) return false;
	const tmp = `${file}.tmp`;
	fs.writeFileSync(tmp, content);
	fs.renameSync(tmp, file);
	return true;
}

// Delete files in dir that this run didn't produce (cards/images removed from the vault).
function removeStale(dir, keep) {
	for (const f of fs.readdirSync(dir)) {
		if (!keep.has(f)) fs.rmSync(path.join(dir, f), { force: true });
	}
}

// Apply fn to the parts of a line that are not inside inline code spans.
function outsideInlineCode(line, fn) {
	return line
		.split(/(`+[^`]*?`+)/)
		.map((part, i) => (i % 2 ? part : fn(part)))
		.join('');
}

// ---------------------------------------------------------------- read vault

const cardsDir = path.join(VAULT, 'Cards');
const homeSrc = fs.readFileSync(path.join(VAULT, 'Home.md'), 'utf8').replace(/\r\n/g, '\n');

// Aliases used in Home.md ([[std_vector|std::vector]]) become display titles.
const homeAliases = new Map();
for (const [, target, alias] of homeSrc.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?\|([^\]]+)\]\]/g)) {
	homeAliases.set(target.trim(), alias.trim());
}

const cards = new Map(); // vault name -> { slug, title, tags, body, mtime }
for (const file of fs.readdirSync(cardsDir)) {
	if (!file.endsWith('.md')) continue;
	const name = file.slice(0, -3);
	const full = path.join(cardsDir, file);
	const { data, body } = splitFrontmatter(fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n'));
	if (data.publish === false) continue;
	cards.set(name, {
		slug: slugify(name),
		title: data.title || homeAliases.get(name) || defaultTitle(name),
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		body,
		mtime: fs.statSync(full).mtime,
	});
}

// Case-insensitive lookup, like Obsidian.
const byLowerName = new Map([...cards].map(([name, c]) => [name.toLowerCase(), c]));
const findCard = (name) => byLowerName.get(name.trim().toLowerCase());

// ------------------------------------------------------------------ images

fs.mkdirSync(OUT_IMG, { recursive: true });

const images = new Map(); // vault filename -> { src, width, height }
async function convertImage(file) {
	if (images.has(file)) return images.get(file);
	const candidates = [path.join(VAULT, file), path.join(VAULT, 'attachments', file)];
	const found = candidates.find((p) => fs.existsSync(p));
	if (!found) return null;
	const outName = slugify(file.replace(/\.[^.]+$/, '')) + '.webp';
	const outPath = path.join(OUT_IMG, outName);
	// Re-encode only when the source is newer than the existing output.
	if (!fs.existsSync(outPath) || fs.statSync(found).mtimeMs > fs.statSync(outPath).mtimeMs) {
		const webp = await sharp(found)
			.resize({ width: MAX_IMG_DIM, height: MAX_IMG_DIM, fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 85 })
			.toBuffer();
		writeIfChanged(outPath, webp);
	}
	const { width, height } = await sharp(outPath).metadata();
	const img = { src: `/notes-img/${outName}`, width, height };
	images.set(file, img);
	return img;
}

// ------------------------------------------------------------- transforms

const report = { broken: new Map(), stripped: [], missingImages: [] };

async function convertInline(line, cardName) {
	// Embeds first: ![[image.png|300]]
	const embeds = [...line.matchAll(/!\[\[([^\]|]+)(?:\|(\d+))?\]\]/g)];
	for (const [match, file, w] of embeds) {
		const img = await convertImage(file.trim());
		if (!img) {
			report.missingImages.push(`${cardName}: ${file}`);
			line = line.replace(match, '');
			continue;
		}
		const width = w ? Number(w) : img.width;
		const height = Math.round((img.height * width) / img.width);
		line = line.replace(
			match,
			`<img src="${img.src}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async" />`,
		);
	}
	// Then links: [[Target#Heading|alias]]. Inside tables the pipe is written
	// as \| — the converted link has no pipe, so the escape can just go.
	return outsideInlineCode(line, (text) =>
		text.replace(/\[\[[^\]]*\]\]/g, (m) => m.replace(/\\\|/g, '|')).replace(/\[\[([^\]|#]*)(?:#([^\]|]*))?(?:\|([^\]]+))?\]\]/g, (_, target, heading, alias) => {
			const card = target ? findCard(target) : cards.get(cardName);
			const label = alias || (card && target ? card.title : target || heading);
			if (!card) {
				const list = report.broken.get(cardName) || [];
				report.broken.set(cardName, [...list, target]);
				return `<span class="wikilink-missing">${escapeHtml(label)}</span>`;
			}
			const hash = heading ? `#${headingSlug(heading)}` : '';
			return `[${label.replace(/[[\]]/g, '\\$&')}](/notes/${card.slug}${hash})`;
		}),
	);
}

async function convertBody(body, cardName) {
	const lines = body.split('\n');
	const out = [];
	let fence = null;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
		if (fence) {
			out.push(line);
			if (fenceMatch && fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length) fence = null;
			continue;
		}
		if (fenceMatch) {
			fence = fenceMatch[1];
			out.push(line);
			continue;
		}

		// Display math. Obsidian renders $$…$$ as a block even when it's glued to
		// the surrounding text; remark-math only does that with its own lines
		// and blank lines around it, otherwise it becomes inline math.
		const oneLineMath = line.match(/^\s*\$\$(.+)\$\$\s*$/);
		if (oneLineMath) {
			out.push('', '$$', oneLineMath[1].trim(), '$$', '');
			continue;
		}
		if (line.trim() === '$$') {
			const math = [];
			while (i + 1 < lines.length && lines[i + 1].trim() !== '$$') math.push(lines[++i]);
			i++; // closing $$
			out.push('', '$$', ...math, '$$', '');
			continue;
		}

		const callout = line.match(/^>\s*\[!(\w+)\]([-+]?)\s*(.*)$/);
		if (callout) {
			const [, type, fold, title] = callout;
			const inner = [];
			while (i + 1 < lines.length && lines[i + 1].startsWith('>')) {
				inner.push(lines[++i].replace(/^> ?/, ''));
			}
			if (STRIP_CALLOUT.test(title)) {
				report.stripped.push(`${cardName}: ${title}`);
				continue;
			}
			const heading = title || type[0].toUpperCase() + type.slice(1);
			const content = await convertBody(inner.join('\n'), cardName);
			out.push(
				`<details class="callout callout-${type.toLowerCase()}"${fold === '-' ? '' : ' open'}>`,
				`<summary>${escapeHtml(heading)}</summary>`,
				'',
				content,
				'',
				'</details>',
			);
			continue;
		}

		out.push(await convertInline(line, cardName));
	}
	return out.join('\n');
}

// ------------------------------------------------------------------ write

fs.mkdirSync(OUT_NOTES, { recursive: true });

let changedCount = 0;
for (const [name, card] of cards) {
	const body = await convertBody(card.body, name);
	const fm = yaml.dump({
		title: card.title,
		tags: card.tags,
		updated: card.mtime.toISOString(),
		source: name,
	});
	if (writeIfChanged(path.join(OUT_NOTES, `${card.slug}.md`), `---\n${fm}---\n\n${body.trim()}\n`)) changedCount++;
}
removeStale(OUT_NOTES, new Set([...cards.values()].map((c) => `${c.slug}.md`)));
removeStale(OUT_IMG, new Set([...images.values()].map((img) => path.basename(img.src))));

// Sidebar, from Home.md, in Home.md order:
//   ## Section   -> labelled section (C++, Graphics & math, ...)
//   ### Group    -> collapsible group inside it
// [[links]] between a "##" and its first "###" are pinned under the section
// label (e.g. Graphics Pipeline Hub). A "##" with no "###" becomes a single
// group. Cards not listed anywhere land in a trailing "More" group.
const SKIP_SECTIONS = new Set(['Browse']);

// Intro = every paragraph between the "# Title" and the first "##", as HTML
// with just `code` and *emphasis* supported.
const intro = homeSrc
	.replace(/^---[\s\S]*?---\n/, '')
	.split(/\n## /)[0]
	.replace(/^# .*\n/, '')
	.trim()
	.split(/\n\s*\n/)
	.map((p) =>
		escapeHtml(p.replace(/\s*\n\s*/g, ' '))
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\*([^*]+)\*/g, '<em>$1</em>'),
	)
	.filter(Boolean);

const listed = new Set();
function linkedCards(text) {
	const items = [];
	for (const [, target] of text.matchAll(/\[\[([^\]|#]+)[^\]]*\]\]/g)) {
		const card = findCard(target);
		if (card && !items.some((it) => it.slug === card.slug)) {
			items.push({ slug: card.slug, title: card.title });
			listed.add(card.slug);
		}
	}
	return items;
}

const sections = [];
for (const chunk of homeSrc.split(/\n## /).slice(1)) {
	const [headingLine, ...rest] = chunk.split('\n');
	const name = headingLine.trim();
	if (SKIP_SECTIONS.has(name)) continue;
	const [preamble, ...groupChunks] = rest.join('\n').split(/\n### /);
	if (!groupChunks.length) {
		const items = linkedCards(preamble);
		if (items.length) sections.push({ name: null, pinned: [], groups: [{ name, items }] });
		continue;
	}
	const pinned = linkedCards(preamble);
	const groups = [];
	for (const chunk of groupChunks) {
		const [groupName, ...body] = chunk.split('\n');
		const items = linkedCards(body.join('\n'));
		if (items.length) groups.push({ name: groupName.trim(), items });
	}
	if (groups.length || pinned.length) sections.push({ name, pinned, groups });
}

const unlisted = [...cards.values()]
	.filter((c) => !listed.has(c.slug))
	.sort((a, b) => a.title.localeCompare(b.title))
	.map((c) => ({ slug: c.slug, title: c.title }));
if (unlisted.length) sections.push({ name: null, pinned: [], groups: [{ name: 'More', items: unlisted }] });

fs.mkdirSync(path.dirname(OUT_NAV), { recursive: true });
writeIfChanged(OUT_NAV, JSON.stringify({ intro, sections }, null, '\t') + '\n');

// ----------------------------------------------------------------- report

const groupCount = sections.reduce((n, sec) => n + sec.groups.length, 0);
console.log(`Synced ${cards.size} cards (${changedCount} changed), ${images.size} images, ${groupCount} groups.`);
if (unlisted.length) console.log(`  ${unlisted.length} card(s) not in Home.md -> "More": ${unlisted.map((c) => c.title).join(', ')}`);
for (const s of report.stripped) console.log(`  stripped callout  ${s}`);
for (const [card, targets] of report.broken) console.log(`  broken link       ${card} -> ${[...new Set(targets)].join(', ')}`);
for (const m of report.missingImages) console.log(`  missing image     ${m}`);
