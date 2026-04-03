# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start local dev server (http://localhost:4321)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `STEAM_API_KEY` — from steamcommunity.com/dev/apikey
- `STEAM_ID` — 64-bit Steam ID (find at steamid.io)

Required for the Steam integration on the About page to work locally.

## Architecture

**Astro 5 in server/SSR mode** deployed to Vercel via `@astrojs/vercel`. No JavaScript framework (React/Vue/Svelte) — pure Astro components with vanilla JS for interactivity.

### Key files

- [src/layouts/Layout.astro](src/layouts/Layout.astro) — master layout; wraps all pages, defines CSS custom properties, fonts, and global styles
- [src/pages/](src/pages/) — file-based routing; each `.astro` file is a page
- [src/pages/api/steam-recent.ts](src/pages/api/steam-recent.ts) — fetches 1 most-recently-played Steam game; 300s cache
- [src/pages/api/steam-img/[appid].ts](src/pages/api/steam-img/[appid].ts) — proxies Steam CDN images; 24h cache

### Styling conventions

- CSS lives in scoped `<style>` blocks per component; no CSS framework
- Global design tokens (colors, spacing) are CSS custom properties defined in [Layout.astro](src/layouts/Layout.astro): `--bg`, `--bg-alt`, `--accent`, `--text`, `--muted`, `--border-subtle`
- Dark-only theme; premium dark aesthetic with slate/blue/purple accents
- Responsive via `clamp()` for typography and `@media (max-width: 640px)` breakpoints
- Always include `@media (prefers-reduced-motion: reduce)` when adding animations

### Interactivity pattern

Interactive features use `<script is:inline>` blocks within the page that did the feature. Current examples:
- **Image zoom lightbox** (about.astro) — desktop-only; `data-no-zoom` attribute opts out
- **Steam game fetch** (about.astro) — client-side fetch to `/api/steam-recent`, injects HTML
- **Copy BattleTag** (about.astro) — copy-to-clipboard button

### Content

Portfolio items are hardcoded objects directly in [src/pages/portfolio.astro](src/pages/portfolio.astro). The `/src/content/` collections (notes, pages, projects) exist but are not yet wired up to any pages.
