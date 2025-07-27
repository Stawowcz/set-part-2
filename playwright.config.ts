import { defineConfig, devices } from "@playwright/test";
import { env } from "@utils";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: "./src/tests/",
  timeout: 30 * 1_000,
  expect: {
    timeout: 20 * 1_000,
  },

  reporter: [
    ["list"],
    ["junit", { outputFile: "test-results/junit-results.xml" }],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    headless: true,
    baseURL: env.SAUCE_DEMO_BASEURL,
    testIdAttribute: "data-test",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },

  projects: [
    { name: "Chromium", use: { ...devices["Desktop Chrome"] } },
    // { name: "Firefox",  use: { ...devices["Desktop Firefox"] } },
    // { name: "WebKit",   use: { ...devices["Desktop Safari"] } },
  ],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? '100%' : '50%',


  outputDir: "test-results/",
});
