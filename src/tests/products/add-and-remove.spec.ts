import {
  test,
  expect,
  standardUser,
  problemUser,
  errorUser,
  visualUser,
  performanceGlitchUser,
} from "@fixtures";
import { ProductNames } from "@typings/common";
import { ProductPageItemIds, ProductsPageTexts } from "@typings/products";

test.describe("Add/Remove from cart - different users", () => {
  standardUser(
    "should add and remove items from cart - standard user",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
      await expect
        .soft(productsPage.shopingCartContainer)
        .not.toContainClass("visual_failure");

      for (const productId of Object.values(ProductPageItemIds)) {
        const addBtn = productsPage.getAddToCartButton(productId);
        const removeBtn = productsPage.getRemoveFromCartButton(productId);
        const cartBadge = productsPage.getCartBadge;
        await addBtn.click();
        await cartBadge.waitFor({ state: "visible", timeout: 1000 });
        const badgeText = await cartBadge.textContent();

        expect.soft(badgeText).toBe("1");

        const isRemoveVisible = await removeBtn.isVisible();

        expect.soft(isRemoveVisible).toBe(true);

        if (isRemoveVisible) {
          await removeBtn.click();
          const isBadgeVisible = await cartBadge.isVisible();

          expect.soft(isBadgeVisible).toBe(false);

          const isAddBack = await addBtn.isVisible();

          expect.soft(isAddBack).toBe(true);
        }
      }
    },
  );

  problemUser(
    "should add and remove items from cart - problem user --> BUG: some items cannot be added or removed",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
      await expect
        .soft(productsPage.shopingCartContainer)
        .not.toContainClass("visual_failure");

      for (const productId of Object.values(ProductPageItemIds)) {
        const addBtn = productsPage.getAddToCartButton(productId);
        const removeBtn = productsPage.getRemoveFromCartButton(productId);
        const cartBadge = productsPage.getCartBadge;
        await addBtn.click();
        await cartBadge.waitFor({ state: "visible", timeout: 1000 });
        const badgeText = await cartBadge.textContent();

        expect.soft(badgeText).toBe("1");

        const isRemoveVisible = await removeBtn.isVisible();

        expect.soft(isRemoveVisible).toBe(true);

        if (isRemoveVisible) {
          await removeBtn.click();
          const isBadgeVisible = await cartBadge.isVisible();

          expect.soft(isBadgeVisible).toBe(false);

          const isAddBack = await addBtn.isVisible();

          expect.soft(isAddBack).toBe(true);
        }
      }
    },
  );

  errorUser(
    "should add and remove items from cart - error user --> BUG: some items cannot be added or removed",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
      await expect
        .soft(productsPage.shopingCartContainer)
        .not.toContainClass("visual_failure");

      for (const productId of Object.values(ProductPageItemIds)) {
        const addBtn = productsPage.getAddToCartButton(productId);
        const removeBtn = productsPage.getRemoveFromCartButton(productId);
        const cartBadge = productsPage.getCartBadge;
        await addBtn.click();
        await cartBadge.waitFor({ state: "visible", timeout: 1000 });
        const badgeText = await cartBadge.textContent();

        expect.soft(badgeText).toBe("1");

        const isRemoveVisible = await removeBtn.isVisible();

        expect.soft(isRemoveVisible).toBe(true);

        if (isRemoveVisible) {
          await removeBtn.click();
          const isBadgeVisible = await cartBadge.isVisible();

          expect.soft(isBadgeVisible).toBe(false);

          const isAddBack = await addBtn.isVisible();

          expect.soft(isAddBack).toBe(true);
        }
      }
    },
  );

  visualUser(
    "should add and remove items from cart - visual user --> BUG: some items cannot be added or removed",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
      await expect
        .soft(productsPage.shopingCartContainer)
        .not.toContainClass("visual_failure");

      for (const productId of Object.values(ProductPageItemIds)) {
        const addBtn = productsPage.getAddToCartButton(productId);
        const removeBtn = productsPage.getRemoveFromCartButton(productId);
        const cartBadge = productsPage.getCartBadge;
        await addBtn.click();
        await cartBadge.waitFor({ state: "visible", timeout: 1000 });
        const badgeText = await cartBadge.textContent();

        expect.soft(badgeText).toBe("1");

        const isRemoveVisible = await removeBtn.isVisible();

        expect.soft(isRemoveVisible).toBe(true);

        if (isRemoveVisible) {
          await removeBtn.click();
          const isBadgeVisible = await cartBadge.isVisible();

          expect.soft(isBadgeVisible).toBe(false);

          const isAddBack = await addBtn.isVisible();

          expect.soft(isAddBack).toBe(true);
        }
      }
    },
  );

  standardUser(
    "should remove item from cart on the details page - standard user",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
      await expect
        .soft(productsPage.shopingCartContainer)
        .not.toContainClass("visual_failure");

      const addBtn = productsPage.getAddToCartButton(
        ProductPageItemIds.Backpack,
      );
      const addBtnDetails = productsPage.addToCardButton;
      const removeBtn = productsPage.getRemoveFromCartButton(
        ProductPageItemIds.Backpack,
      );
      const cartBadge = productsPage.getCartBadge;
      await addBtn.click();
      await cartBadge.waitFor({ state: "visible", timeout: 1000 });
      const badgeText = await cartBadge.textContent();

      expect.soft(badgeText).toBe("1");

      const isRemoveVisible = await removeBtn.isVisible();

      expect.soft(isRemoveVisible).toBe(true);

      if (isRemoveVisible) {
        await productsPage.clickProductByName(ProductNames.Backpack);
        await productsPage.removeFromProjectDetails();

        const isBadgeVisible = await cartBadge.isVisible();

        expect.soft(isBadgeVisible).toBe(false);

        const isAddBackInDetails = await addBtnDetails.isVisible();

        expect.soft(isAddBackInDetails).toBe(true);

        const start = Date.now();
        await productsPage.clickBackToProducts();
        const durationBackToProduct = Date.now() - start;

        expect.soft(durationBackToProduct).toBeLessThanOrEqual(1500);

        const isAddBack = await addBtn.isVisible();

        expect.soft(isAddBack).toBe(true);
        expect.soft(isBadgeVisible).toBe(false);
      }
    },
  );

  performanceGlitchUser(
    "should remove item from cart on the details page - glitch user --> BUG: back navigation takes more than 1.5s",
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
      await expect
        .soft(productsPage.shopingCartContainer)
        .not.toContainClass("visual_failure");

      const addBtn = productsPage.getAddToCartButton(
        ProductPageItemIds.Backpack,
      );
      const addBtnDetails = productsPage.addToCardButton;
      const removeBtn = productsPage.getRemoveFromCartButton(
        ProductPageItemIds.Backpack,
      );
      const cartBadge = productsPage.getCartBadge;
      await addBtn.click();
      await cartBadge.waitFor({ state: "visible", timeout: 1000 });
      const badgeText = await cartBadge.textContent();

      expect.soft(badgeText).toBe("1");

      const isRemoveVisible = await removeBtn.isVisible();

      expect.soft(isRemoveVisible).toBe(true);

      if (isRemoveVisible) {
        await productsPage.clickProductByName(ProductNames.Backpack);
        await productsPage.removeFromProjectDetails();

        const isBadgeVisible = await cartBadge.isVisible();

        expect.soft(isBadgeVisible).toBe(false);

        const isAddBackInDetails = await addBtnDetails.isVisible();

        expect.soft(isAddBackInDetails).toBe(true);

        const start = Date.now();
        await productsPage.clickBackToProducts();
        const durationBackToProduct = Date.now() - start;
        expect.soft(durationBackToProduct).toBeLessThanOrEqual(1500);
        const isAddBack = await addBtn.isVisible();

        expect.soft(isAddBack).toBe(true);
        expect.soft(isBadgeVisible).toBe(false);
      }
    },
  );
});

