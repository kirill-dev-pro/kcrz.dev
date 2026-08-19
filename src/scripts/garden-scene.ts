import { BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { Group } from 'three/src/objects/Group.js';
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial.js';
import { LineSegments } from 'three/src/objects/LineSegments.js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { Points } from 'three/src/objects/Points.js';
import { PointsMaterial } from 'three/src/materials/PointsMaterial.js';
import { Scene } from 'three/src/scenes/Scene.js';
import type { WebGLRenderer } from './garden-renderer';

export type MeteorSide = 'left' | 'right';
export interface MeteorPoint {
	x: number;
	y: number;
}

export interface TopologySegment {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

/** The meteor duty cycle keeps the outer-gutter accents rare and intentional. */
export const METEOR_CYCLE_MS = 26000;
export const METEOR_ACTIVE_MS = 3600;

export function isMeteorActive(elapsed: number, start: number): boolean {
	const cycleElapsed = ((elapsed - start) % METEOR_CYCLE_MS + METEOR_CYCLE_MS) % METEOR_CYCLE_MS;
	return cycleElapsed <= METEOR_ACTIVE_MS;
}

/** Build the angular Bunderstack topology lattice in the central reading field. */
export function createTopologyLattice(width: number, height: number): TopologySegment[] {
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return [];
	const centerX = width * 0.5;
	const centerY = height * 0.48;
	const radius = Math.min(width, height) * 0.22;
	const segments: TopologySegment[] = [];
	const ringSizes = [0.42, 0.7, 1];
	const points = 12;

	for (const ringSize of ringSizes) {
		for (let index = 0; index < points; index += 1) {
			const startAngle = (index / points) * Math.PI * 2;
			const endAngle = ((index + 1) / points) * Math.PI * 2;
			segments.push({
				x1: centerX + Math.cos(startAngle) * radius * ringSize,
				y1: centerY + Math.sin(startAngle) * radius * ringSize,
				x2: centerX + Math.cos(endAngle) * radius * ringSize,
				y2: centerY + Math.sin(endAngle) * radius * ringSize,
			});
		}
	}
	for (let index = 0; index < points; index += 2) {
		const angle = (index / points) * Math.PI * 2;
		segments.push({
			x1: centerX,
			y1: centerY,
			x2: centerX + Math.cos(angle) * radius,
			y2: centerY + Math.sin(angle) * radius,
		});
	}
	return segments;
}

export function getOutwardPulseProgress(elapsed: number): number {
	const cycle = 6000;
	return ((elapsed % cycle) + cycle) % cycle / cycle;
}

const PROJECT_COLORS: Record<string, number> = {
	bunderstack: 0x9b7bff,
	bunderhost: 0x55e6ff,
	hrbreakers: 0xd7ff43,
	'telegram-vpn': 0x3f87ff,
	klaud: 0xff7043,
};

const PAPER_COLOR = 0xf2f5f3;
const VIOLET_COLOR = 0x9b7bff;

export type SceneViewportMode = 'animated' | 'static' | 'mobile';

export function resolveSceneViewport(width: number, prefersReducedMotion: boolean): SceneViewportMode {
	if (!Number.isFinite(width) || width <= 760) return 'mobile';
	return prefersReducedMotion ? 'static' : 'animated';
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.min(maximum, Math.max(minimum, value));
}

/** Build a straight-segment path that never leaves the outer 15% gutter. */
export function createMeteorPath(
	side: MeteorSide,
	width: number,
	height: number,
	random: () => number = Math.random,
): MeteorPoint[] {
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return [];

	const seed = clamp(Number(random()) || 0, 0, 1);
	const center = side === 'left' ? width * (0.075 + seed * 0.025) : width * (0.925 - seed * 0.025);
	const spread = width * (0.018 + seed * 0.018);
	const y = [-0.08, 0.27, 0.56, 1.08].map((position) => position * height);
	const x = side === 'left'
		? [center, center + spread, center - spread * 0.6, center + spread * 0.7]
		: [center, center - spread, center + spread * 0.6, center - spread * 0.7];

	return x.map((point, index) => ({ x: point, y: y[index] }));
}

function createRandom(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (1664525 * state + 1013904223) >>> 0;
		return state / 0x100000000;
	};
}

function createStars(width: number, height: number, color: number, density: number): Points {
	const random = createRandom(0x6b756e);
	const count = Math.max(18, Math.round((width * height) / 26000 * density));
	const positions = new Float32Array(count * 3);

	for (let index = 0; index < count; index += 1) {
		positions[index * 3] = random() * width;
		positions[index * 3 + 1] = random() * height;
		positions[index * 3 + 2] = 0;
	}

	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	const material = new PointsMaterial({
		color,
		size: 1.2,
		transparent: true,
		opacity: 0.32,
		depthWrite: false,
	});
	return new Points(geometry, material);
}

function createTraces(width: number, height: number, color: number): LineSegments {
	const geometry = new BufferGeometry();
	const positions = new Float32Array([
		width * 0.03, height * 0.19, 0, width * 0.12, height * 0.19, 0,
		width * 0.08, height * 0.19, 0, width * 0.08, height * 0.31, 0,
		width * 0.87, height * 0.74, 0, width * 0.98, height * 0.74, 0,
		width * 0.92, height * 0.74, 0, width * 0.92, height * 0.84, 0,
	]);
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	const material = new LineBasicMaterial({ color, transparent: true, opacity: 0.18 });
	return new LineSegments(geometry, material);
}

function disposeDecorativeObject(object: Points | LineSegments): void {
	object.geometry.dispose();
	object.material.dispose();
}

interface Meteor {
	line: LineSegments;
	path: MeteorPoint[];
	start: number;
	duration: number;
}

function createMeteor(width: number, height: number, side: MeteorSide, seed: number, color: number, start: number): Meteor {
	const path = createMeteorPath(side, width, height, createRandom(seed));
	const geometry = new BufferGeometry();
	const positions = new Float32Array(12);
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	const material = new LineBasicMaterial({ color, transparent: true, opacity: 0.78 });
	return {
		line: new LineSegments(geometry, material),
		path,
		start,
		duration: METEOR_ACTIVE_MS,
	};
}

function pointAt(path: MeteorPoint[], progress: number): MeteorPoint {
	if (path.length === 0) return { x: 0, y: 0 };
	const scaled = clamp(progress, 0, 1) * (path.length - 1);
	const index = Math.min(path.length - 2, Math.floor(scaled));
	const fraction = scaled - index;
	if (path.length === 1 || index < 0) return path[0];
	return {
		x: path[index].x + (path[index + 1].x - path[index].x) * fraction,
		y: path[index].y + (path[index + 1].y - path[index].y) * fraction,
	};
}

function updateMeteor(meteor: Meteor, elapsed: number, width: number, height: number): void {
	if (!isMeteorActive(elapsed, meteor.start)) {
		meteor.line.visible = false;
		return;
	}
	const cycleElapsed = ((elapsed - meteor.start) % METEOR_CYCLE_MS + METEOR_CYCLE_MS) % METEOR_CYCLE_MS;
	const progress = cycleElapsed / meteor.duration;
	const head = pointAt(meteor.path, progress);
	const tail = pointAt(meteor.path, Math.max(0, progress - 0.12));
	const attribute = meteor.line.geometry.getAttribute('position') as BufferAttribute;
	const values = attribute.array as Float32Array;
	values[0] = tail.x;
	values[1] = tail.y;
	values[2] = 0;
	values[3] = head.x;
	values[4] = head.y;
	values[5] = 0;
	values[6] = tail.x + (head.x - tail.x) * 0.45;
	values[7] = tail.y + (head.y - tail.y) * 0.45;
	values[8] = 0;
	values[9] = head.x;
	values[10] = head.y;
	values[11] = 0;
	attribute.needsUpdate = true;
	meteor.line.visible = width > 0 && height > 0;
}

function createTopology(width: number, height: number, color: number): LineSegments {
	const lattice = createTopologyLattice(width, height);
	const positions = new Float32Array(lattice.length * 6);
	lattice.forEach((segment, index) => {
		const offset = index * 6;
		positions[offset] = segment.x1;
		positions[offset + 1] = segment.y1;
		positions[offset + 3] = segment.x2;
		positions[offset + 4] = segment.y2;
	});
	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	return new LineSegments(geometry, new LineBasicMaterial({ color, transparent: true, opacity: 0.18 }));
}

function createPulse(width: number, height: number, color: number): LineSegments {
	const centerX = width * 0.5;
	const centerY = height * 0.48;
	const size = Math.min(width, height) * 0.035;
	const positions = new Float32Array([
		centerX - size, centerY - size, 0, centerX + size, centerY - size, 0,
		centerX + size, centerY - size, 0, centerX + size, centerY + size, 0,
		centerX + size, centerY + size, 0, centerX - size, centerY + size, 0,
		centerX - size, centerY + size, 0, centerX - size, centerY - size, 0,
	]);
	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(positions, 3));
	return new LineSegments(geometry, new LineBasicMaterial({ color, transparent: true, opacity: 0.45 }));
}

