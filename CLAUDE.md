# Personal page

This is a green field project of my personal page.

Design concept is stored in ./docs/blueprint. The code implementation must implement it visually 1:1.

Technology and stack wise, use instruction from system level CLAUDE.md.

I have prepared some partial guidelines to do several TODO.md files across the workspace that give better clarity on how I want you to scaffold things. Please use them for guidance.

If anything unclear, ask user for consultation or assistance.

## Guiding principles: mobile first, accessible first

Accessibility is a core principle of this site, on the same level as mobile first, not a final
polish step. Every component, page and decision is built accessible from its first version; a
feature that is not accessible is not done. The contrast report page (`/accessibility`) is one
public manifestation of this principle, not the whole of it.

Target: **WCAG 2.2 Level AA everywhere**, AAA wherever the design allows (body and paragraph text
already meets AAA contrast). `docs/blueprint/portfolio-handoff/docs/design.md` section 9 is the
baseline; the rules below extend it.

### Structure and semantics
- Landmarks: `header > nav`, `main`, `footer`. Exactly one `h1` per page, no skipped heading levels.
- A "Skip to content" link as the first focusable element, visible on focus, text from the locale files.
- Native elements first: real `<a href>` for navigation, `<button>` for actions, `<table>` with
  `<caption>` and `<th scope>` for tabular data (contrast report), `<dl>` for definition lists
  (About facts, project facts grid), `<ul>`/`<ol>` for lists. ARIA only where HTML has no equivalent.
- Compound visual text reads as one phrase: the hero "7" + "years of / React." is announced as
  "7 years of React" (the forced line break is visual only).
- Terminal prompts (`franta@brno:~$ whoami`) and ASCII decorations: decorative parts are
  `aria-hidden="true"`; any information they carry is also available as plain text.

### Keyboard and focus
- Everything is operable by keyboard alone, in a logical order matching the visual order. No traps.
- Visible focus ring on every interactive element (`:focus-visible`, `outline: 2px solid var(--accent);
  outline-offset: 3px`), never removed without a replacement.
- Mobile menu: trigger has `aria-expanded` + `aria-controls`; `Esc` closes it and returns focus to the
  trigger; it closes on link click.
- Overlay (photo): it is a modal dialog (`role="dialog"`, `aria-modal="true"`, accessible name);
  focus moves into it on open, is trapped while open, `Esc` and a visible close button close it,
  and focus returns to the element that opened it. Background scroll is locked.
- Route changes (SPA): update `document.title` per page (localised) and move focus to the new page's
  `h1` (or announce it), so screen reader users notice the navigation. Scroll to top on navigation,
  except for in-page hash links.

### Names, labels, language
- Every accessible name, `aria-label`, `alt` and visually hidden text comes from the locale files
  (nothing hardcoded, see `src/services/TODO.md`).
- Icon-only buttons have an `aria-label`; icons themselves (`lucide-react`) are `aria-hidden="true"`.
- Link text must make sense out of context: the four "Read more" links include the project title
  in their accessible name (e.g. visually hidden suffix). Same for "Next project".
- External links (companies, LinkedIn, GitHub, demos): the ↗ icon is decorative; if a link opens a
  new tab, say so in its accessible name. Prefer not opening new tabs.
- `<html lang>` always matches the active language and updates on switch. The language switch
  buttons use `aria-pressed`, and the accessible name is the full language name in its own
  language with a matching `lang` attribute (e.g. "Čeština" `lang="cs"`, "English" `lang="en"`),
  even though the visible label is "CZ" / "EN".
- Theme toggle: `aria-pressed` on the segmented control (mobile), `aria-label` "Switch to light /
  dark theme" on the icon button (desktop).

### Visual and motion
- Contrast as in the token rules (`accent` vs `accent-ink`, `fg-subtle` only for meta, dark label on
  orange). Any new color pair is added to the contrast report pair list in the same change.
- Never color alone: status dots, pass/fail in the report and the current timeline item always have
  text (or an accessible name) as well.
