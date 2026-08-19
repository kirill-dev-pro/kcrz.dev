import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { projects } from '../src/data/projects.ts';
import { initGardenState, resolveSceneMode, shouldAnimate } from '../src/scripts/garden-state.ts';

function readSource(relativePath) {
  try {
    return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  } catch {
    return '';
  }
}

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

test('projects retain their canonical external URLs', () => {
  assert.deepEqual(
    Object.fromEntries(projects.map(({ id, href }) => [id, href])),
    {
      bunderstack: 'https://github.com/kirill-dev-pro/bunderstack',
      bunderhost: 'https://bunderhost.kcrz.dev',
      hrbreakers: 'https://hrbreakers.com',
      'telegram-vpn': 'https://telegram-vpn.xyz',
      klaud: 'https://klaud.me',
    },
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

test('homepage composes the garden components and initializes progressive state', () => {
  const homepageSource = readSource('../src/pages/index.astro');

  assert.match(homepageSource, /import Hero from ['"]\.\.\/components\/home\/Hero\.astro['"]/);
  assert.match(homepageSource, /import ProjectGarden from ['"]\.\.\/components\/home\/ProjectGarden\.astro['"]/);
  assert.match(homepageSource, /import \{ initGardenState \} from ['"]\.\.\/scripts\/garden-state['"]/);
  assert.match(homepageSource, /<Hero\s*\/>/);
  assert.match(homepageSource, /<ProjectGarden\s*\/>/);
  assert.match(homepageSource, /initGardenState\(/);
});

test('project territories expose direct keyboard-focusable links', () => {
  const territorySource = readSource('../src/components/home/ProjectTerritory.astro');

  assert.match(territorySource, /<a\b[^>]*href=\{project\.href\}/);
});

test('hover-only territory activation is contained to fine pointers', () => {
  const homeStyles = readSource('../src/styles/home.css');

  assert.match(
    homeStyles,
    /@media\s*\(hover:\s*hover\)\s+and\s*\(pointer:\s*fine\)[\s\S]*?\.project-territory:hover[\s\S]*?\.project-territory:focus-within/,
  );
  assert.doesNotMatch(
    homeStyles,
    /\n\.project-territory:hover\s*,\s*\.project-territory:focus-within\s*\{/,
  );
});

test('mobile growth marker stays contained within the hero width', () => {
  const homeStyles = readSource('../src/styles/home.css');

  assert.match(
    homeStyles,
    /@media\s*\(max-width:\s*760px\)[\s\S]*?\.growth-marker\s*\{[\s\S]*?right:\s*0;[\s\S]*?overflow:\s*hidden;/,
  );
});

test('project screenshot uses the correctly encoded Bunderhost asset reference', () => {
  const gardenSource = readSource('../src/components/home/ProjectGarden.astro');

  assert.match(gardenSource, /src:\s*['"]\/projects\/bunderhost\.jpg['"]/);
  assert.doesNotMatch(gardenSource, /\/projects\/bunderhost\.png/);
});