test.describe("Increment items - different users", () => {
  test.beforeEach(async ({ loginPage: _, productsPage }) => {
    await productsPage.expectUrlContains("inventory");
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });
  standardUser(
    "should increment cart count when adding items and complete checkout - standard user",
    async ({ productsPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      const badge = await productsPage.waitForCartBadge();
      await expect.soft(badge).toHaveText("1");
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      await expect.soft(badge).toHaveText("2");
      await productsPage.addProductToCart(ProductPageItemIds.BoltTShirt);
      await expect.soft(badge).toHaveText("3");
      await productsPage.addProductToCart(ProductPageItemIds.FleeceJacket);
      await expect.soft(badge).toHaveText("4");
      await productsPage.addProductToCart(ProductPageItemIds.Onesie);
      await expect.soft(badge).toHaveText("5");
      await productsPage.addProductToCart(ProductPageItemIds.RedTShirt);
      await expect.soft(badge).toHaveText("6");
    },
  );
  errorUser(
    "should increment cart count when adding items and complete checkout - error user --> BUG: some items cannot be added or removed",
    async ({ productsPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      const badge = await productsPage.waitForCartBadge();
      await expect.soft(badge).toHaveText("1");
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      await expect.soft(badge).toHaveText("2");
      await productsPage.addProductToCart(ProductPageItemIds.BoltTShirt);
      await expect.soft(badge).toHaveText("3");
      await productsPage.addProductToCart(ProductPageItemIds.FleeceJacket);
      await expect.soft(badge).toHaveText("4");
      await productsPage.addProductToCart(ProductPageItemIds.Onesie);
      await expect.soft(badge).toHaveText("5");
      await productsPage.addProductToCart(ProductPageItemIds.RedTShirt);
      await expect.soft(badge).toHaveText("6");
    },
  );
  visualUser(
    "should increment cart count when adding items and complete checkout - visual user",
    async ({ productsPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      const badge = await productsPage.waitForCartBadge();
      await expect.soft(badge).toHaveText("1");
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      await expect.soft(badge).toHaveText("2");
      await productsPage.addProductToCart(ProductPageItemIds.BoltTShirt);
      await expect.soft(badge).toHaveText("3");
      await productsPage.addProductToCart(ProductPageItemIds.FleeceJacket);
      await expect.soft(badge).toHaveText("4");
      await productsPage.addProductToCart(ProductPageItemIds.Onesie);
      await expect.soft(badge).toHaveText("5");
      await productsPage.addProductToCart(ProductPageItemIds.RedTShirt);
      await expect.soft(badge).toHaveText("6");
    },
  );
});
