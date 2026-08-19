import test from 'node:test';
import assert from 'node:assert/strict';

import { createMeteorPath } from '../src/scripts/garden-scene.ts';

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
