import { test, expect } from "@fixtures";
import {
  ProductsPageTexts,
  ProductPageNames,
  ProductPageImagePaths,
} from "@typings/products";
import { SharedTexts } from "@typings/common";
import { env }  from '@utils';

test.describe("Images loading - different users", () => {
  test("should load images correctly on the product page - standard user", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      env.SAUCE_DEMO_STANDARD_USER,
      env.SAUCE_DEMO_PASSWORD
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
      env.SAUCE_DEMO_PROBLEM_USER,
      env.SAUCE_DEMO_PASSWORD,
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
      env.SAUCE_DEMO_VISUAL_USER,
      env.SAUCE_DEMO_PASSWORD,
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
