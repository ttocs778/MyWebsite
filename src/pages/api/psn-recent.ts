/**
 * Returns your most recently played PlayStation game.
 * Set PSN_NPSSO in .env (or Vercel env). PSN has no official public API; this uses psn-api.
 * Get NPSSO: log in at playstation.com, then open https://ca.account.sony.com/api/v1/ssocookie
 * NPSSO expires roughly every 2 months — refresh the env var when the widget goes blank.
 */

// Live data: rendered on each request, not at build time.
export const prerender = false;
import {
	exchangeNpssoForAccessCode,
	exchangeAccessCodeForAuthTokens,
	exchangeRefreshTokenForAuthTokens,
	getUserPlayedGames,
} from 'psn-api';

// Reused while the serverless instance stays warm, so we don't re-exchange NPSSO on every request
let auth: { accessToken: string; expiresAt: number; refreshToken: string; refreshExpiresAt: number } | null = null;

async function getAccessToken(npsso: string) {
	const now = Date.now();
	if (auth && now < auth.expiresAt) return auth.accessToken;

	const tokens =
		auth && now < auth.refreshExpiresAt
			? await exchangeRefreshTokenForAuthTokens(auth.refreshToken)
			: await exchangeAccessCodeForAuthTokens(await exchangeNpssoForAccessCode(npsso));

	auth = {
		accessToken: tokens.accessToken,
		expiresAt: now + (tokens.expiresIn - 60) * 1000,
		refreshToken: tokens.refreshToken,
		refreshExpiresAt: now + (tokens.refreshTokenExpiresIn - 60) * 1000,
	};
	return auth.accessToken;
}

/** "PT228H56M33S" -> 229 */
function durationToHours(iso: string) {
	const m = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(iso ?? '');
	if (!m) return 0;
	return Math.round(Number(m[1] ?? 0) + Number(m[2] ?? 0) / 60);
}

export async function GET() {
	const npsso = import.meta.env.PSN_NPSSO;
	if (!npsso) {
		return new Response(
			JSON.stringify({ games: [], error: 'PSN_NPSSO not set' }),
			// no-store: otherwise browsers keep showing "—" for 5 min after the env var is added
			{ status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
		);
	}
	try {
		const accessToken = await getAccessToken(npsso);
		const { titles } = await getUserPlayedGames({ accessToken }, 'me', { limit: 10 });
		const latest = [...titles]
			.sort((a, b) => Date.parse(b.lastPlayedDateTime) - Date.parse(a.lastPlayedDateTime))
			.slice(0, 1)
			.map((t) => ({
				name: t.name,
				hours: durationToHours(t.playDuration),
				url: `https://store.playstation.com/concept/${t.concept.id}`,
			}));
		return new Response(JSON.stringify({ games: latest }), {
			status: 200,
			headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
		});
	} catch (e) {
		auth = null;
		return new Response(
			JSON.stringify({ games: [], error: String(e) }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
