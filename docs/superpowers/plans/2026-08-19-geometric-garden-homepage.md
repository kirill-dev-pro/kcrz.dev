# Geometric Garden Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first Kcrz.dev homepage as a dark geometric portfolio with project territories, progressive interaction, and a section-aware Three.js meteor background.

**Architecture:** Astro renders all meaningful content as static HTML. Focused framework-free TypeScript modules manage page state and a decorative Three.js canvas, while CSS provides the complete layout and fallback experience.

**Tech Stack:** Astro 7, TypeScript, CSS, Three.js, Node test runner

**Spec:** `docs/superpowers/specs/2026-08-19-geometric-garden-homepage-design.md`

## Global Constraints

- Brand copy is exactly `Kcrz.dev` and `reduce complexity, touch grass`.
- Use straight-edged polygons and clipped corners; do not introduce rounded SaaS cards or organic blobs.
- Bunderstack is the dominant first project territory.
- Meaningful content and navigation must work without JavaScript or WebGL.
- The canvas must be decorative, `aria-hidden`, fixed behind content, and `pointer-events: none`.
- Meteors stay in the outer 10–15% viewport gutters and use straight segments with abrupt turns.
- Keyboard focus mirrors pointer activation; touch layouts do not depend on hover.
- `prefers-reduced-motion` disables continuous animation.
- Only the active project uses a strong accent color; inactive territories remain subdued.
- Small screens use a static background with no meteors.
- Do not add React or SolidJS.

---

### Task 1: Typed project content and interaction state

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/scripts/garden-state.ts`
- Create: `tests/garden-state.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `Project` type and `projects` array with stable IDs `bunderstack`, `bunderhost`, `hrbreakers`, `telegram-vpn`, and `klaud`.
- Produces: `resolveSceneMode(sectionId: string): 'hero' | 'system' | 'projects'` and `shouldAnimate(prefersReducedMotion: boolean, documentVisible: boolean): boolean`.
- Produces: `initGardenState(root: HTMLElement): () => void`, which updates `document.documentElement.dataset.scene` and `dataset.project` from observed sections and project pointer/focus events.

- [ ] **Step 1: Add a failing Node test for stable project hierarchy and scene helpers**

  Test imports the built TypeScript-compatible modules through Astro/Vite test tooling or isolates pure helpers in JavaScript-compatible syntax. It asserts that Bunderstack is first and featured, `resolveSceneMode('hero')` returns `hero`, `resolveSceneMode('bunderstack')` returns `system`, other sections return `projects`, and reduced motion/hidden documents disable animation.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `npm test -- tests/garden-state.test.mjs`
  Expected: failure because `src/data/projects.ts` and `src/scripts/garden-state.ts` do not exist.

- [ ] **Step 3: Implement the typed data and minimal pure helpers**

  Use factual descriptions from the design spec and exact project accent tokens. Keep DOM setup separate from the pure functions so the latter remain directly testable.

- [ ] **Step 4: Implement `initGardenState` as progressive enhancement**

  Use IntersectionObserver for `[data-scene-section]` and pointer/focus listeners for `[data-project-id]`. Return a cleanup function that disconnects the observer and removes listeners. If IntersectionObserver is unavailable, retain the server-rendered default `hero` state.

- [ ] **Step 5: Run tests and verify GREEN**

  Run: `npm test -- tests/garden-state.test.mjs`
  Expected: all assertions pass with no warnings.

- [ ] **Step 6: Commit**

  ```bash
  git add package.json src/data/projects.ts src/scripts/garden-state.ts tests/garden-state.test.mjs
  git commit -m "feat: add geometric garden project state"
  ```

### Task 2: Static geometric homepage and responsive project territories

