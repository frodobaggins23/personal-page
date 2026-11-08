import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    outputDir: './test-results',
    use: { baseURL: 'http://localhost:4173', channel: 'chrome' },
    webServer: {
        command: 'npm run build && npm run preview -- --port 4173 --strictPort',
        url: 'http://localhost:4173',
        reuseExistingServer: true,
        timeout: 120_000,
    },
});
