/**
 * Proxies Steam app image (tries header then capsule) so it loads same-origin.
 * Usage: /api/steam-img/APPID
 */
export async function GET({ params }) {
	const resolved = typeof params.then === 'function' ? await params : params;
	const appid = resolved.appid;
	if (!appid || !/^\d+$/.test(appid)) {
		return new Response('Bad request', { status: 400 });
	}
	const headers = {
		'Accept': 'image/*',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	};
	const urls = [
		`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
		`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`,
		`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_231x87.jpg`,
		`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_184x69.jpg`,
	];
	for (const url of urls) {
		try {
			const res = await fetch(url, { headers });
			if (res.ok) {
				const blob = await res.blob();
				const size = blob.size;
				if (size > 500) {
					return new Response(blob, {
						headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400' },
					});
				}
			}
		} catch {
			continue;
		}
	}
	return new Response('Not found', { status: 404 });
}
