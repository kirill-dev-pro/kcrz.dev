/** How far past a tile's edge the pointer still lights its outline, in px.
 *  Must match the --tile-glow radius the stylesheet draws with. */
export const TILE_GLOW_RADIUS = 300;

export interface TileBox {
	left: number;
	top: number;
	width: number;
	height: number;
}

/** True when the pointer is close enough that part of the glow disc falls on
 *  the tile. Rejecting the rest keeps us from writing styles no one can see. */
export function isTileInReach(
	box: TileBox,
	pointerX: number,
	pointerY: number,
	radius: number = TILE_GLOW_RADIUS,
): boolean {
	const x = pointerX - box.left;
	const y = pointerY - box.top;
	return x >= -radius && y >= -radius && x <= box.width + radius && y <= box.height + radius;
}

export function initTileProximity(tiles: HTMLElement[]): () => void {
	const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
	if (!finePointer.matches || tiles.length === 0) return () => {};

	let frame = 0;
	let pointerX = 0;
	let pointerY = 0;

	const clear = (tile: HTMLElement) => {
		if (!tile.style.getPropertyValue('--px')) return;
		tile.style.removeProperty('--px');
		tile.style.removeProperty('--py');
	};

	const apply = () => {
		frame = 0;
		for (const tile of tiles) {
			const rect = tile.getBoundingClientRect();
			if (!isTileInReach(rect, pointerX, pointerY)) {
				clear(tile);
				continue;
			}
			tile.style.setProperty('--px', `${(pointerX - rect.left).toFixed(1)}px`);
			tile.style.setProperty('--py', `${(pointerY - rect.top).toFixed(1)}px`);
		}
	};

	const onPointerMove = (event: PointerEvent) => {
		pointerX = event.clientX;
		pointerY = event.clientY;
		if (frame) return;
		frame = requestAnimationFrame(apply);
	};

	const onPointerLeave = () => {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		tiles.forEach(clear);
	};

	window.addEventListener('pointermove', onPointerMove, { passive: true });
	document.addEventListener('pointerleave', onPointerLeave);

	return () => {
		window.removeEventListener('pointermove', onPointerMove);
		document.removeEventListener('pointerleave', onPointerLeave);
		if (frame) cancelAnimationFrame(frame);
	};
}
