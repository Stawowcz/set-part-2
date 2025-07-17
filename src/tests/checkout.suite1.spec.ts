import { test } from "../fixtures/fixtures";
import { expect } from "@playwright/test";
import { ProductsCartIds, ProductsNames } from "../types/productsPage.enums";
import { CheckoutFormData } from "../types/userData";
import { CheckoutDataGenerator } from "../utils/testData";
import { CartPageTexts } from "../types/cartPage.enums";
import {
  CheckoutPageTexts,
  CheckoutPageErrorMsg,
} from "../types/checkoutPage.enum";
import { ProductsPageTexts } from "../types/productsPage.enums";
import { PricingUtils } from "../utils/pricing.utils";

test.describe("Checkout flow - standard user", () => {
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

  test("should add 2 items and complete checkout successfully", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );
    const expectedTotal = inventoryPriceBP + inventoryPriceBL;

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    const classAttr = await cartPage.checkoutButton.getAttribute('class');
    expect.soft(classAttr).not.toContain('btn_visual_failure');

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateUserData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader2ndStep);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(overviewPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(overviewPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    const subtotalPrice = await checkoutPage.getSubtotalPrice();
    const displayedTax = await checkoutPage.getTax();
    const displayedTotal = await checkoutPage.getTotalPrice();

    const expectedTax = PricingUtils.calculateTax(expectedTotal);
    const expectedTotalWithTax =
      PricingUtils.calculateTotalWithTax(expectedTotal);

    expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 2);
    expect.soft(displayedTax).toBeCloseTo(expectedTax, 2);
    expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 2);
    expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(2);

    await checkoutPage.clickFinish();
    await checkoutPage.completeHeader.waitFor({ state: "visible" });

    await expect
      .soft(checkoutPage.completeHeader)
      .toContainText(CheckoutPageTexts.SuccessThx);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should remove one item after continuing shopping, then complete checkout", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const expectedTotal = inventoryPriceBP;

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);

    const start = Date.now();
    await cartPage.clickContinueShopping();
    const continueShoppingDuration = Date.now() - start;

    expect.soft(continueShoppingDuration).toBeLessThanOrEqual(1500);

    await expect.soft(page).toHaveURL(/.*inventory/);

    await productsPage.removeProductToCart(ProductsCartIds.SauceLabsBikeLight);

    await expect.soft(badge).toHaveText("1");

    await badge.waitFor({ state: "visible" });

    await expect.soft(badge).toHaveText("1");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);

    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);

    const updatedCartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < updatedCartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData = CheckoutDataGenerator.generateUserData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader2ndStep);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );

    expect.soft(overviewPriceBP).toBeCloseTo(inventoryPriceBP, 2);

    const subtotalPrice = await checkoutPage.getSubtotalPrice();
    const displayedTax = await checkoutPage.getTax();
    const displayedTotal = await checkoutPage.getTotalPrice();
    const expectedTax = PricingUtils.calculateTax(expectedTotal);
    const expectedTotalWithTax =
      PricingUtils.calculateTotalWithTax(expectedTotal);

    expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 2);
    expect.soft(displayedTax).toBeCloseTo(expectedTax, 2);
    expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 2);
    expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(1);

    await checkoutPage.clickFinish();

    await checkoutPage.completeHeader.waitFor({ state: "visible" });

    await expect
      .soft(checkoutPage.completeHeader)
      .toContainText(CheckoutPageTexts.SuccessThx);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should add 2 items, start checkout, cancel, return to cart, verify item count, then complete checkout", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );
    const expectedTotal = inventoryPriceBP + inventoryPriceBL;
    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);

    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    await checkoutPage.clickCancel();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData = CheckoutDataGenerator.generateUserData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader2ndStep);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(overviewPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(overviewPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    const subtotalPrice = await checkoutPage.getSubtotalPrice();
    const displayedTax = await checkoutPage.getTax();
    const displayedTotal = await checkoutPage.getTotalPrice();
    const expectedTax = PricingUtils.calculateTax(expectedTotal);
    const expectedTotalWithTax =
      PricingUtils.calculateTotalWithTax(expectedTotal);

    expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 2);
    expect.soft(displayedTax).toBeCloseTo(expectedTax, 2);
    expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 2);
    expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(2);

    await checkoutPage.clickFinish();
    await checkoutPage.completeHeader.waitFor({ state: "visible" });

    await expect
      .soft(checkoutPage.completeHeader)
      .toContainText(CheckoutPageTexts.SuccessThx);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should cancel on the overview page, return to inventory, and preserve items", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);

    await cartPage.clickCheckout();
    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData = CheckoutDataGenerator.generateUserData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader2ndStep);
    expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(2);

    const start = Date.now();
    await checkoutPage.clickCancel();
    const cancelDuration = Date.now() - start;

    expect.soft(cancelDuration).toBeLessThanOrEqual(1500);
    await expect.soft(page).toHaveURL(/.*inventory/);

    const badgeAfterCancel = await productsPage.waitForCartBadge();

    await expect.soft(badgeAfterCancel).toHaveText("2");
  });

  test("should add 2 items, delete 1 from cart, verify count, and complete checkout", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge1 = await productsPage.waitForCartBadge();

    await expect.soft(badge1).toHaveText("2");

    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );
    const expectedTotal = inventoryPriceBL;
    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);
    await expect.soft(cartPage.getCartItemsCount()).resolves.toBe(2);

    await cartPage.removeProductFromCart(ProductsCartIds.SauceLabsBackpack);

    await expect.soft(cartPage.getCartItemsCount()).resolves.toBe(1);

    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    await cartPage.clickContinueShopping();

    const badge2 = await productsPage.waitForCartBadge();

    await expect.soft(badge2).toHaveText("1");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);

    const updatedCartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < updatedCartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData = CheckoutDataGenerator.generateUserData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader2ndStep);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(overviewPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    const subtotalPrice = await checkoutPage.getSubtotalPrice();
    const displayedTax = await checkoutPage.getTax();
    const displayedTotal = await checkoutPage.getTotalPrice();
    const expectedTax = PricingUtils.calculateTax(expectedTotal);
    const expectedTotalWithTax =
      PricingUtils.calculateTotalWithTax(expectedTotal);

    expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 2);
    expect.soft(displayedTax).toBeCloseTo(expectedTax, 2);
    expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 2);
    expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(1);

    await checkoutPage.clickFinish();

    await expect
      .soft(checkoutPage.completeHeader)
      .toContainText(CheckoutPageTexts.SuccessThx);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should add 2 items from product details pages, and complete checkout successfully", async ({
    page,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    await productsPage.openProductByName(ProductsNames.SauceLabsBackpack);
    await productsPage.addToCartFromProjectDetails();
    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    await productsPage.clickBackToProducts();
    await productsPage.openProductByName(ProductsNames.SauceLabsBikeLight);
    await productsPage.addToCartFromProjectDetails();
    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );
    const expectedTotal = inventoryPriceBP + inventoryPriceBL;
    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateUserData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader2ndStep);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(overviewPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(overviewPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    const subtotalPrice = await checkoutPage.getSubtotalPrice();
    const displayedTax = await checkoutPage.getTax();
    const displayedTotal = await checkoutPage.getTotalPrice();

    const expectedTax = PricingUtils.calculateTax(expectedTotal);
    const expectedTotalWithTax =
      PricingUtils.calculateTotalWithTax(expectedTotal);

    expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 2);
    expect.soft(displayedTax).toBeCloseTo(expectedTax, 2);
    expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 2);
    expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(2);

    await checkoutPage.clickFinish();
    await checkoutPage.completeHeader.waitFor({ state: "visible" });

    await expect
      .soft(checkoutPage.completeHeader)
      .toContainText(CheckoutPageTexts.SuccessThx);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });
});

