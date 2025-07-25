import { test } from "../../fixtures";
import { expect } from "@playwright/test";
import {
  ProductsPageTexts,
  ProductsCartIds,
  ProductsNames,
} from "../../types/productsPage.enums";

test.describe("Add/Remove from cart - different users", () => {
  test("should add and remove items from cart - standard user", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_STANDARD_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    await expect
      .soft(productsPage.shopingCartContainer)
      .not.toContainClass("visual_failure");

    for (const productId of Object.values(ProductsCartIds)) {
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
  });

  test("should add and remove items from cart - problem user --> BUG: some items cannot be added or removed", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_PROBLEM_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    await expect
      .soft(productsPage.shopingCartContainer)
      .not.toContainClass("visual_failure");

    for (const productId of Object.values(ProductsCartIds)) {
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
  });

  test("should add and remove items from cart - error user --> BUG: some items cannot be added or removed", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_ERROR_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    await expect
      .soft(productsPage.shopingCartContainer)
      .not.toContainClass("visual_failure");

    for (const productId of Object.values(ProductsCartIds)) {
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
  });

  test("should add and remove items from cart - visual user --> BUG: some items cannot be added or removed", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_VISUAL_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    await expect
      .soft(productsPage.shopingCartContainer)
      .not.toContainClass("visual_failure");

    for (const productId of Object.values(ProductsCartIds)) {
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
  });

  test("should remove item from cart on the details page - standard user", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_STANDARD_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    await expect
      .soft(productsPage.shopingCartContainer)
      .not.toContainClass("visual_failure");

    const addBtn = productsPage.getAddToCartButton(
      ProductsCartIds.SauceLabsBackpack,
    );
    const addBtnDetails = productsPage.addToCardButton;
    const removeBtn = productsPage.getRemoveFromCartButton(
      ProductsCartIds.SauceLabsBackpack,
    );
    const cartBadge = productsPage.getCartBadge;
    await addBtn.click();
    await cartBadge.waitFor({ state: "visible", timeout: 1000 });
    const badgeText = await cartBadge.textContent();

    expect.soft(badgeText).toBe("1");

    const isRemoveVisible = await removeBtn.isVisible();

    expect.soft(isRemoveVisible).toBe(true);

    if (isRemoveVisible) {
      await productsPage.openProductByName(ProductsNames.SauceLabsBackpack);
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
  });

  test("should remove item from cart on the details page - glitch user --> BUG: back navigation takes more than 1.5s", async ({
    page,
    loginPage,
    productsPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_PERFORMACE_GLITCH_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    await expect
      .soft(productsPage.shopingCartContainer)
      .not.toContainClass("visual_failure");

    const addBtn = productsPage.getAddToCartButton(
      ProductsCartIds.SauceLabsBackpack,
    );
    const addBtnDetails = productsPage.addToCardButton;
    const removeBtn = productsPage.getRemoveFromCartButton(
      ProductsCartIds.SauceLabsBackpack,
    );
    const cartBadge = productsPage.getCartBadge;
    await addBtn.click();
    await cartBadge.waitFor({ state: "visible", timeout: 1000 });
    const badgeText = await cartBadge.textContent();

    expect.soft(badgeText).toBe("1");

    const isRemoveVisible = await removeBtn.isVisible();

    expect.soft(isRemoveVisible).toBe(true);

    if (isRemoveVisible) {
      await productsPage.openProductByName(ProductsNames.SauceLabsBackpack);
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
  });
});
