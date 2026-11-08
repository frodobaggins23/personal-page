# Services

## TODO:
Implement based on ./docs/blueprint

- more complex helpers or services 
- non-pure

1. localizationService - for managing i18n translations (if not decided this will be done via hooks only)
2. contrastReportService - for calculating on the fly contrast compliance report from the app design system

### Localizations - more detail

- use i18n and hooks where possible
- default language is Czech, second English. No other languages are planned.
- I want ALL text strings to be included in the json definition. NOTHING will be hardcoded (not even accessibility tags).
- I want the json config files with translations to be as structured as possible to make editing an easy task

example:

``` json
    {
        "shared:" {
            "navigation": {
                "items": [
                    "Experience",
                    "Projects",
                    "About",
                    "Contact"
                ],
                "languageToggle:" {
                    "cz":"CZ",
                    "en":"EN"
                }
                // ...
            },
            "components": {
                "productCard": {
                    "title":"Moje Hory",
                    "subtitle": "Mobile first tracker ..."
                }
                // ...
            }
        },
        "pages": {
            "mainPage": {
                "hero": {
                    "title": "{number} year of React",
                    "subtitle": "Now reaching beyond the browser"
                }
            },
            // ...
        },
        "other": {
            // whatever needed here...
        }
    }
```