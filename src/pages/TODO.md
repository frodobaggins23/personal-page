# pages components

## TODO:
Implement based on ./docs/blueprint

page specific components belong here to this folder
components that would be reused across pages, should go to src/components

1. mainPage 
    - each section is a separate sub-component
    - the big number ("7" in design) is calculated based on util "../utils/calculateYearsOfPraxis"
    - reference section that features 4 project uses "../components/projectCard"
    - the small photo at the bottom section should enlarge and open in an overlay when clicked. use "../components/overlay"
2. projectPage
    - there are 4 projects in this app
    - all use the same shared components and use the same api
    - they load content dynamically based on url slugs
3. contrastReportPage
    - is a standalone page, referrenced from footer
    - as the content is unique, it will probably not use any shared component, but will utilize its own subcomponents nested in its folder. 
    - the actual data should NOT be static but rather on-the fly generated from the current app styles and design variables
    - use "../services/contrastReportService"

