import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createMeteorPath,
  createPulseLayout,
  createTopologyLattice,
  getOutwardPulseProgress,
  isMeteorActive,
  METEOR_ACTIVE_MS,
  METEOR_CYCLE_MS,
  resolveSceneViewport,
} from '../src/scripts/garden-scene.ts';

function assertPathInGutter(path, side, width) {

  assert.ok(path.length > 0);

  const boundary = side === 'left' ? width * 0.15 : width * 0.85;
  path.forEach(({ x, y }) => {
    assert.ok(Number.isFinite(x));
    assert.ok(Number.isFinite(y));
    if (side === 'left') assert.ok(x <= boundary, `left point escaped gutter: ${x}`);
    else assert.ok(x >= boundary, `right point escaped gutter: ${x}`);
  });
}

function hasDirectionChange(path) {
  const directions = path.slice(1).map((point, index) => ({
    x: Math.sign(point.x - path[index].x),
    y: Math.sign(point.y - path[index].y),
  }));

  return directions.some((direction, index) => {
    const previous = directions[index - 1];
    return previous && (direction.x !== previous.x || direction.y !== previous.y);
  });
}

test('deterministic meteor paths stay in the requested edge gutters and zig-zag', () => {
  const random = () => 0.42;
  const width = 1200;
  const height = 800;

  const leftPath = createMeteorPath('left', width, height, random);
  const rightPath = createMeteorPath('right', width, height, random);

  assertPathInGutter(leftPath, 'left', width);
  assertPathInGutter(rightPath, 'right', width);
  assert.ok(hasDirectionChange(leftPath), 'left path should change direction');
  assert.ok(hasDirectionChange(rightPath), 'right path should change direction');
});

test('invalid meteor path dimensions return an empty path', () => {
  assert.deepEqual(createMeteorPath('left', 0, 800, () => 0.5), []);
  assert.deepEqual(createMeteorPath('right', 1200, 0, () => 0.5), []);
  assert.deepEqual(createMeteorPath('left', -1, 800, () => 0.5), []);
  assert.deepEqual(createMeteorPath('right', 1200, -1, () => 0.5), []);
});

test('scene viewport mode switches at the mobile breakpoint', () => {
  assert.equal(resolveSceneViewport(760, false), 'mobile');
  assert.equal(resolveSceneViewport(761, false), 'animated');
  assert.equal(resolveSceneViewport(1200, true), 'static');
  assert.equal(resolveSceneViewport(0, false), 'mobile');
});

test('system mode exposes a geometric topology lattice and an outward pulse', () => {
  const lattice = createTopologyLattice(1200, 800);
  assert.ok(lattice.length >= 8, 'system lattice should contain multiple segments');
  assert.ok(lattice.some((segment) => segment.x1 !== segment.x2));
  assert.ok(lattice.some((segment) => segment.y1 !== segment.y2));
  assert.equal(getOutwardPulseProgress(0), 0);
  assert.ok(getOutwardPulseProgress(1500) > getOutwardPulseProgress(0));
  assert.ok(getOutwardPulseProgress(6000) < getOutwardPulseProgress(1500));
});

test('system pulse geometry is local to its topology center before scaling', () => {
  const layout = createPulseLayout(1200, 800);
  const coordinates = layout.vertices.flatMap(({ x, y }) => [x, y]);

  assert.equal(layout.position.x, 600);
  assert.equal(layout.position.y, 384);
  assert.ok(Math.max(...coordinates) <= layout.size);
  assert.ok(Math.min(...coordinates) >= -layout.size);
  assert.ok(coordinates.some((coordinate) => coordinate < 0));
  assert.ok(coordinates.some((coordinate) => coordinate > 0));
});

test('edge meteors use a sparse schedule instead of continuous loops', () => {
  assert.ok(METEOR_CYCLE_MS >= METEOR_ACTIVE_MS * 4);
  assert.equal(isMeteorActive(500, 0), true);
  assert.equal(isMeteorActive(METEOR_ACTIVE_MS + 1, 0), false);
  assert.equal(isMeteorActive(METEOR_CYCLE_MS + 500, 0), true);
});