// I didn’t repeat all the same tests for the problem user as for the standard user to reduce the amount of code to review.
// Most of them fail the same way for this user — the bug is that the last name field cannot be typed in.
test.describe("Checkout flow - problem user", () => {
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

  test("should add 2 items and complete checkout successfully --> BUG: unable to type in the last name field", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );
    const expectedTotal = inventoryPriceBP + inventoryPriceBL;

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);
    
    const classAttr = await cartPage.checkoutButton.getAttribute('class');
    expect.soft(classAttr).not.toContain('btn_visual_failure');

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateUserData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader2ndStep);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(overviewPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(overviewPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    const subtotalPrice = await checkoutPage.getSubtotalPrice();
    const displayedTax = await checkoutPage.getTax();
    const displayedTotal = await checkoutPage.getTotalPrice();

    const expectedTax = PricingUtils.calculateTax(expectedTotal);
    const expectedTotalWithTax =
      PricingUtils.calculateTotalWithTax(expectedTotal);

    expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 2);
    expect.soft(displayedTax).toBeCloseTo(expectedTax, 2);
    expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 2);
    expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(2);

    await checkoutPage.clickFinish();
    await checkoutPage.completeHeader.waitFor({ state: "visible" });

    await expect
      .soft(checkoutPage.completeHeader)
      .toContainText(CheckoutPageTexts.SuccessThx);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should add 2 items from product details pages, and complete checkout successfully --> BUG: unable to add item from the product details page", async ({
    page,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    await productsPage.openProductByName(ProductsNames.SauceLabsBackpack);
    await productsPage.addToCartFromProjectDetails();
    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    await productsPage.clickBackToProducts();
    await productsPage.openProductByName(ProductsNames.SauceLabsBikeLight);
    await productsPage.addToCartFromProjectDetails();
    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );
    const expectedTotal = inventoryPriceBP + inventoryPriceBL;
    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateUserData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader2ndStep);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBackpack,
    );
    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductsNames.SauceLabsBikeLight,
    );

    expect.soft(overviewPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(overviewPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    const subtotalPrice = await checkoutPage.getSubtotalPrice();
    const displayedTax = await checkoutPage.getTax();
    const displayedTotal = await checkoutPage.getTotalPrice();

    const expectedTax = PricingUtils.calculateTax(expectedTotal);
    const expectedTotalWithTax =
      PricingUtils.calculateTotalWithTax(expectedTotal);

    expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 2);
    expect.soft(displayedTax).toBeCloseTo(expectedTax, 2);
    expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 2);
    expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(2);

    await checkoutPage.clickFinish();
    await checkoutPage.completeHeader.waitFor({ state: "visible" });

    await expect
      .soft(checkoutPage.completeHeader)
      .toContainText(CheckoutPageTexts.SuccessThx);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });
});
