# personal-page

Personal portfolio site (React + TypeScript + Vite + Tailwind CSS v4), Czech by default with an
English version, dark and light themes. A plain SPA: `npm run build` produces a static `dist/`.

Design: "Night trail" (see `docs/blueprint/`, gitignored). Accessibility target: WCAG 2.2 AA, see
`CLAUDE.md`.

## Setup

```sh
nvm use          # Node 24, from .nvmrc
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Command                        | What it does                                      |
| ------------------------------ | ------------------------------------------------- |
| `npm run dev`                  | Vite dev server                                   |
| `npm run build`                | Typecheck + production build into `dist/`         |
| `npm run preview`              | Serve `dist/` locally                             |
| `npm run typecheck`            | `tsc -b`                                          |
| `npm run lint`                 | ESLint                                            |
| `npm run format`               | Prettier (write); `format:check` only checks      |
| `npm run validate:locale-keys` | Keys missing / obsolete in `en.json` vs `cs.json` |
| `npm test`                     | Vitest in watch mode                              |
| `npm run test:run`             | Vitest, single run (also the pre-push hook)       |
| `npx playwright test`          | E2E smoke tests (build + serve + Chrome)          |

## Tests

Vitest + React Testing Library (jsdom). Tests live in `__tests__/` next to the code. Logic
(utils, contrast service) is written test-first.

End-to-end smoke tests (`e2e/smoke.spec.ts`, Playwright with the system Chrome,
`channel: 'chrome'`) build the app, serve it on port 4173 and check that it opens, the main page
renders, the navigation works on desktop and mobile, and every route opens. Run them with
`npx playwright test`.

## Content and placeholders

- Copy: `src/locales/cs.json`, `en.json` (text that differs) and `common.json` (URLs, company
  names, stack, project order, terminal output). Everything in `[square brackets]` is a
  placeholder to fill in before going live. Links with placeholder URLs render as `#`.
- Settings: `src/config/siteConfig.ts` → `IT_START_DATE` (`mm-yyyy`, drives the years of React
  everywhere) and `IS_OPEN_TO_WORK` (shows or hides the availability badge).
- Images: screenshots and the photo are `ImagePlaceholder`s until real files exist.
- Colors: `src/styles/theme.css` is the single source of tokens. The contrast report
  (`/accessibility`) measures them at runtime; when you add, rename or remove a color token,
  update `PAIR_DEFINITIONS` in `src/services/contrastReportService.ts`.

## Deploy (Ubuntu VPS + nginx)

Build, copy `dist/` to the server and use the SPA fallback so client-side routes work:

```nginx
server {
    server_name example.com;
    root /var/www/personal-page/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```
