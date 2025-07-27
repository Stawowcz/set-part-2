# Playwright Test Automation

Automated end‑to‑end tests for the Saucedemo site using Playwright + TypeScript, with Page Object Model, custom fixtures, and soft assertions.

## Installation

```bash
git clone https://github.com/Stawowcz/set-part-2.git
cd set-part-2
npm install
```

## Configuration

Create a `.env` file with:

```env
SAUCE_DEMO_BASEURL=https://www.saucedemo.com
SAUCE_DEMO_STANDARD_USER=standard_user
SAUCE_DEMO_LOCKED_OUT_USER=locked_out_user
```

## Running Tests

To run all tests:

```bash
npm run test:all
```

To run tests in debug mode (Chromium):

```bash
npm run test-debug:chrome
```

To run tests in specific browsers:

```bash
npm run test:chromium
npm run test:firefox
npm run test:safari
```

## Reporting

- HTML & JUnit reporters configured in `playwright.config.ts`
- Screenshots (on failure), videos (on retry), and trace files (first retry) are saved under `src/report/<timestamp>/`
- To view the HTML report:
  ```bash
  npm run report
  ```

## CI/CD

Configured in `.github/workflows/playwright.yml` to:

- Run tests in parallel across Chromium, Firefox, and WebKit
- Cache `node_modules` and Playwright browsers for faster builds
- Publish test reports and artifacts on each run

## Documentation

- Framework overview, architecture details, patterns and usage examples:\
  [`docs/documentation.md`](docs/architecture.md)
- Assumptions & Limitations:\
  [`docs/assumptions-limitations.md`](docs/assumptions-limitations.md)

