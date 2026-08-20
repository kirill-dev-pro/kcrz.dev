/** Fraction of the scroll distance the hexagon field travels. Below 1 it lags
 *  behind the page, which is what reads as depth. */
export const HEX_PARALLAX_RATE = 0.35;

export function resolveHexShift(scrollY: number, rate: number = HEX_PARALLAX_RATE): number {
	if (!Number.isFinite(scrollY)) return 0;
	return -scrollY * rate;
}

export function initHexParallax(field: HTMLElement): () => void {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
	let frame = 0;

	const apply = () => {
		frame = 0;
		field.style.setProperty('--hex-shift', `${resolveHexShift(window.scrollY).toFixed(2)}px`);
	};

	const onScroll = () => {
		if (frame) return;
		frame = requestAnimationFrame(apply);
	};

	const start = () => {
		window.addEventListener('scroll', onScroll, { passive: true });
		apply();
	};

	const stop = () => {
		window.removeEventListener('scroll', onScroll);
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		field.style.setProperty('--hex-shift', '0px');
	};

	const onPreferenceChange = () => {
		stop();
		if (!reducedMotion.matches) start();
	};

	if (!reducedMotion.matches) start();
	reducedMotion.addEventListener('change', onPreferenceChange);

	// The field is fixed, so its box only moves when the viewport resizes.
	let bounds = field.getBoundingClientRect();
	const measure = () => {
		bounds = field.getBoundingClientRect();
	};

	let pointerFrame = 0;
	let pointerX = 0;
	let pointerY = 0;

	const applyPointer = () => {
		pointerFrame = 0;
		field.style.setProperty('--hex-x', `${(pointerX - bounds.left).toFixed(1)}px`);
		field.style.setProperty('--hex-y', `${(pointerY - bounds.top).toFixed(1)}px`);
		field.style.setProperty('--hex-glow', '1');
	};

	const onPointerMove = (event: PointerEvent) => {
		pointerX = event.clientX;
		pointerY = event.clientY;
		if (pointerFrame) return;
		pointerFrame = requestAnimationFrame(applyPointer);
	};

	const onPointerOut = () => {
		field.style.setProperty('--hex-glow', '0');
	};

	if (finePointer.matches) {
		window.addEventListener('pointermove', onPointerMove, { passive: true });
		document.addEventListener('pointerleave', onPointerOut);
		window.addEventListener('resize', measure, { passive: true });
	}

	return () => {
		stop();
		reducedMotion.removeEventListener('change', onPreferenceChange);
		window.removeEventListener('pointermove', onPointerMove);
		document.removeEventListener('pointerleave', onPointerOut);
		window.removeEventListener('resize', measure);
		if (pointerFrame) cancelAnimationFrame(pointerFrame);
	};
}
