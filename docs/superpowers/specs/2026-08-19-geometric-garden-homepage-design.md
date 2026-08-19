# Kcrz.dev Geometric Garden Homepage Design

## Purpose

The homepage introduces Kirill through a concise personal thesis and a selected body of work. Its single job is to make the relationship between the projects legible: Bunderstack is the foundational opus magnum; Bunderhost and the shipped products demonstrate what grows from it.

Brand copy:

- Name: `Kcrz.dev`
- Thesis: `reduce complexity, touch grass`
- Primary language for the first version: English

## Aesthetic direction

The visual system is **Geometric Garden After Dark**: a near-black digital landscape built from straight-edged polygons, hard turns, technical traces, and restrained neon light. It combines the atmosphere of a nocturnal garden with the behavior of an operating system. Shapes must not read as soft blobs or rounded SaaS cards.

### Tokens

- Void: `#050608`
- Carbon: `#0b0d12`
- Paper: `#f2f5f3`
- Muted: `#92999a`
- Bunderstack violet: `#9b7bff`
- Bunderhost cyan: `#55e6ff`
- HR Breakers acid: `#d7ff43`
- Telegram VPN blue: `#3f87ff`
- Klaud ember: `#ff7043`

Typography uses a precise grotesk display face, a highly readable sans-serif body face, and a compact monospace utility face. The first version may use system/local fonts to avoid blocking rendering and external requests, but the roles and hierarchy must remain distinct.

## Page structure

### Navigation

A quiet fixed navigation layer contains `Kcrz.dev`, anchors for `About` and `Work`, and a link to `Blog`. It has no filled rectangular bar; a fine rule or clipped backdrop may appear after scrolling.

### Hero / personal introduction

The first viewport is spacious. `Kcrz.dev` is the largest typographic object, followed by `reduce complexity, touch grass`. A short summary describes a product-minded developer reducing infrastructure and product complexity. Angular construction lines and one geometric “growth marker” connect the hero to the project map below.

### Project territories

Projects are not uniform cards. They occupy an asymmetric map of straight-edged territories. Each territory exposes a project name, a factual one-sentence description, role/status labels, and a direct link.

1. **Bunderstack** — the dominant, full-width first territory. A batteries-included Bun backend organized around one type-safe oRPC graph. It visually feeds the other territories.
2. **Bunderhost** — hosting for Bunderstack applications with Git-connected deploys, managed resources, and PR preview environments.
3. **HR Breakers** — AI-assisted resume adaptation that turns a resume and job description into a targeted PDF.
4. **Telegram VPN** — traffic-based VPN access across devices with Telegram, billing, and a user dashboard.
5. **Klaud** — group-based identity provider for OAuth/OIDC and SAML applications.

Hover/focus activates one project at a time. Its territory brightens and gains visual area without making surrounding content inaccessible. Only the active project supplies a strong accent color; inactive territories remain subdued so the map never becomes a five-color neon wall. Two or three angular screenshot plates appear above it with hard clipped corners and short mechanical motion. Touch devices use a quiet vertical territory list with screenshots in the normal document flow rather than depending on hover.

## Background motion

One fixed Three.js canvas sits behind the semantic DOM and never receives pointer events. The scene has three section-driven modes:

- Hero: sparse stars, construction traces, and low contrast.
- Bunderstack: a restrained API/topology lattice with pulses moving outward.
- Projects: slightly higher particle density and palette influence from the active territory.

Neon meteors travel only through the outer 10–15% viewport gutters. Their paths use straight segments with one or two abrupt zig-zag turns; they never arc through the central reading column. Trails fragment into short geometric segments. IntersectionObserver updates the scene mode, while pointer/focus activation supplies the current project color.

Motion is decorative and progressively enhanced. Meteors remain rare rather than becoming a constant stream. `prefers-reduced-motion` renders a static composition. Small screens use a static canvas/CSS composition with no meteors. WebGL failure leaves the full page usable and visually complete through CSS alone.

## Architecture

- Astro owns document structure, metadata, content, and static rendering.
- CSS owns layout, clipped project territories, hover/focus states, typography, and most motion.
- A small framework-free TypeScript module owns active section/project state and exposes it through `data-*` attributes and custom events.
- A Three.js module owns the decorative canvas and consumes section/project state. It does not own content or interaction.
- Project metadata lives in one typed data module so DOM rendering and behavior share stable IDs/colors.

No React or SolidJS is included in the first version. A Solid Astro island may be introduced later only if a feature develops complex state that materially benefits from fine-grained reactivity.

## Accessibility and quality constraints

- All content and links work without JavaScript or WebGL.
- Keyboard focus activates the same project treatment as pointer hover.
- Contrast remains readable while effects are active.
- `prefers-reduced-motion` disables continuous animation and transforms.
- Mobile layouts never require hover and do not horizontally overflow.
- Decorative canvas is `aria-hidden` and ignored by assistive technology.

## Verification

- Unit tests cover project metadata, scene-mode selection, and reduced-motion/static behavior helpers.
- Astro production build must pass.
- Desktop and mobile screenshots are inspected for hierarchy, clipping, text contrast, overflow, and content obstruction.
- Keyboard navigation and reduced-motion mode receive manual checks.