**Files:**
- Create: `src/components/home/Hero.astro`
- Create: `src/components/home/ProjectTerritory.astro`
- Create: `src/components/home/ProjectGarden.astro`
- Create: `src/styles/home.css`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/styles/global.css`
- Modify: `src/consts.ts`
- Create: `public/projects/bunderhost.jpg`
- Create: `public/projects/hrbreakers.jpg`
- Create: `public/projects/telegram-vpn.webp`
- Create: `public/projects/klaud.png`

**Interfaces:**
- Consumes: `projects` and stable project IDs from Task 1.
- Produces: `[data-scene-section]` regions and `[data-project-id]` interactive territories for Task 1 and Task 3.
- Produces: CSS custom property `--project-accent` on each territory.

- [ ] **Step 1: Add a failing static-output test**

  Extend `tests/garden-state.test.mjs` with a source-level contract asserting the homepage imports `Hero`, `ProjectGarden`, and the state initializer, and that project rendering includes keyboard-focusable links. The test must fail before the components exist.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `npm test -- tests/garden-state.test.mjs`
  Expected: failure naming the missing homepage/component contract.

- [ ] **Step 3: Copy real project imagery into the site**

  Copy the existing local assets from the sibling project repositories listed in the design research. Preserve image formats and do not modify the source repositories.

- [ ] **Step 4: Build the semantic homepage components**

  Render hero copy, short factual introduction, Bunderstack as the dominant first territory, the remaining projects, direct links, and meaningful screenshot alt text. Keep screenshots in document flow on mobile and enhancement layers on hover/focus-capable desktop.

- [ ] **Step 5: Implement the token system and straight-edged layout**

  Define the spec colors and type roles. Use `clip-path: polygon(...)`, hard borders, asymmetric grids, and construction lines. Avoid border radii. Ensure active territories intensify without hiding neighboring links.

- [ ] **Step 6: Implement responsive and accessible states**

  Add visible `:focus-visible`, reduced-motion overrides, a single-column mobile map, readable contrast, and overflow containment. Header links become `About`, `Work`, and `Blog`.

- [ ] **Step 7: Run tests and build**

  Run: `npm test`
  Run: `npm run build`
  Expected: tests and static build pass.

- [ ] **Step 8: Commit**

  ```bash
  git add public/projects src/components src/pages/index.astro src/styles src/consts.ts tests/garden-state.test.mjs
  git commit -m "feat: build geometric garden homepage"
  ```

### Task 3: Three.js edge meteor scene and section palettes

**Files:**
- Create: `src/scripts/garden-scene.ts`
- Create: `tests/garden-scene.test.mjs`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/home.css`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `data-scene` and `data-project` attributes from `initGardenState`.
- Produces: `createMeteorPath(side: 'left' | 'right', width: number, height: number, random?: () => number): Array<{x: number; y: number}>` for deterministic tests.
- Produces: `initGardenScene(canvas: HTMLCanvasElement): () => void` for WebGL setup and cleanup.

- [ ] **Step 1: Add failing deterministic meteor-path tests**

  Assert that all left-side points remain within `x <= width * 0.15`, all right-side points remain within `x >= width * 0.85`, each path has at least one direction change, and invalid zero dimensions return an empty path.

- [ ] **Step 2: Run the focused test and verify RED**

  Run: `npm test -- tests/garden-scene.test.mjs`
  Expected: failure because `garden-scene.ts` does not exist.

- [ ] **Step 3: Install Three.js and implement the pure path generator**

  Run: `npm install three`
  Implement deterministic points first, without creating a renderer at module import time.

- [ ] **Step 4: Implement the progressive WebGL scene**

  Initialize the renderer only in `initGardenScene`. Cap device pixel ratio, pause when hidden, listen for scene/project dataset changes, keep meteors in edge gutters, and catch renderer initialization failure so the page remains usable.

- [ ] **Step 5: Connect and style the decorative canvas**

  Add one `<canvas aria-hidden="true">` behind the page, dynamically import the scene on the client, and keep a CSS-only grid/gradient fallback. Respect reduced motion by rendering one static frame and not scheduling animation.

- [ ] **Step 6: Run tests and build**

  Run: `npm test`
  Run: `npm run build`
  Expected: all tests and build pass without warnings.

- [ ] **Step 7: Commit**

  ```bash
  git add package.json package-lock.json src/pages/index.astro src/scripts/garden-scene.ts src/styles/home.css tests/garden-scene.test.mjs
  git commit -m "feat: add section-aware meteor scene"
  ```

### Task 4: Visual verification and refinement

**Files:**
- Modify: `src/styles/home.css` only when screenshot findings require it
- Modify: `src/scripts/garden-scene.ts` only when runtime findings require it

**Interfaces:**
- Consumes: complete homepage from Tasks 1–3.
- Produces: verified desktop, mobile, keyboard, and reduced-motion behavior.

- [ ] **Step 1: Start Astro in required background mode**

  Run: `npx astro dev --background`
  Confirm with: `npx astro dev status`

- [ ] **Step 2: Capture desktop and mobile screenshots**

  Inspect at approximately 1440×1000 and 390×844. Verify hierarchy, clipped edges, screenshot layers, edge-only meteor placement, text contrast, and absence of horizontal overflow.

- [ ] **Step 3: Verify keyboard and reduced-motion behavior**

  Tab through every project link and confirm activation parity. Emulate `prefers-reduced-motion: reduce` and confirm there is no continuous animation.

- [ ] **Step 4: Correct concrete visual/runtime findings**

  Make only changes tied to observed defects. If behavior changes, add a failing regression test before the fix.

- [ ] **Step 5: Run final verification and stop the server**

  Run: `npm test`
  Run: `npm run build`
  Run: `npx astro dev stop`
  Expected: tests/build pass and the background server is stopped.

- [ ] **Step 6: Commit**

  ```bash
  git add src/styles/home.css src/scripts/garden-scene.ts tests
  git commit -m "fix: refine geometric garden presentation"
  ```
