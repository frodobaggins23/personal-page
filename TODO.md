# repo root

Decisions behind these items are in `CLAUDE.md` → "Agreed decisions". Follow them over the blueprint.

## TODO:
1. Install dependencies based on the system-level CLAUDE instructions and `~/.claude/rules/react-typescript.md`.
   Tech stack React/TypeScript/Vite. Approved runtime deps are listed in `CLAUDE.md`; nothing else without asking.
2. Name of the project: Personal-page (package name `personal-page`).
3. Folder structure - small project (layers at the top of `src/`, create folders only when needed).
   Locale files live in `src/locales/` (`cs.json`, `en.json`, `common.json`).
4. Look into docs/blueprint to see how the project will look like. Dependencies are already decided (see `CLAUDE.md`).
5. ~~Deploy to Vercel~~ Dropped: the site is self-hosted on the user's Ubuntu VPS. Produce a static build
   (`npm run build` → `dist/`) and document the nginx SPA fallback in the README. No deploy step here.
6. Populate README.md (purpose, setup, scripts, tests, VPS/nginx notes, how to replace placeholders).
7. Visual QA with Playwright screenshots (390 / 1440 px × dark / light) against `docs/blueprint/Portfolio.pdf`.

## Suggested order
1. Scaffold + tooling (Vite React-TS, strict TS, `@/` alias, Prettier, ESLint, Vitest + RTL, Husky,
   lint-staged, commitlint). Verify `typecheck`, `lint`, `test:run`, `build`.
2. Foundation: `src/styles/theme.css`, fonts, no-flash theme script, i18n setup with restructured
   locale files, router with all routes + 404.
3. Utils and services, test-first (see `src/utils/TODO.md`, `src/services/TODO.md`).
4. Shared components (`src/components/TODO.md`).
5. Pages: mainPage → projectPage → contrastReportPage (`src/pages/TODO.md`).
6. Playwright visual QA and fixes.
7. README. Remove the `TODO.md` files under `src/` once their items are done.

Never commit without the user asking; propose Conventional Commit messages per phase.
