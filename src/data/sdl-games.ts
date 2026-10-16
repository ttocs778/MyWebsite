// Browser builds of the SDL2 games (Emscripten), served from public/play/<slug>/<slug>.{js,wasm,data}.
// Each has a play page at /play/<slug> and a card on the games page (/play).
// width/height are the game's native window size, used for the canvas and the poster.
export interface SdlGame {
	slug: string;
	title: string;
	blurb: string;
	width: number;
	height: number;
	controls: [keys: string, action: string][];
	// Download size in MB, shown before the player starts it
	sizeMB: number;
}

export const sdlGames: SdlGame[] = [
	{
		slug: 'pong',
		title: 'Pong',
		blurb: 'One paddle, one ball, and a wall that never misses.',
		width: 1024,
		height: 768,
		controls: [['W / S', 'Move the paddle']],
		sizeMB: 0.8,
	},
	{
		slug: 'asteroids',
		title: 'Asteroids',
		blurb: 'Fly around and shoot rocks before they hit you.',
		width: 1024,
		height: 768,
		controls: [['W / S', 'Thrust forward / back'], ['A / D', 'Turn'], ['Space', 'Shoot']],
		sizeMB: 2.3,
	},
	{
		slug: 'frogger',
		title: 'Frogger',
		blurb: 'Cross the road, then the river, without getting flattened.',
		width: 448,
		height: 512,
		controls: [['W A S D', 'Hop']],
		sizeMB: 1.2,
	},
	{
		slug: 'mario',
		title: 'Mario',
		blurb: 'A side-scrolling Mario level, Goombas included.',
		width: 600,
		height: 448,
		controls: [['A / D', 'Run'], ['Space', 'Jump']],
		sizeMB: 3.9,
	},
	{
		slug: 'pac-man',
		title: 'Pac-Man',
		blurb: 'All four ghosts, each chasing you their own way.',
		width: 470,
		height: 520,
		controls: [['W A S D', 'Move'], ['1', 'Show / hide ghost targets'], ['2', 'Show / hide the path graph']],
		sizeMB: 2.4,
	},
	{
		slug: 'zelda',
		title: 'Zelda',
		blurb: 'A Link to the Past overworld with soldiers that path-find to you.',
		width: 512,
		height: 448,
		controls: [['W A S D', 'Move'], ['Space', 'Swing the sword']],
		sizeMB: 3.7,
	},
	{
		slug: 'star-fox',
		title: 'Star Fox',
		blurb: 'Fly down an endless canyon and blast the blocks in your way.',
		width: 1024,
		height: 768,
		controls: [['W A S D', 'Steer'], ['Space', 'Shoot'], ['Q', 'Barrel roll']],
		sizeMB: 6.1,
	},
	{
		slug: 'mario-kart',
		title: 'Mario Kart',
		blurb: 'Race an AI kart around a rainbow track.',
		width: 1024,
		height: 768,
		controls: [['W', 'Gas'], ['A / D', 'Steer']],
		sizeMB: 13.2,
	},
	{
		slug: 'portal',
		title: 'Portal',
		blurb: 'Portal guns, energy puzzles, turrets and GLaDOS.',
		width: 1024,
		height: 768,
		controls: [
			['Mouse', 'Look (click the game first)'],
			['W A S D', 'Move'],
			['Space', 'Jump'],
			['Left / right click', 'Blue / orange portal'],
			['R', 'Close both portals'],
			['F', 'Skip GLaDOS'],
			['P', 'Watch a replay solve the level'],
			['Esc', 'Get your mouse back'],
		],
		sizeMB: 27.8,
	},
];
