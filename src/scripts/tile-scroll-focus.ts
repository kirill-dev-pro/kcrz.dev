/** Where the focus line sits in the viewport, as a fraction of its height.
 *  A tile crossing this line is fully lit. */
export const FOCUS_LINE = 0.5;

/** How far from the focus line a tile may sit and still catch some light,
 *  as a fraction of the viewport height. */
export const FOCUS_FALLOFF = 0.42;

export interface TileSpan {
	top: number;
	bottom: number;
}

/** Light level for one tile, 0 to 1: full while the tile covers the focus line,
 *  then eased down to nothing across the falloff, so a tile brightens as it
 *  climbs into the middle of the screen instead of snapping on. */
export function resolveTileLight(
	span: TileSpan,
	viewportHeight: number,
	line: number = FOCUS_LINE,
	falloff: number = FOCUS_FALLOFF,
): number {
	const focusY = viewportHeight * line;
	const distance = span.top > focusY ? span.top - focusY : Math.max(focusY - span.bottom, 0);
	const range = viewportHeight * falloff;
	if (range <= 0) return distance > 0 ? 0 : 1;
	const nearness = 1 - Math.min(distance / range, 1);
	// Smoothstep: the ramp starts and ends flat, so neither end of the travel
	// reads as a jump.
	return nearness * nearness * (3 - 2 * nearness);
}

export function initTileScrollFocus(tiles: HTMLElement[]): () => void {
	// The counterpart of the pointer-driven glow: it runs exactly where that one
	// bails, so a tile is never lit by both at once.
	const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');
	if (!coarsePointer.matches || tiles.length === 0) return () => {};

	let frame = 0;
	const levels = new Map<HTMLElement, number>();

	const apply = () => {
		frame = 0;
		const viewportHeight = window.innerHeight;
		for (const tile of tiles) {
			const rect = tile.getBoundingClientRect();
			const light = resolveTileLight(rect, viewportHeight);
			const previous = levels.get(tile) ?? 0;
			if (light === previous) continue;
			// Writing every frame for every tile would restyle the whole list on
			// each scroll step, and a hundredth of a step is below what the eye
			// reads. Going dark is always written, so no tile is left holding a
			// sliver of light too small to have crossed the threshold.
			if (light > 0 && Math.abs(previous - light) < 0.01) continue;
			levels.set(tile, light);
			if (light <= 0) tile.style.removeProperty('--lit');
			else tile.style.setProperty('--lit', light.toFixed(3));
		}
	};

	const schedule = () => {
		if (frame) return;
		frame = requestAnimationFrame(apply);
	};

	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule, { passive: true });
	apply();

	return () => {
		window.removeEventListener('scroll', schedule);
		window.removeEventListener('resize', schedule);
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		levels.clear();
		tiles.forEach((tile) => tile.style.removeProperty('--lit'));
	};
}
