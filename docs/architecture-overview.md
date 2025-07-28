# Architecture Overview

## 1. Project Structure

The framework follows a modular structure aligned with best practices for scalable, maintainable E2E testing:

```text
project-root/
├─ src/
│  ├─ fixtures/           # Playwright fixtures (login, products, about, cart, checkout)
│  ├─ pages/              # POM classes (LoginPage, ProductsPage, AboutPage, CartPage, CheckoutPage)
│  ├─ tests/              # E2E test scripts grouped by feature
│  ├─ types/              # Type definitions (e.g., CheckoutFormData)
│  └─ utils/              # Helpers (env parsing with Zod, data generators)
├─ playwright.config.ts   # Playwright config (projects, reporters, retries, outputDir)
├─ .env.example           # Environment variable template
├─ .github/workflows/     # CI pipeline (matrix browsers, caching, artifacts)
├─ package.json           # npm scripts and dependencies
├─ test-results/          # Screenshots, videos, trace files from failures
└─ playwright-report/     # HTML reports generated after test runs
```

## 2. Test Architecture

Tests are executed with the Playwright Test Runner and custom fixtures:

-  for per-test setup via fixtures (e.g., logging in with different user types).
-  to group related scenarios.
-  allows continuing after soft assertion failures to collect multiple errors.
- **Custom fixtures** (`login-fixture.ts`, `products-fixture.ts`, `about-fixture.ts`, `cart-fixture.ts`, `checkout-fixture.ts`) expose page objects and utilities directly into test callbacks.

**Example test for an "incorrect user":**

```ts
import { test, expect } from './fixtures/user-fixture';

test.describe("Negatvie scenarios - authentication with user using wrong credentials", () => {
  incorrectUser("should show error for incorrect username", async ({ loginPage }) => {
    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect
      .soft(loginPage.errorMessage)
      .toHaveText(LoginPageErrorMessages.InvalidCreds);
  });
```

## 3. Page Object Model (POM)

Each UI screen is represented by a class under `src/pages`, encapsulating locators and actions:

```ts
export class LoginPage extends BasePage {
  private readonly userNameField: Locator = this.page.getByTestId("username");
  private readonly passwordField: Locator = this.page.getByTestId("password");
  private readonly loginButton: Locator = this.page.getByTestId("login-button");
  public readonly errorButton: Locator = this.page.getByTestId("error-button");
  public readonly errorMessage: Locator = this.page.getByTestId("error");

  public async clickOnLoginButton(): Promise<void> {
    await this.safeClick(this.loginButton);
  }

  public async fillUserNameField(userName: string): Promise<void> {
    await this.safeFill(this.userNameField, userName);
  }

  public async fillPasswordField(password: string): Promise<void> {
    await this.safeFill(this.passwordField, password);
  }

  public async login(userName: string, password: string): Promise<void> {
    await this.goto(process.env.SAUCE_DEMO_BASEURL!);
    await this.fillUserNameField(userName);
    await this.fillPasswordField(password);
    await this.clickOnLoginButton();
  }
}
```

All page classes extend a shared `BasePage`, which provides common utilities (e.g., waiting, navigation). No constructors are redefined in each class.

## 4. Custom Types and Enums

While most configuration relies on fixtures and plain objects, you can optionally define:

- **Types** in `src/types/` for shared data shapes (e.g., `CheckoutFormData`).
- **Enums** or constant maps only if you find recurring literal values in multiple places.

## 5. Utilities and Data Generators (src/utils)

`env-utils.ts`: Exports typed environment variables via a manual cast to EnvVars:

```ts
// src/types/env-types.ts
export type EnvVars = {
  SAUCE_DEMO_BASEURL: string;
  SAUCE_DEMO_PASSWORD: string;
  SAUCE_DEMO_INCORRECT_PASSWORD: string;
  SAUCE_DEMO_STANDARD_USER: string;
  SAUCE_DEMO_INCORRECT_USER: string;
  SAUCE_DEMO_LOCKED_OUT_USER: string;
  SAUCE_DEMO_PROBLEM_USER: string;
  SAUCE_DEMO_PERFORMACE_GLITCH_USER: string;
  SAUCE_DEMO_ERROR_USER: string;
  SAUCE_DEMO_VISUAL_USER: string;
};

// src/utils/env-utils.ts
import type { EnvVars } from '@types/env-types';
export const env = process.env as unknown as EnvVars;
```

