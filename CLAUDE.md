# Personal page

My personal portfolio site: React + TypeScript + Vite SPA, Czech (default) and English, dark and
light theme, self-hosted as a static `dist/`. Tooling, naming, folder and testing rules come from
`~/.claude/CLAUDE.md` and `~/.claude/rules/react-typescript.md`; this file adds what is specific to
this repo and wins on conflict.

The design is in `docs/blueprint/` and the implementation matches it visually 1:1, except for the
deliberate deviations listed under "Agreed decisions".

## Commands

| Command                | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Vite dev server                                                  |
| `npm run build`        | `tsc -b` + production build into `dist/`                         |
| `npm run typecheck`    | `tsc -b`                                                         |
| `npm run lint`         | ESLint                                                           |
| `npm run lint:tailwind`| Tailwind classes that have a shorter canonical form (exit 1)     |
| `npm run format:check` | Prettier check (`format` writes)                                 |
| `npm run test:run`     | Vitest single run (`test` is watch mode)                         |
| `npx playwright test`  | E2E smoke tests (builds, serves `dist/`, drives Chrome)          |

Run Playwright **exactly** as `npx playwright test`, without extra flags or pipes: the sandbox
exclusion that lets Chrome start matches that exact command string.

Definition of done for any change: `typecheck`, `lint`, `lint:tailwind`, `format:check`,
`test:run` and `build` pass. A change to routing, navigation or page structure also gets a
Playwright run. Say plainly what was not run.

## Where things live

```
src/
  components/   shared UI, one folder per component (ProjectCard, Overlay, Timeline, ...)
  pages/        one folder per route: mainPage, projectPage, privacyByDesignPage,
                contrastReportPage, notFoundPage
                (page-specific sections and subcomponents are nested in the page folder)
  services/     localizationService (i18next setup), contrastReportService (WCAG math + CSS probing)
  hooks/        useLanguage, useTheme, useYearsOfPraxis, useDocumentTitle
  utils/        pure helpers (calculateYearsOfPraxis, setLanguage, setColorTheme, numberToWords, ...)
  config/       siteConfig (code constants), content (typed access to common.json), navigation
  locales/      cs.json, en.json, common.json
  styles/       theme.css (the single source of design tokens)
  types/        shared types
e2e/            Playwright smoke tests (smoke.spec.ts)
scripts/        repo tooling (lintTailwind.mjs)
```

Path alias `@/` → `src/`. No barrel files. Named exports only. TDD is on.

## Conventions

### Styling
- Tailwind v4 with the tokens in `src/styles/theme.css` (`bg-surface`, `text-fg-muted`,
  `border-line`, `text-accent-ink`, ...). No `dark:` prefixes: dark is the default, light is
  `data-theme="light"` on `<html>`, and every token re-themes in place.
- Never hard-code a color or font size that has a token. Font sizes in `rem`. Use the spacing scale
  (`h-15`, `gap-x-18`, `size-2.75`), not `h-[60px]`. Arbitrary values are for things the scale and
  tokens cannot express (radii, `flex-[999_1_520px]`, grid templates, odd font sizes from the design).
- Repeated one-off styles become a `@utility` in `theme.css` (see `nav-current`, `cursor-blink`),
  not an inline arbitrary value. Run `npm run lint:tailwind` after touching classes.
- Mobile first. The switch from mobile to desktop is `lg` (1024 px); two separate navigation
  components, `NavigationMobile` and `NavigationDesktop`.
- Exact paddings, sizes and colors for new work: `docs/blueprint/portfolio-handoff/design-source/*.html`
  (reference only, they do not run).
- Adding, renaming or removing a color token: update `PAIR_DEFINITIONS` in
  `src/services/contrastReportService.ts` in the same change. Any new color pair is added there.

### Content and i18n
- ALL user-visible text lives in the locale files, including `aria-label`, `alt` and visually hidden
  text. Nothing hard-coded in components.
- `cs.json` and `en.json` hold only text that differs between languages, strictly under
  `shared` / `pages` / `other`. `common.json` (i18next namespace `common`, also imported directly via
  `src/config/content.ts`) holds everything identical in both languages: URLs, company names, stack
  tags, job years, project slugs / order / status / media, terminal output. Rule of thumb: same value
  in cs and en → `common.json`; a setting you flip in code → `src/config/siteConfig.ts`.
- Both language files always have the same keys. i18next plurals need `_one`/`_other`, and Czech also
  `_few`.
- Project text is stored once under `pages.projectPage.projects.<slug>.{card,detail}`. Slugs and
  card order: `moje-hory`, `self-hosted`, `agent-rules`, `three-glasses`. Only `moje-hory` has real
  copy; the others render the same template with `[bracket]` placeholders.
- The years of React come from `calculateYearsOfPraxis(IT_START_DATE, now)`. The hero numeral is
  digits; everywhere else it is spelled out with `numberToWords` (7–20, digits outside) and passed
  through `useYearsOfPraxis()` (`count`, `yearsWord`, `yearsWordAfterPo`), with i18next plurals for the
  noun and `{{yearsWord, capitalize}}` at the start of a sentence.
- `about.body` contains `<em>`: render with `<Trans>`, never `dangerouslySetInnerHTML`.
- `[square bracket]` placeholders stay until the user fills them in before going live. Links whose
  value is not http(s) render as `#` (`getSafeExternalUrl`).
