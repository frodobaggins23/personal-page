# shared components

## TODO:
Implement based on ./docs/blueprint

components that would be reused across pages, belong here

1. navigationMobile -  project navigation, mobile version. logo + hamburger menu + lang switcher + theme switcher 
2. navigationDesktop -  project navigation, desktop version. logo + numbered menu + lang switcher + theme switcher 
3. footer - 
4. projectCard - to be used on "../pages/mainPage" for featuring the main 4 reference projects
5. projectHero - to be used on "../pages/projectPage" for featuring the hero section. Should be reusable with the same api for all 4 projects
6. projectScreens - to be used on "../pages/projectPage" for featuring the screens section. Should be reusable with the same api for all 4 projects
7. projectOverview - to be used on "../pages/projectPage" for featuring the main description section. Should be reusable with the same api for all 4 projects
8. overlay - generic overlay component for showing custom content, e.g. images
9. basic typography components (if applicable)
10. basic layout components (if applicable)


It is likely that some components (especially thos related to projectPage) will need a subcomponents to make the code conveniently atomic. So nest those inside the respective folders.