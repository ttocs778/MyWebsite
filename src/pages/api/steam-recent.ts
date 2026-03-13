/**
 * Returns your Steam recently played games (last 2 weeks).
 * Set STEAM_API_KEY and STEAM_ID in .env (or Vercel env).
 * Get API key: https://steamcommunity.com/dev/apikey
 * Steam ID: 64-bit ID from your profile (e.g. from steamid.io)
 */
export async function GET() {
	const key = import.meta.env.STEAM_API_KEY;
	const steamId = import.meta.env.STEAM_ID;
	if (!key || !steamId) {
		return new Response(
			JSON.stringify({ games: [], error: 'STEAM_API_KEY or STEAM_ID not set' }),
			{ status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' } }
		);
	}
	try {
		const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${steamId}&format=json&count=1`;
		const res = await fetch(url);
		const data = await res.json();
		const games = data.response?.games ?? [];
		const list = games.slice(0, 1).map((g: { appid: number; name: string; img_logo_url?: string; playtime_forever?: number; playtime_2weeks?: number }) => ({
			appid: g.appid,
			name: g.name,
			img_logo_url: g.img_logo_url ?? '',
			playtime_forever: g.playtime_forever ?? 0,
			playtime_2weeks: g.playtime_2weeks ?? 0,
		}));
		return new Response(JSON.stringify({ games: list }), {
			status: 200,
			headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
		});
	} catch (e) {
		return new Response(
			JSON.stringify({ games: [], error: String(e) }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
