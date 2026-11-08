import { test } from '@playwright/test';

// Visual QA only: writes full-page screenshots to the gitignored visual-qa/ folder
// for manual comparison with docs/blueprint/Portfolio.pdf.
const routes = [
    { name: 'main', path: '/' },
    { name: 'project', path: '/projects/moje-hory' },
    { name: 'accessibility', path: '/accessibility' },
    { name: 'not-found', path: '/nope' },
];
const viewports = [
    { name: '390', width: 390, height: 844 },
    { name: '1440', width: 1440, height: 900 },
];

for (const route of routes) {
    for (const viewport of viewports) {
        for (const theme of ['dark', 'light'] as const) {
            test(`${route.name} ${viewport.name} ${theme}`, async ({ page }) => {
                await page.setViewportSize({ width: viewport.width, height: viewport.height });
                await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
                await page.addInitScript(() => localStorage.setItem('language', 'en'));
                await page.goto(route.path);
                await page.evaluate(() => document.fonts.ready);
                await page.screenshot({
                    path: `visual-qa/${route.name}-${viewport.name}-${theme}.png`,
                    fullPage: true,
                });
            });
        }
    }
}
