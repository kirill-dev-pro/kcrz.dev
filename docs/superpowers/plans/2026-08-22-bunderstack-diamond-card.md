# Bunderstack Diamond Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Bunderstack homepage territory with live site assets (`bunderstack.kcrz.dev`), a chamfered diamond silhouette on all screen sizes, brand logo integration, and an authentic "Proud" die-cut sticker tag.

**Architecture:** Update project metadata in `projects.ts`, capture live assets into `public/projects/`, enhance `ProjectTerritory.astro` and `ProjectGarden.astro` to support sticker tags and brand logos, and style the chamfered diamond clip-paths and sticker badge in `home.css`.

**Tech Stack:** Astro, CSS clip-path / modern styling, Chromium headless asset capture, WebP / Sharp.

## Global Constraints

- No eyebrows or category kickers above headings (per AGENTS.md).
- Preserve all existing animations, hover spotlights, and Three.js scene interactions.
- Maintain responsive behavior and accessibility across desktop (1440px), tablet (768px), and mobile (390px).
- All links must remain functional without JavaScript.

---

### Task 1: Fetch and Prepare Live Brand Assets

**Files:**
- Create: `public/projects/bunderstack-logo.png`
- Create: `public/projects/bunderstack.webp`

- [ ] **Step 1: Download the official Bunderstack logo**
Fetch `https://bunderstack.kcrz.dev/logo-192.png` and save to `public/projects/bunderstack-logo.png`.

- [ ] **Step 2: Capture live screenshot and compress to WebP**
Capture a 1440x900 viewport of `https://bunderstack.kcrz.dev/` with Chromium headless, resize/compress to `public/projects/bunderstack.webp` (high quality, 16:9 ratio).

- [ ] **Step 3: Verify assets in place**
Verify both files exist in `public/projects/` and check dimensions and file sizes.

---

### Task 2: Update Project Data & Component Interfaces

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/components/home/ProjectGarden.astro`
- Modify: `src/components/home/ProjectTerritory.astro`

- [ ] **Step 1: Update Bunderstack URL in `src/data/projects.ts`**
Change Bunderstack `href` from `https://github.com/kirill-dev-pro/bunderstack` to `https://bunderstack.kcrz.dev/`.

- [ ] **Step 2: Add logo, alt text, and sticker configuration in `ProjectGarden.astro`**
Add Bunderstack screenshot and metadata mapping in `projectImages`.

- [ ] **Step 3: Update `ProjectTerritory.astro` to support logo and sticker tag**
Render `.project-territory__sticker` for sticker tags (like "Proud") and `.project-territory__logo` inside the title row.

---

### Task 3: Style the Chamfered Diamond Silhouette & "Proud" Sticker Tag

**Files:**
- Modify: `src/styles/home.css`

- [ ] **Step 1: Add sticker tag styling**
Add `.project-territory__sticker` styles (rotations `-8deg`, die-cut borders, multi-layer shadow, typography, hover effect).

- [ ] **Step 2: Add logo styling**
Add `.project-territory__logo` styles (crisp sizing, vertical centering with the project heading).

- [ ] **Step 3: Implement chamfered diamond silhouette across all platforms**
Update `[data-project-id="bunderstack"]` clip-path and padding on desktop and mobile (`<= 760px`) to maintain the chamfered diamond shape everywhere.

---

### Task 4: Build Verification and Visual Inspection

**Files:**
- Verify: `bun run build`

- [ ] **Step 1: Run production Astro build**
Execute `bun run build` and ensure clean compilation.

- [ ] **Step 2: Capture and inspect screenshots on desktop and mobile**
Render desktop (1440x900) and mobile (390x844) captures to verify visual polish, alignment, and lack of layout regressions.
