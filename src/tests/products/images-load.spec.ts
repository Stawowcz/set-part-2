import { test } from "@fixtures";
import { expect } from "@playwright/test";
import {
  ProductsPageTexts,
  ProductPageNames,
  ProductPageImagePaths,
} from "../../types/products/products-enums";
import { SharedTexts } from "../../types/common/common-enums";

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
      .toContainText(SharedTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();

    const expectedImages = {
      [ProductPageNames.Backpack]: ProductPageImagePaths.Backpack,
      [ProductPageNames.BikeLight]: ProductPageImagePaths.BikeLight,
      [ProductPageNames.BoltTShirt]: ProductPageImagePaths.BoltTShirt,
      [ProductPageNames.FleeceJacket]:
        ProductPageImagePaths.FleeceJacket,
      [ProductPageNames.Onesie]: ProductPageImagePaths.Onesie,
      [ProductPageNames.RedTShirt]:
        ProductPageImagePaths.RedTShirt,
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
      .toContainText(SharedTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();

    const expectedImages = {
      [ProductPageNames.Backpack]: ProductPageImagePaths.Backpack,
      [ProductPageNames.BikeLight]: ProductPageImagePaths.BikeLight,
      [ProductPageNames.BoltTShirt]: ProductPageImagePaths.BoltTShirt,
      [ProductPageNames.FleeceJacket]:
        ProductPageImagePaths.FleeceJacket,
      [ProductPageNames.Onesie]: ProductPageImagePaths.Onesie,
      [ProductPageNames.RedTShirt]:
        ProductPageImagePaths.RedTShirt,
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
      .toContainText(SharedTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();

    const expectedImages = {
      [ProductPageNames.Backpack]: ProductPageImagePaths.Backpack,
      [ProductPageNames.BikeLight]: ProductPageImagePaths.BikeLight,
      [ProductPageNames.BoltTShirt]: ProductPageImagePaths.BoltTShirt,
      [ProductPageNames.FleeceJacket]:
        ProductPageImagePaths.FleeceJacket,
      [ProductPageNames.Onesie]: ProductPageImagePaths.Onesie,
      [ProductPageNames.RedTShirt]:
        ProductPageImagePaths.RedTShirt,
    };

    for (const [productName, expectedSrc] of Object.entries(expectedImages)) {
      const actualSrc = await productsPage
        .getProductImageByAltText(productName)
        .getAttribute("src");

      expect.soft(actualSrc).toContain(expectedSrc);
    }
  });
});