- Images (screenshots, photo) use `ImagePlaceholder` until real files exist.

### Contrast report (`/accessibility`)
- Never static: `contrastReportService` probes the live CSS variables under throw-away
  `[data-theme]` elements, so it always reflects `theme.css`. Colors with alpha are composited first.
- The math (parse, luminance, ratio, grading, summary, verdict) is pure and unit-tested; only the
  probing touches the DOM. Verdict text is chosen from the computed results, and "Checked" shows the
  build date (`__BUILD_DATE__`, injected by Vite).

### Utils and tests
- Utils are pure: clock, storage and `navigator` are injected, never read inside the function.
  Storage access may throw (private mode) and is handled.
- Tests live in `__tests__/` next to the code. Query by role and accessible name. Use
  `renderWithProviders` (`src/test/`) for components that need translations or the router.
- Unit tests never touch a real network or clock.

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
  except for in-page hash links, which scroll smoothly (instantly under reduced motion).

### Names, labels, language
- Every accessible name, `aria-label`, `alt` and visually hidden text comes from the locale files.
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
- Touch targets at least 44 × 44 px (stricter than WCAG 2.2's 24 px minimum).
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
- Regular unit tests still query by role and accessible name (React Testing Library).
- Planned for the next phase (do not start without the user): keyboard behaviour tests (menu and
  overlay `Esc`, focus trap, focus return), automated axe checks on every route in both themes and
  languages (`@axe-core/playwright`, possibly `vitest-axe`, new dev deps needing approval), and a
  manual keyboard-only and screen reader (Orca) pass.

## Agreed decisions

Settled with the user (2026-11-08). They override `docs/blueprint` wherever the two differ. Do not
re-ask them.

### Blueprint
- Start with `docs/blueprint/portfolio-handoff/README.md` and `docs/design.md` (spec, tokens, layout,
  components, a11y). `docs/blueprint/Portfolio.pdf` is the visual reference.
- `docs/blueprint/` is gitignored on purpose. Copy what you need into `src/`; never import from `docs/`.
- Deliberate deviations from the blueprint: language switch order is CZ then EN; the full header
  (language and theme switches, menu) is on every page, with a back link in the page body instead of
  the mockups' reduced project and report headers; interactive controls are at least 44 px; the 404
  page is new (terminal-free: heading, text, link home); the contrast report has extra rows for the
  inset panel colors.

### Stack and dependencies
- React + TypeScript + Vite, npm, Node 24 (`.nvmrc` + `engines`). Package name: `personal-page`.
- Approved runtime deps (no further approval needed): `react`, `react-dom`, `tailwindcss` v4 +
  `@tailwindcss/vite`, `i18next`, `react-i18next`, `react-router` (**v7**, library/SPA mode, not
  v8), `lucide-react`, `@fontsource-variable/ubuntu-sans`, `@fontsource-variable/ubuntu-sans-mono`.
  Anything else: ask first.
- Approved dev dep beyond the rules file: `@playwright/test` (visual QA only).
- No `i18next-browser-languagedetector`: language detection is `src/utils/setLanguage`.

### Hosting and rendering
- Self-hosted on the user's Ubuntu VPS. **No Vercel.** The design copy ("This site, self-hosted",
  "Served from Ubuntu, by me") is accurate and stays.
- Plain SPA: one `index.html`, client-side routing, deliverable is a static `dist/`. The README
  documents the nginx fallback (`try_files $uri $uri/ /index.html;`).
- Routes: `/` (mainPage), `/projects/:slug` (projectPage), `/privacy-by-design`
  (privacyByDesignPage, not a privacy policy), `/accessibility` (contrastReportPage),
  and a catch-all 404 page. An unknown project slug renders the 404 page. Language is not part of
  the URL.

### Language and theme
- Languages: `cs` (default) and `en`. UI label "CZ", language code `cs`.
- Initial language: `localStorage` → browser language (`cs` or `sk` → `cs`, anything else → `en`)
  → `cs`. Only an explicit switch is remembered in `localStorage` (the detected value is not
  persisted). `<html lang>` stays in sync.
- Initial theme: `localStorage` → `prefers-color-scheme` → dark. Applied by the no-flash inline
  script in `index.html` before React mounts (same storage key `theme` as `setColorTheme`), toggled
  in place via `data-theme="light"` on `<html>`.

### Settings in code
- `IT_START_DATE` (placeholder `'01-2019'`, `mm-yyyy`) and `IS_OPEN_TO_WORK` live in
  `src/config/siteConfig.ts`, never in the locale files. Only the availability text is localised;
  when the flag is `false` the badge is hidden (no "not available" state).

### E2E tests
- Playwright (`e2e/smoke.spec.ts`) is a smoke suite, not a visual comparison: the app opens, the main
  page renders, the navigation is clickable (desktop links, mobile menu, hash jumps), and every route
  opens (all four project pages, the contrast report, the 404 page). Runs at 1440 px and 390 px with
  the language pinned to `en`.
- Any uncaught page error or console error fails a test (an auto fixture), so a missing asset or a
  runtime exception shows up even if the page looks fine.
- Queries use roles and accessible names, like the unit tests. Scope a query to its landmark when a
  link name is ambiguous (e.g. `#mobile-menu`, `contentinfo`).
- Matching the design 1:1 against `docs/blueprint/Portfolio.pdf` is a manual review, not automated.
