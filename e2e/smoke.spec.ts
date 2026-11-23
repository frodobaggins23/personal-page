import { expect, test as base } from '@playwright/test';

// Smoke tests: the app opens, the main page renders, navigation is clickable and every
// route opens. Any uncaught error or console error during a test fails it.
const test = base.extend<{ failOnBrowserErrors: void }>({
    failOnBrowserErrors: [
        async ({ page }, use) => {
            const errors: string[] = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('console', (message) => {
                if (message.type() === 'error') {
                    errors.push(message.text());
                }
            });
            // Fixed language keeps the assertions independent of the browser locale.
            await page.addInitScript(() => localStorage.setItem('language', 'en'));

            await use();

            expect(errors).toEqual([]);
        },
        { auto: true },
    ],
});

const projects = [
    { slug: 'moje-hory', title: 'Moje Hory' },
    { slug: 'self-hosted', title: 'This site, self-hosted' },
    { slug: 'agent-rules', title: 'Rules for AI agents' },
    { slug: 'three-glasses', title: 'Three Glasses' },
];

const sections = [
    { id: 'experience', link: 'Experience', heading: /shipping React to production/ },
    { id: 'projects', link: 'Projects', heading: 'What I build beyond the day job.' },
    { id: 'about', link: 'About', heading: 'Before code, there was marketing.' },
    { id: 'contact', link: 'Contact', heading: "Let's talk." },
];

const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
];

for (const viewport of viewports) {
    test.describe(viewport.name, () => {
        test.use({ viewport: { width: viewport.width, height: viewport.height } });

        test('opens and displays the main page', async ({ page }) => {
            await page.goto('/');

            await expect(page).toHaveTitle(/^Franta · \w+ years? of React$/);
            await expect(page.getByRole('heading', { level: 1 })).toContainText(
                /\d+\s*years? of\s*React\./,
            );
            for (const section of sections) {
                await expect(
                    page.getByRole('heading', { level: 2, name: section.heading }),
                ).toBeVisible();
            }
            await expect(page.getByRole('link', { name: 'Get in touch' })).toBeVisible();
            await expect(page.getByRole('contentinfo')).toBeVisible();
        });

        test('opens every project page from its card and cycles with "Next"', async ({ page }) => {
            for (const { slug, title } of projects) {
                await page.goto('/');
                await page.getByRole('link', { name: `Read more about ${title}` }).click();

                await expect(page).toHaveURL(new RegExp(`/projects/${slug}$`));
                await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
                await expect(page).toHaveTitle(`${title} · Franta`);
            }

            // On the last project, "Next" wraps around to the first one.
            await page.getByRole('link', { name: /^Next · 01 \/ 04/ }).click();
            await expect(page).toHaveURL(/\/projects\/moje-hory$/);

            await page.getByRole('link', { name: 'Back to all projects' }).click();
            await expect(page).toHaveURL(/\/#projects$/);
            await expect(
                page.getByRole('heading', { level: 2, name: 'What I build beyond the day job.' }),
            ).toBeInViewport();
        });

        test('opens the privacy by design page from both perimeter links', async ({ page }) => {
            const perimeterLinks = [/^privacy & security/, /How I build with privacy in mind/];
            for (const name of perimeterLinks) {
                await page.goto('/');
                await page
                    .getByRole('group', { name: 'Privacy and security, across all projects' })
                    .getByRole('link', { name })
                    .click();

                await expect(page).toHaveURL(/\/privacy-by-design$/);
                await expect(page).toHaveTitle('Privacy & security · Franta');
                await expect(
                    page.getByRole('heading', { level: 1, name: 'Privacy & security' }),
                ).toBeVisible();
            }

            await expect(
                page.getByRole('heading', { level: 3, name: "It's slower. It's worth it." }),
            ).toBeVisible();
            await page
                .getByRole('main')
                .getByRole('link', { name: 'Moje Hory', exact: true })
                .click();
            await expect(page).toHaveURL(/\/projects\/moje-hory$/);
        });

        test('opens the contrast report from the footer', async ({ page }) => {
            await page.goto('/');
            await page
                .getByRole('contentinfo')
                .getByRole('link', { name: /color contrast report/ })
                .click();

            await expect(page).toHaveURL(/\/accessibility$/);
            await expect(
                page.getByRole('heading', { level: 1, name: 'Color contrast report' }),
            ).toBeVisible();
            await expect(page.getByRole('heading', { level: 2, name: 'Verdict' })).toBeVisible();
            await expect(page.getByText('Pairs checked')).toBeVisible();
        });

        test('shows the 404 page for unknown routes and links back home', async ({ page }) => {
            await page.goto('/nope');
            await expect(
                page.getByRole('heading', { level: 1, name: 'Page not found' }),
            ).toBeVisible();

            await page.goto('/projects/nope');
            await expect(
                page.getByRole('heading', { level: 1, name: 'Page not found' }),
            ).toBeVisible();

            await page.getByRole('link', { name: 'Back to home' }).click();
            await expect(page).toHaveURL(/\/$/);
            await expect(page.getByRole('heading', { level: 1 })).toContainText(
                /years? of\s*React/,
            );
        });
    });
}

test.describe('desktop navigation', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    for (const section of sections) {
        test(`"${section.link}" jumps to its section`, async ({ page }) => {
            await page.goto('/');
            await page
                .getByRole('navigation', { name: 'Main' })
                .getByRole('link', { name: section.link })
                .click();

            await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
            await expect(
                page.getByRole('heading', { level: 2, name: section.heading }),
            ).toBeInViewport();
        });
    }

    test('navigates from a project page to a main page section', async ({ page }) => {
        await page.goto('/projects/moje-hory');
        await page
            .getByRole('navigation', { name: 'Main' })
            .getByRole('link', { name: 'Contact' })
            .click();

        await expect(page).toHaveURL(/\/#contact$/);
        await expect(page.getByRole('heading', { level: 2, name: "Let's talk." })).toBeInViewport();
    });

    test('logo goes home, and the theme and language controls respond', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
        await page.goto('/projects/moje-hory');
        await page.getByRole('link', { name: 'franta, home' }).click();
        await expect(page).toHaveURL(/\/$/);

        await page.getByRole('button', { name: 'Switch to light theme' }).click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

        await page.getByRole('button', { name: 'Čeština' }).click();
        await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
        await expect(page.getByRole('heading', { level: 1 })).toContainText(/let\s*s Reactem/);
    });
});

test.describe('mobile navigation', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    for (const section of sections) {
        test(`menu link "${section.link}" jumps to its section and closes the menu`, async ({
            page,
        }) => {
            await page.goto('/');
            await page.getByRole('button', { name: 'Open menu' }).click();
            await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
                'aria-expanded',
                'true',
            );

            await page.locator('#mobile-menu').getByRole('link', { name: section.link }).click();

            await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
            await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
                'aria-expanded',
                'false',
            );
            await expect(
                page.getByRole('heading', { level: 2, name: section.heading }),
            ).toBeInViewport();
        });
    }

    test('Escape closes the menu and returns focus to its button', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.keyboard.press('Escape');

        const trigger = page.getByRole('button', { name: 'Open menu' });
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(trigger).toBeFocused();
    });
});
