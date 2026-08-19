import test from 'node:test';
import assert from 'node:assert/strict';

import { projects } from '../src/data/projects.ts';
import { resolveSceneMode, shouldAnimate } from '../src/scripts/garden-state.ts';

test('projects preserve the geometric garden hierarchy and accent tokens', () => {
  assert.equal(projects[0].id, 'bunderstack');
  assert.equal(projects[0].featured, true);
  assert.deepEqual(
    projects.map(({ id }) => id),
    ['bunderstack', 'bunderhost', 'hrbreakers', 'telegram-vpn', 'klaud'],
  );
  assert.deepEqual(
    projects.map(({ accent }) => accent),
    ['#9b7bff', '#55e6ff', '#d7ff43', '#3f87ff', '#ff7043'],
  );
});

test('scene mode follows the semantic section identifiers', () => {
  assert.equal(resolveSceneMode('hero'), 'hero');
  assert.equal(resolveSceneMode('bunderstack'), 'system');
  assert.equal(resolveSceneMode('bunderhost'), 'projects');
  assert.equal(resolveSceneMode('unknown'), 'projects');
});

test('animation is disabled for reduced motion and hidden documents', () => {
  assert.equal(shouldAnimate(false, true), true);
  assert.equal(shouldAnimate(true, true), false);
  assert.equal(shouldAnimate(false, false), false);
});
