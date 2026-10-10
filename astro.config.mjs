// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkNotesBreaks from './src/lib/remark-notes-breaks.mjs';

// https://astro.build/config
export default defineConfig({
	// Pages are prebuilt; only routes with `prerender = false` (the /api endpoints) run on Vercel per request.
	output: 'static',
	adapter: vercel(),
	integrations: [mdx()],
	markdown: {
		// Math is rendered to HTML at build time; pages only ship KaTeX's CSS.
		remarkPlugins: [remarkMath, remarkNotesBreaks],
		rehypePlugins: [rehypeKatex],
	},
});
