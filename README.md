# Scott Tang – Personal Site

This is my personal website and portfolio, built with **Astro**.  
It hosts my projects, notes, and about page, with a custom layout and animations.

## Tech stack

- **Framework**: Astro
- **Styling**: CSS (no UI framework)
- **Language**: TypeScript/JavaScript (where needed)

## Fonts

- Atkinson Hyperlegible Next

---

## Updates (2026-03-06 18:09)

### Home
- Video background with overlay; slate/premium palette aligned with other pages.

### About
- **Layout**: Two-column intro/interests; Contact section with Instagram, LinkedIn, GitHub, and direct contact via **Email**, **Phone**, or **WeChat** (inline-code for addresses/IDs).
- **Gaming**: Three platforms in a grid — Steam, PlayStation, Battle.net — with a shared PS5-style look (dark panels, blue accent, same hover/CTA style).

### Gaming section (how it works)
- **Steam**  
  - **Recently played**: Fetched from Steam’s API via a server route `GET /api/steam-recent` (uses `STEAM_API_KEY` and `STEAM_ID` in `.env`).  
  - Each game is a block: gamepad icon, name, “X hrs total” on two lines. The whole block links to the Steam store and has a hover lift (`translateY(-4px)`).  
  - Client fetches `/api/steam-recent` and injects the list; styles use `:global()` so Astro’s scoped CSS applies to the JS-created elements.

- **PlayStation**  
  - “Add me on PlayStation” links to PSN profile (replace `ReplaceWithYourPSNID` in the URL with your PSN ID).  
  - Recently played is a placeholder (“—”); can be replaced later with a static list or PSN API (e.g. `psn-api` + refresh token).

- **Battle.net**  
  - **Recently played**: Static list in HTML (e.g. Overwatch with link to [overwatch.blizzard.com](https://overwatch.blizzard.com/en-us/) and “600 hrs total”).  
  - “Copy my Battle.net id” is a button that copies the BattleTag (e.g. `SORU#31904`) to the clipboard via `navigator.clipboard.writeText()`; button shows “Copied!” briefly.

### Env / config
- **Steam**: `STEAM_API_KEY`, `STEAM_ID` in `.env` (or Vercel). Get key from [Steam Web API Key](https://steamcommunity.com/dev/apikey).

