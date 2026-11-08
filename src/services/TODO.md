# Services

## TODO:
Implement based on ./docs/blueprint

- more complex helpers or services
- non-pure

1. localizationService - i18next + react-i18next setup and anything around it that hooks alone don't cover
2. contrastReportService - for calculating on the fly contrast compliance report from the app design system

### Localizations - more detail

- use i18next + react-i18next and hooks where possible. No language-detector plugin: the initial
  language comes from `../utils/setLanguage`.
- default language is Czech (`cs`), second English (`en`). No other languages are planned.
  This overrides the blueprint's English default.
- I want ALL text strings to be included in the json definition. NOTHING will be hardcoded (not even accessibility tags).
- I want the json config files with translations to be as structured as possible to make editing an easy task
- Start from the blueprint copy (`docs/blueprint/portfolio-handoff/src/locales/{en,cs}.json`, 144 keys each,
  complete in both languages) and **restructure it** into the shape below. Keep the `[bracket]` placeholders.
- `about.body` contains `<em>`: render with `<Trans>`, never `dangerouslySetInnerHTML`.

#### Files (`src/locales/`)

- `cs.json`, `en.json`: only text that differs between languages. Strictly `shared` / `pages` / `other`.
- `common.json`: one file shared by both languages, registered in i18next as the `common` namespace.
  Holds every value that is identical in cs and en: URLs (LinkedIn, GitHub, companies, demos, source code),
  stack tag names, job years, company names, project slugs / order / status / media type.
- Settings are NOT in any locale file: they are code constants in `src/config/siteConfig.ts`
  (`IT_START_DATE`, see `../utils/TODO.md`; `IS_OPEN_TO_WORK`, see `../pages/TODO.md`).
  Only their text representation is localised (e.g. `pages.mainPage.hero.availability.openToWork`).
- Rule of thumb: if a data value would be the same in `cs.json` and `en.json`, it goes to `common.json`;
  if it is a setting you would flip or change in code (date, flag), it goes to `siteConfig.ts`.
  Link entries across files by a stable id or slug (e.g. jobs by id, projects by slug).

#### Structure

- Project content (card text and detail text) is stored once, under `pages.projectPage.projects.<slug>`.
  The `projectCard` on mainPage reads its kind / title / summary from there.
- Slugs: `moje-hory`, `self-hosted`, `agent-rules`, `three-glasses` (this is also the card order).
  Only `moje-hory` has detail copy; the other three get the same keys filled with `[bracket]` placeholders.
- The 404 page needs its own copy (not in the blueprint), under `pages.notFoundPage`.

example:

``` json
    {
        "shared": {
            "navigation": {
                "items": {
                    "experience": "Experience",
                    "projects": "Projects",
                    "about": "About",
                    "contact": "Contact"
                },
                "languageToggle": {
                    "cs": "CZ",
                    "en": "EN"
                }
                // ...
            },
            "components": {
                // footer, langSwitch, themeSwitch, projectCard labels ("Read more"), ...
            }
        },
        "pages": {
            "mainPage": {
                "hero": { "...": "..." },
                "experience": { "...": "..." }
                // about, contact, ...
            },
            "projectPage": {
                "labels": { "...": "facts, sections, roles, next, backToProjects ..." },
                "projects": {
                    "moje-hory": {
                        "card": { "kind": "01 · Angular app", "title": "Moje Hory", "summary": "..." },
                        "detail": { "prompt": "cat moje-hory", "lead": "...", "...": "..." }
                    }
                    // self-hosted, agent-rules, three-glasses
                }
            },
            "contrastReportPage": { "...": "..." },
            "notFoundPage": { "...": "..." }
        },
        "other": {
            "meta": { "title": "...", "description": "..." }
        }
    }
```

#### Years of experience in copy

- The count comes from `../utils/calculateYearsOfPraxis` (start date from the `IT_START_DATE` constant in `src/config/siteConfig.ts`).
- The big hero numeral is digits. Everywhere else the count is **spelled out as a word** via
  `../utils/numberToWords` (range 7–20, digits outside it): experience title ("Seven years shipping…" /
  "Sedm let Reactu…"), meta title and description, Moje Hory lead ("after seven years" / "po sedmi letech").
- Pass the word as an interpolation value and use i18next plurals for the noun (cs: one / few / other,
  en: one / other), so the copy stays correct if the number ever changes. Capitalise when it starts a sentence.

### contrastReportService - more detail

- Source of truth for colors is `src/styles/theme.css`. Do NOT duplicate hex values in TS.
- Read the CSS variables at runtime with `getComputedStyle` from two hidden probe elements
  (one with `data-theme="light"`, one without), so the report always reflects the current styles.
- The list of pairs (which foreground token on which background token, its role, whether it is large
  text / UI / decorative) is kept in TS. Take it from `docs/blueprint/portfolio-handoff/design-source/Compliance*.dc.html`
  and keep it in sync with `theme.css`.
- Ratios with the WCAG 2.2 relative luminance formula; thresholds AA 4.5 / 3 (large, UI), AAA 7 / 4.5.
  Colors with alpha (e.g. `--header-bg`) are composited over their background first.
- Decorative pairs are listed but excluded from the totals.
- Keep the math (parse color, luminance, ratio, grading, summary) pure and unit-tested; only the
  probing of CSS variables touches the DOM.
- Verdict text is **derived from the results**: the JSON holds variants (all pass AA / some fail AA;
  all body text AAA / not all), and the list of pairs that miss AAA is generated.
- "Checked {{date}}" shows the **build date**, injected by Vite (`define`), not today's date.