- Touch targets at least 44 × 44 px (stricter than WCAG 2.2's 24 px minimum, as the design specifies).
- Reflow: no horizontal page scroll at 320 px width or at 400 % zoom; text survives 200 % text-only
  zoom and WCAG text-spacing overrides without clipping. Use `rem` for font sizes so user font
  settings are respected. The only allowed horizontal scroll is inside terminal blocks, which are
  then keyboard-focusable (`tabindex="0"` with an accessible name).
- `prefers-reduced-motion`: the blinking cursor stops, and any future animation or smooth scrolling
  is disabled.
- Theme defaults respect `prefers-color-scheme`; both themes are fully supported, neither is an
  afterthought.

### Verification
- **Current phase: no dedicated accessibility testing.** Build every page and component with the
  rules above in mind, but do not add accessibility test suites, axe tooling or audit steps yet.
- Regular unit tests still query by role and accessible name (React Testing Library), as the
  React rules require.
- Planned for the next phase (do not start without the user): keyboard behaviour tests (menu and
  overlay `Esc`, focus trap, focus return), automated axe checks on every route in both themes and
  languages (`@axe-core/playwright`, possibly `vitest-axe`, new dev deps needing approval), and a
  manual keyboard-only and screen reader (Orca) pass.

## Agreed decisions (2026-11-08)

Settled with the user. They override `docs/blueprint` wherever the two differ. Do not re-ask them.
Task-level details live in the `TODO.md` files (root and `src/*/TODO.md`).

### Blueprint
- Start with `docs/blueprint/portfolio-handoff/README.md` and `docs/design.md` (spec, tokens,
  layout, components, a11y). `docs/blueprint/Portfolio.pdf` is the visual reference.
- `design-source/*.html` are only for copying exact values (paddings, sizes, colors). They depend
  on the design tool's runtime and do not run.
- `docs/blueprint/` is gitignored on purpose. Copy what you need into `src/`; never import from
  `docs/`.

### Stack and dependencies
- React + TypeScript + Vite, npm, Node 24 (`.nvmrc` + `engines`). Tooling, naming and folder rules
  exactly as in `~/.claude/rules/react-typescript.md`. Package name: `personal-page`.
- Approved runtime deps (no further approval needed): `react`, `react-dom`, `tailwindcss` v4 +
  `@tailwindcss/vite`, `i18next`, `react-i18next`, `react-router` (v7, library/SPA mode),
  `lucide-react`, `@fontsource-variable/ubuntu-sans`, `@fontsource-variable/ubuntu-sans-mono`.
  Anything else: ask first.
- Approved dev dep beyond the rules file: `@playwright/test` (visual QA only, see below).
- No `i18next-browser-languagedetector`: language detection is `src/utils/setLanguage`.
- Path alias `@/` → `src/`. Barrel files: off. TDD: on.

### Hosting and rendering
- Self-hosted on the user's Ubuntu VPS. **No Vercel.** The design copy ("This site, self-hosted",
  "Served from Ubuntu, by me") is accurate and stays.
- Plain SPA: one `index.html`, client-side routing, deliverable is a static `dist/`. The README
  documents the nginx fallback (`try_files $uri $uri/ /index.html;`).
- Routes: `/` (mainPage), `/projects/:slug` (projectPage), `/accessibility` (contrastReportPage),
  and a catch-all 404 page (not in the design: minimal, same visual language, copy in JSON).
- Language is not part of the URL.

### Language and theme
- Languages: `cs` (default) and `en`. UI label "CZ", language code `cs`.
- Initial language: `localStorage` → browser language (`cs` or `sk` → `cs`, anything else → `en`)
  → `cs`. Remember the user's choice in `localStorage`, keep `<html lang>` in sync.
  This overrides the blueprint's English default.
- Initial theme: `localStorage` → `prefers-color-scheme` → dark. Applied by the no-flash inline
  script in `index.html` before React mounts (see blueprint README), toggled in place via
  `data-theme="light"` on `<html>`.

### Content
- `[square bracket]` placeholders stay for now; the user fills them in before going live.
- Images (screenshots, photo) use `ImagePlaceholder` until real files exist.
- The IT start date (input for `calculateYearsOfPraxis`) is a code constant `IT_START_DATE` in
  `src/config/siteConfig.ts` (placeholder `'01-2019'`), never in the locale files.
- The availability flag is a code constant `IS_OPEN_TO_WORK` in the same file. Its text lives in the
  locale files. When `false`, the availability badge is hidden (no "not available" state).

### Visual QA
- Verify "1:1" with Playwright screenshots of every route at 390 px and 1440 px, in dark and light
  theme, compared against `docs/blueprint/Portfolio.pdf`. Fix differences before calling a page
  done. Screenshot output goes to a gitignored folder.