`checkout-data.ts`: Generates realistic form data using Faker:

```ts
import { faker } from '@faker-js/faker';
import type { CheckoutFormData } from '../types';

export function generateCheckoutData(): CheckoutFormData {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
  };
}
```

## 6. Reporting

Configured in `playwright.config.ts`:

- **HTML reporter** for human-readable output
- **JUnit reporter** for CI integration
- **Artifacts:** screenshots (only on failure), videos (retain on failure), traces (on first retry)

View reports with:

```bash
npm run report
```

## 7. NPM Scripts

Defined in `package.json`:

```json
{
  "scripts": {
    "test-debug:chrome": "playwright test --debug --project=Chromium",
    "report": "npx playwright show-report",
    "test:safari": "npx playwright test --project=Safari",
    "test:firefox": "npx playwright test --project=Firefox",
    "test:chromium": "npx playwright test --project=Chromium",
    "test:chromium:debug": "npx playwright test --project=Chromium --debug",
    "test:all": "npx playwright test",
    "prettier": "npx prettier --write ."
  }
}
```

## 8. Environment Configuration

Store environment-specific settings in `.env` (not committed). Example:

```env
SAUCE_DEMO_BASEURL=https://www.saucedemo.com
# user scenarios
SAUCE_DEMO_STANDARD_USER=standard_user
```

## 9. Custom Fixtures

The framework uses custom Playwright fixtures aggregated in `src/fixtures/index.ts`. These fixtures expose typed page objects and data directly into test callbacks. For example:

```ts
import type { Page } from "@playwright/test";
import { AboutPage } from "@pages";

export const aboutFixtures = {
  aboutPage: async (
    { page }: { page: Page },
    use: (aboutPage: AboutPage) => Promise<void>,
  ) => {
    await use(new AboutPage(page));
  },
};
```

````ts
import { test as loginTest, expect } from "./login-fixture";
import { productsFixtures } from "./products-fixture";
import { aboutFixtures } from "./about-fixture";
import { cartFixtures } from "./cart-fixture";
import { checkoutFixtures } from "./checkout-fixture";

import type { UserCredentials } from "./login-fixture";
import { env } from "@utils/env-utils";

import { LoginPage } from "@pages/login-page";
import { ProductsPage } from "@pages/products-page";
import { AboutPage } from "@pages/about-page";
import { CartPage } from "@pages/cart-page";
import { CheckoutPage } from "@pages/checkout-page";

export type MyFixtures = {
  user: UserCredentials;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  aboutPage: AboutPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = loginTest.extend<MyFixtures>({
  ...productsFixtures,
  ...aboutFixtures,
  ...cartFixtures,
  ...checkoutFixtures,
});

export { expect };

export const standardUser = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_STANDARD_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },
});
// ... other user fixtures: lockedUser, incorrectUser, problemUser, performanceGlitchUser, errorUser, visualUser

## 10. Playwright Configuration (`playwright.config.ts`)

This file defines the core Playwright test runner setup, loading environment variables, configuring test behavior, and managing retries, reporters, and execution logic.

```ts
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
  workers: process.env.CI ? "100%" : "50%",

  outputDir: "test-results/",
});
````

## 11. TypeScript Configuration (`tsconfig.json`)

Defines TypeScript compilation settings, strictness rules, and module resolution paths for cleaner imports.

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "lib": ["ESNext", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@fixtures": ["src/fixtures/index.ts"],
      "@fixtures/*": ["src/fixtures/*"],
      "@pages": ["src/pages/index.ts"],
      "@pages/*": ["src/pages/*"],
      "@utils": ["src/utils/index.ts"],
      "@utils/*": ["src/utils/*"],
      "@typings/*": ["src/types/*"],
      "@data/*": ["src/data/*"]
    }
  },
  "include": ["src/**/*.ts", "playwright.config.ts"]
}
```

**Highlights:**

- `strict`: enables full type safety
- `baseUrl` and `paths`: support alias imports like `@pages/LoginPage`
- Allows importing `.json` files
- Simplifies refactoring and improves code readability

## 12. Summary

This framework provides a scalable, maintainable foundation for E2E testing:

- Playwright Test Runner with fixtures and soft assertions
- Modular POM classes for UI interactions
- Typed enums environment variables
- Dynamic test data via Faker
- Comprehensive reporting and CI/CD integration

