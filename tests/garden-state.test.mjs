import test from 'node:test';
import assert from 'node:assert/strict';

import { projects } from '../src/data/projects.ts';
import { initGardenState, resolveSceneMode, shouldAnimate } from '../src/scripts/garden-state.ts';

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

test('scene selection retains the dominant section across partial observer updates', () => {
  const hero = { dataset: { sceneSection: 'hero' } };
  const bunderstack = { dataset: { sceneSection: 'bunderstack' } };
  const html = { dataset: {} };
  const listeners = new Map();
  const root = {
    ownerDocument: { documentElement: html },
    querySelectorAll(selector) {
      return selector === '[data-scene-section]' ? [hero, bunderstack] : [];
    },
    addEventListener(type, handler) { listeners.set(type, handler); },
    removeEventListener(type, handler) {
      if (listeners.get(type) === handler) listeners.delete(type);
    },
    contains() { return true; },
  };
  let observer;
  const previousObserver = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = class {
    constructor(callback) { observer = { callback, disconnected: false }; }
    observe() {}
    disconnect() { observer.disconnected = true; }
  };

  try {
    const cleanup = initGardenState(root);
    observer.callback([{ target: hero, isIntersecting: true, intersectionRatio: 0.8 }]);
    observer.callback([{ target: bunderstack, isIntersecting: true, intersectionRatio: 0.4 }]);
    assert.equal(html.dataset.scene, 'hero');
    cleanup();
    assert.equal(observer.disconnected, true);
    assert.equal(listeners.size, 0);
  } finally {
    globalThis.IntersectionObserver = previousObserver;
  }
});
