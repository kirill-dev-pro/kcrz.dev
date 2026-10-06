# Amsterdam Housing Hunt Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-quality Russian blog post in MDX about renting in Amsterdam in September 2025, preserving the author's authentic voice, integrating LinkCards, Telegram embeds, and the uploaded chat warning image.

**Architecture:** Astro MDX content collection entry (`src/content/blog/amsterdam-housing-hunt-ru.mdx`) referencing `LinkCard.astro`, `TelegramEmbed.astro`, and `Image` from `astro:assets`.

**Tech Stack:** Astro, MDX, TypeScript.

## Global Constraints
- Do not change the author's speaking style or tone of voice; preserve conversational syntax while fixing speech-to-text slips.
- Do not add eyebrows above headings.
- Do not number sections.
- Use descriptive, self-explanatory headings.

---

### Task 1: Create the MDX Blog Post

**Files:**
- Create: `src/content/blog/amsterdam-housing-hunt-ru.mdx`
- Asset: `src/assets/blog/amsterdam-housing/expat-chat-warning.jpg`

- [ ] **Step 1: Write `src/content/blog/amsterdam-housing-hunt-ru.mdx` with all sections and components**
- [ ] **Step 2: Verify site builds or runs cleanly with `npm run build` or Astro check**
- [ ] **Step 3: Commit the new article to git**
