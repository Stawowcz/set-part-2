import { test } from "../fixtures/fixtures";
import { expect } from "@playwright/test";
import { ProductsPageTexts } from "../types/productsPage.enums";
import { ProductsCartIds } from "../types/productsPage.enums";

test.describe("Navigation - burger menu scenarios for different users", () => {
  test.describe("Burger menu scenarios - standard user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_STANDARD_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(ProductsPageTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should navigate to Saucelabs in the same tab when clicking 'About'", async ({
      page,
      productsPage,
      aboutPage,
    }) => {
      await productsPage.openMenu();

      await expect.soft(productsPage.menuAboutLink).toBeVisible();

      await productsPage.clickAbout();
      await page.waitForLoadState();

      await expect.soft(page).toHaveURL(/saucelabs\.com/);
      await expect.soft(aboutPage.sauceLabHeader).toBeVisible();
    });

    test("should navigate to login page after clicking 'Logout'", async ({
      page,
      productsPage,
    }) => {
      await productsPage.openMenu();

      await expect.soft(productsPage.menuLogoutLink).toBeVisible();

      await productsPage.clickLogout();

      await expect
        .soft(page)
        .toHaveURL(process.env.SAUCE_DEMO_BASEURL ?? "<unknown>");
    });
  });

  test.describe("Burger menu scenarios - problem user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_PROBLEM_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(ProductsPageTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should navigate to Saucelabs in the same tab when clicking 'About' --> BUG: 404 page shown", async ({
      page,
      productsPage,
      aboutPage,
    }) => {
      await productsPage.openMenu();

      await expect.soft(productsPage.menuAboutLink).toBeVisible();

      await productsPage.clickAbout();
      await page.waitForLoadState();

      await expect.soft(page).toHaveURL(/saucelabs\.com/);
      await expect.soft(aboutPage.sauceLabHeader).toBeVisible();
    });

    test("should navigate to login page after clicking 'Logout'", async ({
      page,
      productsPage,
    }) => {
      await productsPage.openMenu();

      await expect.soft(productsPage.menuLogoutLink).toBeVisible();

      await productsPage.clickLogout();

      await expect
        .soft(page)
        .toHaveURL(process.env.SAUCE_DEMO_BASEURL ?? "<unknown>");
    });
  });

  test.describe("Burger menu scenarios - error user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_ERROR_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(ProductsPageTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should navigate to Saucelabs in the same tab when clicking 'About'", async ({
      page,
      productsPage,
      aboutPage,
    }) => {
      await productsPage.openMenu();

      await expect.soft(productsPage.menuAboutLink).toBeVisible();

      await productsPage.clickAbout();
      await page.waitForLoadState();

      await expect.soft(page).toHaveURL(/saucelabs\.com/);
      await expect.soft(aboutPage.sauceLabHeader).toBeVisible();
    });

    test("should navigate to login page after clicking 'Logout'", async ({
      page,
      productsPage,
    }) => {
      await productsPage.openMenu();

      await expect.soft(productsPage.menuLogoutLink).toBeVisible();

      await productsPage.clickLogout();

      await expect
        .soft(page)
        .toHaveURL(process.env.SAUCE_DEMO_BASEURL ?? "<unknown>");
    });
  });

  test.describe("Reset app state via burger menu – standard user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_STANDARD_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(ProductsPageTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("should reset cart, filters and buttons --> BUG: reset does not affect the state", async ({
      productsPage,
    }) => {
      await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
      await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("2");

      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();

      expect.soft(names).toEqual([...names].sort().reverse());
      await expect.soft(productsPage.sortDropdown).toHaveValue("za");

      const removeBtnBp = productsPage.getRemoveFromCartButton(
        ProductsCartIds.SauceLabsBackpack,
      );
      const removeBtnBl = productsPage.getRemoveFromCartButton(
        ProductsCartIds.SauceLabsBikeLight,
      );
      const isRemoveVisibleBp = await removeBtnBp.isVisible();
      const isRemoveVisibleBl = await removeBtnBl.isVisible();

      expect.soft(isRemoveVisibleBp).toBe(true);
      expect.soft(isRemoveVisibleBl).toBe(true);

      await productsPage.openMenu();

      await expect.soft(productsPage.resetAppButton).toBeVisible();

      await productsPage.clickResetApp();

      await expect.soft(badge).not.toBeVisible();

      const addToCartBp = productsPage.getAddToCartButton(
        ProductsCartIds.SauceLabsBackpack,
      );
      const addToCartBl = productsPage.getAddToCartButton(
        ProductsCartIds.SauceLabsBikeLight,
      );
      const isAddToCartVisibleBp = await addToCartBp.isVisible();
      const isAddToCartVisibleBl = await addToCartBl.isVisible();

      expect.soft(isAddToCartVisibleBp).toBe(true);
      expect.soft(isAddToCartVisibleBl).toBe(true);
      expect.soft(isRemoveVisibleBp).toBe(false);
      expect.soft(isRemoveVisibleBl).toBe(false);
      await expect.soft(productsPage.sortDropdown).toHaveValue("az");
    });
  });

  test.describe("Reset app state via burger menu - problem user", () => {
    test.beforeEach(async ({ page, loginPage, productsPage }) => {
      await loginPage.login(
        process.env.SAUCE_DEMO_PROBLEM_USER ?? "<unknown>",
        process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
      );

      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(ProductsPageTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    });

    test("sshould reset cart, filters and buttons --> BUG: reset does not affect the state", async ({
      productsPage,
    }) => {
      await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
      await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("2");

      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();

      expect.soft(names).toEqual([...names].sort().reverse());
      await expect.soft(productsPage.sortDropdown).toHaveValue("za");

      const removeBtnBp = productsPage.getRemoveFromCartButton(
        ProductsCartIds.SauceLabsBackpack,
      );
      const removeBtnBl = productsPage.getRemoveFromCartButton(
        ProductsCartIds.SauceLabsBikeLight,
      );
      const isRemoveVisibleBp = await removeBtnBp.isVisible();
      const isRemoveVisibleBl = await removeBtnBl.isVisible();

      expect.soft(isRemoveVisibleBp).toBe(true);
      expect.soft(isRemoveVisibleBl).toBe(true);

      await productsPage.openMenu();

      await expect.soft(productsPage.resetAppButton).toBeVisible();

      await productsPage.clickResetApp();

      await expect.soft(badge).not.toBeVisible();

      const addToCartBp = productsPage.getAddToCartButton(
        ProductsCartIds.SauceLabsBackpack,
      );
      const addToCartBl = productsPage.getAddToCartButton(
        ProductsCartIds.SauceLabsBikeLight,
      );
      const isAddToCartVisibleBp = await addToCartBp.isVisible();
      const isAddToCartVisibleBl = await addToCartBl.isVisible();

      expect.soft(isAddToCartVisibleBp).toBe(true);
      expect.soft(isAddToCartVisibleBl).toBe(true);
      expect.soft(isRemoveVisibleBp).toBe(false);
      expect.soft(isRemoveVisibleBl).toBe(false);
      await expect.soft(productsPage.sortDropdown).toHaveValue("az");
    });
  });
});
