# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start local dev server (http://localhost:4321)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run sync-notes  # Pull Obsidian vault (D:/Sync/All You Need To Know, or $NOTES_VAULT) into the site
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `STEAM_API_KEY` — from steamcommunity.com/dev/apikey
- `STEAM_ID` — 64-bit Steam ID (find at steamid.io)
- `PSN_NPSSO` — PlayStation NPSSO token (log in at playstation.com, then open https://ca.account.sony.com/api/v1/ssocookie); expires ~every 2 months

Required for the Steam/PSN integrations on the About page to work locally.

## Architecture

**Astro 5, static output** deployed to Vercel via `@astrojs/vercel`. Every page is prebuilt at build time; only the `/api/*` routes (marked `export const prerender = false`) run as a Vercel function per request. Dynamic page routes need `getStaticPaths`. No JavaScript framework (React/Vue/Svelte) — pure Astro components with vanilla JS for interactivity.

### Key files

- [src/layouts/Layout.astro](src/layouts/Layout.astro) — master layout; wraps all pages, defines CSS custom properties, fonts, and global styles
- [src/pages/](src/pages/) — file-based routing; each `.astro` file is a page
- [src/pages/api/steam-recent.ts](src/pages/api/steam-recent.ts) — fetches 1 most-recently-played Steam game; 300s cache
- [src/pages/api/steam-img/[appid].ts](src/pages/api/steam-img/[appid].ts) — proxies Steam CDN images; 24h cache
- [src/pages/api/psn-recent.ts](src/pages/api/psn-recent.ts) — fetches 1 most-recently-played PSN game via `psn-api`; 300s cache

### Styling conventions

- CSS lives in scoped `<style>` blocks per component; no CSS framework
- Global design tokens (colors, spacing) are CSS custom properties defined in [Layout.astro](src/layouts/Layout.astro): `--bg`, `--bg-alt`, `--text`, `--muted`, `--border-subtle`, and the accent trio `--accent` (periwinkle `#8b9cff`) / `--accent-hover` / `--accent-soft`
- Dark-only theme; premium dark aesthetic with slate/blue backgrounds and ONE accent hue for links, tags and active states. Use `var(--accent)` or `color-mix(in srgb, var(--accent) N%, transparent)`, never a hard-coded lavender/blue. Brand colors (USC red, Penn blue, PlayStation blue on About) are deliberate exceptions
- The footer row is as wide as the page's title/text column, never its media: pass `<Layout textWidth="40rem">` when a page's text column isn't the default `50rem` (project pages use 40rem). Keep it in sync if that column changes
- Page column widths use `min(NNrem, var(--fluid-width))`; `--fluid-width` (Layout.astro) is 65% of the viewport on desktop and 100% at ≤768px — use it instead of re-deriving the formula
- Responsive via `clamp()` for typography and `@media (max-width: 640px)` breakpoints
- Always include `@media (prefers-reduced-motion: reduce)` when adding animations

### Interactivity pattern

Interactive features use `<script is:inline>` blocks within the page that did the feature. Current examples:
- **Image zoom lightbox** (about.astro) — desktop-only; `data-no-zoom` attribute opts out
- **Steam game fetch** (about.astro) — client-side fetch to `/api/steam-recent`, injects HTML
- **Copy BattleTag** (about.astro) — copy-to-clipboard button

### Content

Portfolio cards read title/date/tech/description/image from each project's MDX frontmatter (single source of truth). [src/pages/portfolio.astro](src/pages/portfolio.astro) only holds `sectionOrder` — which section each project slug sits in and its order; a new project must be added there or it won't show (the build logs a warning).

**Project pages** ([src/pages/portfolio/[slug].astro](src/pages/portfolio/[slug].astro)) render `src/content/projects/<slug>/index.mdx`. Text stays in a 40rem column at 1.1rem (~70 characters per line, a deliberate reading measure); the frontmatter `image` becomes a Steam-style banner (crisp, full window width via `100vw` — Layout's `.page` has `overflow-x: clip` to absorb the scrollbar overshoot — with title + description overlaid on a darkened left side), and project MDX can wrap media in `<Wide>…</Wide>` ([src/components/mdx/Wide.astro](src/components/mdx/Wide.astro), passed in via `components`, no import needed) to break out to 50rem. Plain Markdown images stay within the text width and max 24rem tall (click-to-zoom shows full size). Alt text isn't visible, so for a caption wrap the image in `<Figure caption="…">` ([src/components/mdx/Figure.astro](src/components/mdx/Figure.astro), same sizing) or use `<Wide caption="…">`. Widths: text/images 40, `<Wide>` 50, banner full. Play/GitHub/video links go in frontmatter `links: [{ label, url, icon? }]` (icon: download | play | github | video) and render as buttons under the banner description via [src/components/ProjectLinks.astro](src/components/ProjectLinks.astro).

**Notes** come from an Obsidian vault via [scripts/sync-notes.mjs](scripts/sync-notes.mjs), which regenerates `src/content/notes/*.md`, `src/data/notes-nav.json` (sidebar, parsed from the vault's Home.md `##`/`###` headings) and `public/notes-img/`. Never hand-edit those outputs — edit the vault and re-sync. The script converts wikilinks/embeds/callouts, drops callouts whose title names a course (`CIS ####`), and skips cards with `publish: false`. Pages ([src/pages/notes/](src/pages/notes/)) are prerendered and use `<ClientRouter />` (via Layout's `head` slot) so the persisted sidebar survives card-to-card navigation.
