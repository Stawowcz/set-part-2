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
SAUCE_DEMO_PROBLEM_USER=problem_user
SAUCE_DEMO_PERFORMANCE_GLITCH_USER=performance_glitch_user
SAUCE_DEMO_ERROR_USER=error_user
SAUCE_DEMO_VISUAL_USER=visual_user
SAUCE_DEMO_PASSWORD=secret_sauce
```

## Running Tests

```bash
npm run test:all
npm run test:chromium    # or npm run test:firefox, npm run test:webkit
npm run test-debug       # launches in headed mode with inspector
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
  [`docs/documentation.md`](docs/documentation.md)
- Assumptions & Limitations:\
  [`docs/assumptions-limitations.md`](docs/assumptions-limitations.md)

