# Bunderstack Diamond Card & Live Asset Integration Design

## Purpose

Update the Bunderstack project territory on the homepage to reflect its live site deployment at `https://bunderstack.kcrz.dev/`. This includes replacing placeholder assets with live site screenshots and brand logo, redesigning the card into a sharp chamfered diamond silhouette across all platforms, and adding an authentic "Proud" die-cut sticker tag to celebrate the flagship project.

## Requirements & Scope

1. **Live Destination & URL**:
   - Change project link in `src/data/projects.ts` from GitHub to `https://bunderstack.kcrz.dev/`.
   - Update display label in URL pill to `bunderstack.kcrz.dev`.

2. **Brand Assets**:
   - **Logo**: Extracted from `https://bunderstack.kcrz.dev/logo-192.png` and placed in `public/projects/bunderstack-logo.png`. Rendered beside or directly above the project title in `ProjectTerritory.astro`.
   - **Screenshot**: Captured from live site `https://bunderstack.kcrz.dev/`, compressed as `public/projects/bunderstack.webp`, and displayed in the media column of the featured territory.

3. **Chamfered Diamond Geometry**:
   - Silhouette for `[data-project-id="bunderstack"]` uses a responsive chamfered diamond polygon on desktop, tablet, and mobile (`<= 760px`).
   - The dynamic border highlight (`::before` layer with spotlight tracking) traces the exact diamond perimeter.
   - Inner content padding is calibrated so the logo, title, description, and screenshot remain centered and completely unobstructed.

4. **"Proud" Die-Cut Sticker Tag**:
   - Affixed to the top-left chamfered edge.
   - Rotated `-8deg` with a layered die-cut border, realistic drop shadow, and crisp typography (`var(--font-accent)` / Tektur).
   - Elevated on card hover/focus.

## Component Changes

- `src/data/projects.ts`: Update `href` for `bunderstack`.
- `src/components/home/ProjectGarden.astro`: Add `bunderstack` entry in `projectImages` referencing `bunderstack.webp`.
- `src/components/home/ProjectTerritory.astro`:
  - Add optional `logoSrc`, `logoAlt`, and `stickerTag` props.
  - Render sticker tag and logo.
- `src/styles/home.css`:
  - Styles for `.project-territory__sticker` (die-cut, rotation, shadows).
  - Styles for `.project-territory__title-logo` (emblem alignment with heading).
  - Chamfered diamond clip-path and responsive adjustments for desktop and mobile `<= 760px`.

## Verification Plan

- `bun run build` verifies static generation and type safety.
- Capture headless chromium screenshots for both desktop (1440x900) and mobile (390x844).
- Verify sticker rendering, logo alignment, diamond clipping, and link navigation.
