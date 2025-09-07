import { standardUser, problemUser, visualUser } from "@fixtures";
import { ProductsPageTexts, ProductPageImagePaths } from "@typings/products";
import { ProductNames } from "@typings/common";
import { expect, test } from "@fixtures";

test.describe("Images loading - different users", () => {
  standardUser(
    "should load images correctly on the product page - standard user @regression",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);

      const expectedImages = {
        [ProductNames.Backpack]: ProductPageImagePaths.Backpack,
        [ProductNames.BikeLight]: ProductPageImagePaths.BikeLight,
        [ProductNames.BoltTShirt]: ProductPageImagePaths.BoltTShirt,
        [ProductNames.FleeceJacket]: ProductPageImagePaths.FleeceJacket,
        [ProductNames.Onesie]: ProductPageImagePaths.Onesie,
        [ProductNames.RedTShirt]: ProductPageImagePaths.RedTShirt,
      };

      for (const [productName, expectedSrc] of Object.entries(expectedImages)) {
        const actualSrc = await productsPage
          .getProductImageByAltText(productName)
          .getAttribute("src");

        expect.soft(actualSrc).toContain(expectedSrc);
      }
    },
  );

  problemUser(
    "should load images correctly on the product page - problem user --> BUG: dogs everywhere @regression",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);

      const expectedImages = {
        [ProductNames.Backpack]: ProductPageImagePaths.Backpack,
        [ProductNames.BikeLight]: ProductPageImagePaths.BikeLight,
        [ProductNames.BoltTShirt]: ProductPageImagePaths.BoltTShirt,
        [ProductNames.FleeceJacket]: ProductPageImagePaths.FleeceJacket,
        [ProductNames.Onesie]: ProductPageImagePaths.Onesie,
        [ProductNames.RedTShirt]: ProductPageImagePaths.RedTShirt,
      };

      for (const [productName, expectedSrc] of Object.entries(expectedImages)) {
        const actualSrc = await productsPage
          .getProductImageByAltText(productName)
          .getAttribute("src");

        expect.soft(actualSrc).toContain(expectedSrc);
      }
    },
  );

  visualUser(
    "should load images correctly on the product page - visual user --> BUG: dogs in one place @regression",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);

      const expectedImages = {
        [ProductNames.Backpack]: ProductPageImagePaths.Backpack,
        [ProductNames.BikeLight]: ProductPageImagePaths.BikeLight,
        [ProductNames.BoltTShirt]: ProductPageImagePaths.BoltTShirt,
        [ProductNames.FleeceJacket]: ProductPageImagePaths.FleeceJacket,
        [ProductNames.Onesie]: ProductPageImagePaths.Onesie,
        [ProductNames.RedTShirt]: ProductPageImagePaths.RedTShirt,
      };

      for (const [productName, expectedSrc] of Object.entries(expectedImages)) {
        const actualSrc = await productsPage
          .getProductImageByAltText(productName)
          .getAttribute("src");

        expect.soft(actualSrc).toContain(expectedSrc);
      }
    },
  );
});
