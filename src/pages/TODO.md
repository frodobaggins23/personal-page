# pages components

## TODO:
Implement based on ./docs/blueprint

page specific components belong here to this folder
components that would be reused across pages, should go to src/components

Routing: `react-router` v7 in library (SPA) mode. Language is not part of the URL.

1. mainPage (`/`)
    - each section is a separate sub-component
    - the big number ("7" in design) is calculated based on util "../utils/calculateYearsOfPraxis".
      The numeral itself is digits; everywhere else in the copy the count is spelled out
      (see "Years of experience in copy" in `../services/TODO.md`)
    - reference section that features 4 project uses "../components/projectCard",
      order: moje-hory, self-hosted, agent-rules, three-glasses
    - availability status: the value is the boolean constant `IS_OPEN_TO_WORK` in `src/config/siteConfig.ts`.
      `true` → render the `StatusBadge` (`success` dot) with the localised text
      `pages.mainPage.hero.availability.openToWork` (blueprint copy "Open to new roles · [from MONTH YEAR]").
      `false` → render nothing (no badge, no "not available" text).
    - the small photo at the bottom section should enlarge and open in an overlay when clicked. use "../components/overlay"
      (image placeholder for now)
2. projectPage (`/projects/:slug`)
    - there are 4 projects in this app: `moje-hory`, `self-hosted`, `agent-rules`, `three-glasses`
    - all use the same shared components and use the same api
    - they load content dynamically based on url slugs, from `pages.projectPage.projects.<slug>`
      (texts) and `common.json` (slug order, status, media, links, stack)
    - only moje-hory has real copy; the other three render the same template with `[bracket]` placeholders
    - "Next project" cycles through all 4 in card order (after three-glasses comes moje-hory)
    - unknown slug → notFoundPage
3. contrastReportPage (`/accessibility`)
    - is a standalone page, referrenced from footer
    - as the content is unique, it will probably not use any shared component, but will utilize its own subcomponents nested in its folder.
    - the actual data should NOT be static but rather on-the fly generated from the current app styles and design variables
    - use "../services/contrastReportService"
    - Dark / Light switch for the table defaults to the current theme
    - verdict text is derived from the results; "Checked" date is the build date
4. notFoundPage (catch-all `*`)
    - not in the design: minimal page in the same visual language (e.g. a terminal-style prompt + link home)
    - copy in `pages.notFoundPage` in the locale files
