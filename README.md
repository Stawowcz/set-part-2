# Playwright Test Automation

Automated end-to-end tests using [Playwright](https://playwright.dev/) with TypeScript, soft assertions, and environment-based configuration.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Stawowcz/set-part-2.git
cd set-part-2
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (this file is not included in the repo). You will receive it separately.

Example `.env` structure:

```env
SAUCE_DEMO_BASEURL=https://www.saucedemo.com
SAUCE_DEMO_STANDARD_USER=standard_user
SAUCE_DEMO_PASSWORD=secret_sauce
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

## Test Report

To view the HTML report after running tests:

```bash
npm run report
```

This will open the report in your default browser.
