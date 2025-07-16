import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/",
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
  timeout: 30 * 1_000,
  expect: {
    timeout: 20 * 1_000,
  },
  use: {
    headless: true,
    testIdAttribute: "data-test",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "Firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "Safari",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  outputDir: "test-results/",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? "100%" : "55%",
  globalSetup: "./global-setup.ts"
});
