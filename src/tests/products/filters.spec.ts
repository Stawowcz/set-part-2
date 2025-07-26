import { test } from "@fixtures";
import { expect } from "@playwright/test";
import { SharedTexts } from "@typings/common/common-enums"

test.describe("Filters - different users", () => {
  test.describe("Filters - standard user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_STANDARD_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(SharedTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should sort A --> Z", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    test("should sort Z --> A", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort().reverse());
    });

    test("should sort price low --> high", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("lohi");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test("should sort price high --> low", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("hilo");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });

  test.describe("Filters - problem user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_PROBLEM_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(SharedTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should sort A --> Z", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    test("should sort Z --> A --> BUG: sorting order incorrect", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort().reverse());
    });

    test("should sort price low --> high --> BUG: sorting order incorrect", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("lohi");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test("should sort price high --> low --> BUG: sorting order incorrect", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("hilo");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });

  test.describe("Filters - error user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_ERROR_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(SharedTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should sort A --> Z", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    test("should sort Z --> A --> BUG: sorting order incorrect", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort().reverse());
    });

    test("should sort price low --> high --> BUG: sorting order incorrect", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("lohi");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test("should sort price high --> low --> BUG: sorting order incorrect", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("hilo");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });

  test.describe("Filters - visual user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_VISUAL_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(SharedTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should sort A --> Z", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    test("should sort Z --> A", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort().reverse());
    });

    test("should sort price low --> high --> BUG: sorting order incorrect", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("lohi");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test("should sort price high --> low --> BUG: sorting order incorrect", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("hilo");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });

  test.describe("Filters - glitch user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_PERFORMACE_GLITCH_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(SharedTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should sort items A --> Z --> BUG: sorting takes more than 1.5s", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    test("should sort Z --> A  --> BUG: sorting takes more than 1.5s", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort().reverse());
    });

    test("should sort price low --> high --> BUG: sorting takes more than 1.5s", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("lohi");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test("should sort price high --> low --> BUG: sorting takes more than 1.5s", async ({
      productsPage,
    }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("hilo");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });
});
