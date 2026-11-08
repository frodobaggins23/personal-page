# Utils

## TODO:
Implement based on ./docs/blueprint

- pure functions
- basic helpers, not complex services
- test-first (TDD is on). No real clock, storage or navigator in tests: inject them as arguments.

1. calculateYearsOfPraxis - input the start date when I entered the IT field, in mm-yyyy format and calculate number of years that passed since that year
    - start date is a code constant, not a translation: `export const IT_START_DATE = '01-2019';` in
      `src/config/siteConfig.ts` (placeholder until the user sets the real value). The util itself takes
      the date as an argument; the caller passes the constant
    - counts full elapsed years (floor), taking the month into account
    - takes `now: Date` as a parameter (no hidden clock)
    - invalid input (`"13-2019"`, `"2019"`, a future date) throws a descriptive error
2. setLanguage - for switching languages based on browser/user preference
    - resolution order: saved choice in `localStorage` → browser languages (`cs` or `sk` → `cs`, anything else → `en`) → `cs`
    - keep the resolution pure (pass in the saved value and `navigator.languages`); the side effects
      (persist to `localStorage`, `i18n.changeLanguage`, `<html lang>`) stay thin
    - storage access can throw (private mode): handle it, fall back to detection
3. setColorTheme - for switching theme based on prefered color scheme/user preference
    - resolution order: saved choice in `localStorage` → `prefers-color-scheme` → dark
    - light = `data-theme="light"` on `<html>`, dark = no attribute
    - must agree with the no-flash inline script in `index.html` (same storage key `theme`)
4. numberToWords - spell out a number in `cs` / `en` for the years count in running text
    - range 7–20; outside the range return digits
    - Czech needs the nominative ("sedm let") and the form after "po" ("po sedmi letech");
      English has one form ("seven")

... and any other util you need when building the apps

### First red tests
- `calculateYearsOfPraxis('01-2019', new Date('2026-11-08'))` → 7
- `calculateYearsOfPraxis('12-2019', new Date('2026-11-08'))` → 6 (year not complete yet)
- `calculateYearsOfPraxis('13-2019', …)` and `('2019', …)` throw
- language: saved `en` wins; no saved + `['sk']` → `cs`; `['de-DE']` → `en`; nothing → `cs`
- theme: saved wins; no saved + prefers light → light; nothing → dark
- `numberToWords(7, 'en')` → `seven`; `(7, 'cs')` → `sedm`; Czech "po" form of 7 → `sedmi`; `(21, 'en')` → `21`