function updatePulse(pulse: LineSegments, elapsed: number): void {
	const progress = getOutwardPulseProgress(elapsed);
	const scale = 0.7 + progress * 2.5;
	pulse.scale.set(scale, scale, 1);
	(pulse.material as LineBasicMaterial).opacity = 0.42 * (1 - progress);
}

function getPalette(documentElement: HTMLElement): number {
	const project = documentElement.dataset.project;
	if (project && PROJECT_COLORS[project]) return PROJECT_COLORS[project];
	if (documentElement.dataset.scene === 'system') return VIOLET_COLOR;
	return PAPER_COLOR;
}

/** Create the decorative scene lazily and return a complete cleanup function. */
export function initGardenScene(canvas: HTMLCanvasElement): () => void {
	const ownerDocument = canvas?.ownerDocument;
	const documentElement = ownerDocument?.documentElement;
	const windowObject = ownerDocument?.defaultView;
	if (!ownerDocument || !documentElement || !windowObject) return () => undefined;

	const prefersReducedMotion = windowObject.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	let renderer: WebGLRenderer | undefined;

	const scene = new Scene();
	const camera = new OrthographicCamera(0, 1, 1, 0, -10, 10);
	const group = new Group();
	scene.add(group);
	const meteors: Meteor[] = [];
	let animationFrame = 0;
	let disposed = false;
	let visible = ownerDocument.visibilityState !== 'hidden';
	let width = 0;
	let height = 0;
	let viewportMode = resolveSceneViewport(windowObject.innerWidth, prefersReducedMotion);
	let rebuildScene: (() => void) | undefined;
	let systemPulse: LineSegments | undefined;

	const render = (time = 0) => {
		if (disposed || !renderer) return;
		if (viewportMode === 'animated') {
			meteors.forEach((meteor) => updateMeteor(meteor, time, width, height));
			if (documentElement.dataset.scene === 'system' && systemPulse) updatePulse(systemPulse, time);
		}
		renderer.render(scene, camera);
	};

	const setPalette = () => {
		const color = getPalette(documentElement);
		group.children.forEach((child) => {
			const material = (child as Points | LineSegments).material;
			if (material && 'color' in material) (material as PointsMaterial).color.setHex(color);
		});
	};

	const resize = () => {
		const nextWidth = Math.max(1, Number(windowObject.innerWidth) || 0);
		const nextHeight = Math.max(1, Number(windowObject.innerHeight) || 0);
		const nextMode = resolveSceneViewport(nextWidth, prefersReducedMotion);
		const geometryChanged = width !== nextWidth || height !== nextHeight;
		const viewportChanged = viewportMode !== nextMode;
		width = nextWidth;
		height = nextHeight;
		camera.right = width;
		camera.bottom = height;
		camera.updateProjectionMatrix();
		if (renderer) {
			renderer.setPixelRatio(Math.min(windowObject.devicePixelRatio || 1, 1.5));
			renderer.setSize(width, height, false);
		}
		viewportMode = nextMode;
		if ((geometryChanged || viewportChanged) && rebuildScene) rebuildScene();
		if (viewportChanged && viewportMode !== 'animated' && animationFrame) {
			windowObject.cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		}
		if (viewportChanged && viewportMode === 'animated' && visible && !animationFrame) {
			animationFrame = windowObject.requestAnimationFrame(animate);
		}
	};

	const rebuild = () => {
		group.children.forEach((child) => {
			if (child instanceof Points || child instanceof LineSegments) {
				disposeDecorativeObject(child);
			}
		});
		group.clear();
		meteors.length = 0;
		systemPulse = undefined;
		const sceneMode = documentElement.dataset.scene ?? 'hero';
		group.add(createStars(width, height, getPalette(documentElement), sceneMode === 'projects' ? 1.4 : 0.7));
		group.add(createTraces(width, height, getPalette(documentElement)));
		if (sceneMode === 'system') {
			group.add(createTopology(width, height, VIOLET_COLOR));
			systemPulse = createPulse(width, height, VIOLET_COLOR);
			group.add(systemPulse);
			if (viewportMode !== 'animated') updatePulse(systemPulse, 0);
		}
		if (viewportMode !== 'mobile') {
			const left = createMeteor(width, height, 'left', 0x41a3, getPalette(documentElement), 0);
			const right = createMeteor(width, height, 'right', 0x8e17, getPalette(documentElement), METEOR_CYCLE_MS / 2);
			meteors.push(left, right);
			group.add(left.line, right.line);
		}
		setPalette();
		render();
	};

	const animate = (time: number) => {
		if (disposed || !visible || viewportMode !== 'animated') return;
		render(time);
		animationFrame = windowObject.requestAnimationFrame(animate);
	};

	const onVisibilityChange = () => {
		visible = ownerDocument.visibilityState !== 'hidden';
		if (visible && viewportMode === 'animated' && !animationFrame) {
			animationFrame = windowObject.requestAnimationFrame(animate);
		}
		if (!visible && animationFrame) {
			windowObject.cancelAnimationFrame(animationFrame);
			animationFrame = 0;
		}
	};
	const mutationObserver = typeof MutationObserver !== 'undefined'
		? new MutationObserver(() => rebuild())
		: undefined;

	rebuildScene = rebuild;
	resize();
	windowObject.addEventListener('resize', resize, { passive: true });
	ownerDocument.addEventListener('visibilitychange', onVisibilityChange);
	mutationObserver?.observe(documentElement, { attributes: true, attributeFilter: ['data-scene', 'data-project'] });
	void import('./garden-renderer').then(({ WebGLRenderer }) => {
		if (disposed) return;
		try {
			renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
			resize();
			rebuild();
			if (viewportMode === 'animated' && visible && !animationFrame) {
				animationFrame = windowObject.requestAnimationFrame(animate);
			}
		} catch {
			canvas.dataset.sceneFallback = 'true';
		}
	}).catch(() => {
		canvas.dataset.sceneFallback = 'true';
	});

	return () => {
		disposed = true;
		if (animationFrame) windowObject.cancelAnimationFrame(animationFrame);
		windowObject.removeEventListener('resize', resize);
		ownerDocument.removeEventListener('visibilitychange', onVisibilityChange);
		mutationObserver?.disconnect();
		scene.traverse((object) => {
			if (object instanceof Points || object instanceof LineSegments) {
				disposeDecorativeObject(object);
			}
		});
		renderer?.dispose();
	};
}
