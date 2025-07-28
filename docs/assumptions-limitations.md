## I. Assumptions

1. **Environment Setup**  
   Tests are executed in an environment with a properly configured Node.js and Playwright setup. It is assumed that the development or CI environment has access to `node_modules`, required browsers (Chromium, Firefox, WebKit), and tools (`npm`, `npx`).

2. **Stable Selectors**  
   The test environment consistently includes `data-test` attributes (e.g., `data-test="username"`). Most selectors use `getByTestId`, which assumes that DOM elements are marked with unique and stable `data-test` attributes.

3. **Test Isolation**  
   Tests are designed to be independent and isolated. Each test (or test group in `*.spec.ts` files) runs independently without shared runtime data or requiring a specific execution order.

4. **Consistent POM Structure**  
   The Page Object Model (POM) structure is consistent and complete. Each UI section has an assigned class in the `src/pages/` directory containing methods to interact with that module (e.g., `LoginPage`, `ProductsPage`).

5. **Dynamic Test Data**  
   Test data is generated dynamically using the Faker library. Variable test content (e.g., users, addresses, emails) is created with `@faker-js/faker`, reducing the risk of collisions and eliminating the need to maintain manual test data.

6. **Environment Variables**  
   The user should have a local `.env` file with required environment variables. The framework assumes that values such as `SAUCE_DEMO_BASEURL`, `USERNAME`, or other test configurations are stored in `.env` and loaded automatically.

## II. Limitations

1. **No Cleanup Mechanism**  
   There is no user data cleanup mechanism after tests. After a test is executed, data created by the user (e.g., items in the cart) is not removed. This lack of cleanup can lead to test environment pollution and may affect the outcome of subsequent tests.

2. **UI-only Authentication**  
   Authentication is handled exclusively via the UI. Currently, user login is performed through the user interface, which increases test duration. Logging in via API would significantly speed up and stabilize the test execution.

3. **Limited Role Coverage**  
   Tests do not cover users with different roles. The framework does not validate system behavior for various user roles (e.g., admin, manager), which limits test coverage in role-specific scenarios.

## III. Expected Results and Notes

1. **Annotated Bug Tests**  
   For all tests where the framework detected a bug in the application, annotations have been added in the test titles. These tests are not failing due to issues in the test framework—they fail because of actual bugs in the application.

2. **Test Results Summary**
   - **Single browser (e.g. Chrome):** 41 out of 79 tests should pass
   - **Single browser (e.g. Chrome):** 38 out of 79 tests should fail
   - **All browsers (Chrome + Firefox + Safari):** 123 out of 237 tests should pass
   - **All browsers (Chrome + Firefox + Safari):** 114 out of 237 tests should fail

3. **Code Comments**  
   In some places, comments have been added suggesting that certain things could be done differently, but the current approach has been intentionally preserved.

4. **Manual Execution**  
   You can run the tests manually at any time using the "Run workflow" button in the GitHub Actions tab.
