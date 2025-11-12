import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright-tests',
  use: {
    baseURL: 'http://localhost:3000',
    // Use saved authentication state if available (optional - won't fail if file doesn't exist)
    // storageState: 'playwright-tests/.auth/client.json',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe', // Show server stdout (console.log, etc.)
    stderr: 'pipe', // Show server stderr (errors, etc.)
  },
});

