# Styles

## TODO:
Implement based on ./docs/blueprint

- Tailwind v4 (`@tailwindcss/vite`)
- use css variables for defining color pallette and sizings
- copy `docs/blueprint/portfolio-handoff/src/styles/theme.css` into this folder as the single source of
  design tokens and import it once from the entry CSS (it already contains `@import "tailwindcss";`).
  Dark is the default, light via `data-theme="light"` on `<html>`; no `dark:` prefixes needed.
- fonts: `@fontsource-variable/ubuntu-sans` and `@fontsource-variable/ubuntu-sans-mono`, imported once
  in the entry. Self-hosted through the bundle, no Google Fonts request.
- global focus ring: `outline: 2px solid var(--accent); outline-offset: 3px` on `:focus-visible`
- blinking cursor animation (1.1 s steps(1)) disabled under `prefers-reduced-motion`
- `src/services/contrastReportService` reads the colors from these variables at runtime: when you add,
  rename or remove a color token, update its pair list too
