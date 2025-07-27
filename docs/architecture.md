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

- `` for per-test setup via fixtures (e.g., logging in with different user types).
- `` to group related scenarios.
- `` allows continuing after soft assertion failures to collect multiple errors.
- **Custom fixtures** (`login-fixture.ts`, `products-fixture.ts`, `about-fixture.ts`, `cart-fixture.ts`, `checkout-fixture.ts`) expose page objects and utilities directly into test callbacks.

**Example test for an "error user":**

```ts
import { test, expect } from './fixtures/user-fixture';

test('error user cannot log in and sees error message', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.login(process.env.SAUCE_DEMO_ERROR_USER!, process.env.SAUCE_DEMO_PASSWORD!);
  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});
```

## 3. Page Object Model (POM). Page Object Model (POM)

Each UI screen is represented by a class under `src/pages`, encapsulating locators and actions:

```ts
export class ProductsPage extends BasePage {
  readonly cartBadge = this.page.locator('.shopping_cart_badge');
  readonly menuAboutLink = this.page.getByText('About');

  async openMenu() {
    await this.page.click('#react-burger-menu-btn');
  }

  async clickAbout() {
    await this.menuAboutLink.click();
  }
}
```

All page classes extend a shared `BasePage`, which provides common utilities (e.g., waiting, navigation). No constructors are redefined in each class.

## 4. Custom Types and Interfaces (if any)

While most configuration relies on fixtures and plain objects, you can optionally define:

- **Interfaces** in `src/types/` for shared data shapes (e.g., `CheckoutFormData`).
- **Enums** or constant maps only if you find recurring literal values in multiple places.

If your current project doesn't include a `src/types` folder or enums, you can omit this section and rely on direct inline types in fixtures and test definitions.

## 5. Utilities and Data Generators (`src/utils`)

. Utilities and Data Generators (`src/utils`)

Helpers include:

- `` – parses and validates `.env` via Zod
- `` – generates realistic form data using Faker:

```ts
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
- **Artifacts:** screenshots (on failure), videos (on retry), traces (on first retry)

View reports with:

```bash
npx playwright show-report
```

## 7. NPM Scripts

Defined in `package.json`:

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:all": "npx playwright test --project=""",
    "test:chromium": "npx playwright test --project=chromium",
    "test:firefox": "npx playwright test --project=firefox",
    "test:webkit": "npx playwright test --project=webkit",
    "test-debug": "npx playwright test --debug",
    "report": "npx playwright show-report"
  }
}
```

## 8. Environment Configuration

Store environment-specific settings in `.env` (not committed). Example:

```env
SAUCE_DEMO_BASEURL=https://www.saucedemo.com
# user scenarios
SAUCE_DEMO_STANDARD_USER=standard_user
…
SAUCE_DEMO_PASSWORD=secret_sauce
```

## 9. Custom Fixtures

The framework uses custom Playwright fixtures aggregated in `src/fixtures/index.ts`. These fixtures expose typed page objects and data directly into test callbacks. For example:

```ts
// src/fixtures/about-fixture.ts
import type { Page } from '@playwright/test';
import { AboutPage } from '@pages/about-page';

export const aboutFixtures = {
  aboutPage: async ({ page }: { page: Page }, use: (aboutPage: AboutPage) => Promise<void>) => {
    await use(new AboutPage(page));
  },
};
```

```ts
// src/fixtures/index.ts
import { test as loginTest, expect } from './login-fixture';
import { productsFixtures } from './products-fixture';
import { aboutFixtures } from './about-fixture';
import { cartFixtures } from './cart-fixture';
import { checkoutFixtures } from './checkout-fixture';

import type { UserCredentials } from './login-fixture';
import { env } from '@utils/env-utils';

import { LoginPage } from '@pages/login-page';
import { ProductsPage } from '@pages/products-page';
import { AboutPage } from '@pages/about-page';
import { CartPage } from '@pages/cart-page';
import { CheckoutPage } from '@pages/checkout-page';

// Define fixture types
export type MyFixtures = {
  user: UserCredentials;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  aboutPage: AboutPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

// Extend loginTest with additional fixtures
export const test = loginTest.extend<MyFixtures>({
  ...productsFixtures,
  ...aboutFixtures,
  ...cartFixtures,
  ...checkoutFixtures,
});
export { expect };

// Preconfigured user fixtures
export const standardUser = test.extend({ user: async (_, use) => {
  await use({ username: env.SAUCE_DEMO_STANDARD_USER, password: env.SAUCE_DEMO_PASSWORD });
}});
// ... other user fixtures: lockedUser, incorrectUser, problemUser, performanceGlitchUser, errorUser, visualUser
```

## 10. Summary

This framework provides a scalable, maintainable foundation for E2E testing:

- Playwright Test Runner with fixtures and soft assertions
- Modular POM classes for UI interactions
- Typed enums and Zod-validated environment variables
- Dynamic test data via Faker
- Comprehensive reporting and CI/CD integration

This framework provides a scalable, maintainable foundation for E2E testing:

- Playwright Test Runner with fixtures and soft assertions
- Modular POM classes for UI interactions
- Typed enums and Zod-validated environment variables
- Dynamic test data via Faker
- Comprehensive reporting and CI/CD integration

