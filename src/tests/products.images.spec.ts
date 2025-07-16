import { test } from "../fixtures/fixtures";
import { expect } from "@playwright/test";
import {
  ProductsPageTexts,
  ProductsImages,
  ProductsNames,
} from "../types/productsPage.enums";

test.describe("Images loading - different users", () => {
  test("should load images correctly on the product page - standard user", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_STANDARD_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();

    const expectedImages = {
      [ProductsNames.SauceLabsBackpack]: ProductsImages.SauceLabsBackpack,
      [ProductsNames.SauceLabsBikeLight]: ProductsImages.SauceLabsBikeLight,
      [ProductsNames.SauceLabsBoltTShirt]: ProductsImages.SauceLabsBoltTShirt,
      [ProductsNames.SauceLabsFleeceJacket]:
        ProductsImages.SauceLabsFleeceJacket,
      [ProductsNames.SauceLabsOnesie]: ProductsImages.SauceLabsOnesie,
      [ProductsNames.TestAllTheThingsTShirtRed]:
        ProductsImages.TestAllTheThingsTShirtRed,
    };

    for (const [productName, expectedSrc] of Object.entries(expectedImages)) {
      const actualSrc = await productsPage
        .getProductImageByAltText(productName)
        .getAttribute("src");

      expect.soft(actualSrc).toContain(expectedSrc);
    }
  });

  test("should load images correctly on the product page - problem user --> BUG: dogs everywhere", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_PROBLEM_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();

    const expectedImages = {
      [ProductsNames.SauceLabsBackpack]: ProductsImages.SauceLabsBackpack,
      [ProductsNames.SauceLabsBikeLight]: ProductsImages.SauceLabsBikeLight,
      [ProductsNames.SauceLabsBoltTShirt]: ProductsImages.SauceLabsBoltTShirt,
      [ProductsNames.SauceLabsFleeceJacket]:
        ProductsImages.SauceLabsFleeceJacket,
      [ProductsNames.SauceLabsOnesie]: ProductsImages.SauceLabsOnesie,
      [ProductsNames.TestAllTheThingsTShirtRed]:
        ProductsImages.TestAllTheThingsTShirtRed,
    };

    for (const [productName, expectedSrc] of Object.entries(expectedImages)) {
      const actualSrc = await productsPage
        .getProductImageByAltText(productName)
        .getAttribute("src");

      expect.soft(actualSrc).toContain(expectedSrc);
    }
  });

  test("should load images correctly on the product page - visual user --> BUG: dogs in one place", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_VISUAL_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();

    const expectedImages = {
      [ProductsNames.SauceLabsBackpack]: ProductsImages.SauceLabsBackpack,
      [ProductsNames.SauceLabsBikeLight]: ProductsImages.SauceLabsBikeLight,
      [ProductsNames.SauceLabsBoltTShirt]: ProductsImages.SauceLabsBoltTShirt,
      [ProductsNames.SauceLabsFleeceJacket]:
        ProductsImages.SauceLabsFleeceJacket,
      [ProductsNames.SauceLabsOnesie]: ProductsImages.SauceLabsOnesie,
      [ProductsNames.TestAllTheThingsTShirtRed]:
        ProductsImages.TestAllTheThingsTShirtRed,
    };

    for (const [productName, expectedSrc] of Object.entries(expectedImages)) {
      const actualSrc = await productsPage
        .getProductImageByAltText(productName)
        .getAttribute("src");

      expect.soft(actualSrc).toContain(expectedSrc);
    }
  });
});
