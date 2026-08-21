/** A touch screen has no pointer to carry the hover state, so scrolling stands
 *  in for one: whichever project sits nearest the middle of the viewport is lit
 *  in its own accent, and it hands the light off to the next tile as it passes.
 */

export interface TileSpan {
	top: number;
	bottom: number;
}

/** Index of the tile whose *visible* middle sits closest to the middle of the
 *  viewport, or -1 when no tile is on screen. Clamping to the visible slice
 *  matters for a tile taller than the screen: it fills the view long before its
 *  own centre reaches the middle, and it should be lit for all of that. */
export function pickNearestToCenter(spans: TileSpan[], viewportHeight: number): number {
	const viewportCenter = viewportHeight / 2;
	let best = -1;
	let bestDistance = Number.POSITIVE_INFINITY;
	let bestOverlap = 0;

	spans.forEach((span, index) => {
		const top = Math.max(span.top, 0);
		const bottom = Math.min(span.bottom, viewportHeight);
		const overlap = bottom - top;
		if (overlap <= 0) return;

		const distance = Math.abs((top + bottom) / 2 - viewportCenter);
		// Two half-visible neighbours sit the same distance from the centre;
		// the one showing more of itself wins.
		if (distance < bestDistance || (distance === bestDistance && overlap > bestOverlap)) {
			best = index;
			bestDistance = distance;
			bestOverlap = overlap;
		}
	});

	return best;
}

export function initScrollFocus(tiles: HTMLElement[]): () => void {
	// Fine pointers already light tiles on hover; running both would fight.
	const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
	if (finePointer.matches || tiles.length === 0) return () => {};

	let frame = 0;
	let lit: HTMLElement | undefined;

	const apply = () => {
		frame = 0;
		const spans = tiles.map((tile) => {
			const rect = tile.getBoundingClientRect();
			return { top: rect.top, bottom: rect.bottom };
		});
		const index = pickNearestToCenter(spans, window.innerHeight);
		const next = index === -1 ? undefined : tiles[index];
		if (next === lit) return;
		lit?.classList.remove('is-lit');
		next?.classList.add('is-lit');
		lit = next;
	};

	const schedule = () => {
		if (frame) return;
		frame = requestAnimationFrame(apply);
	};

	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule, { passive: true });
	schedule();

	return () => {
		window.removeEventListener('scroll', schedule);
		window.removeEventListener('resize', schedule);
		if (frame) cancelAnimationFrame(frame);
		lit?.classList.remove('is-lit');
		lit = undefined;
	};
}
