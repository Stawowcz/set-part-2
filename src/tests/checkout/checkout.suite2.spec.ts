// import { test } from "../fixtures/fixtures";
import { test, expect } from '../../fixtures';

// import { expect } from "@playwright/test";
import { ProductsCartIds, ProductsNames } from "../../types/productsPage.enums";
import { CheckoutFormData } from "../../types/userData";
import { CheckoutDataGenerator } from "../../utils/testData";
import { CartPageTexts } from "../../types/cartPage.enums";
import {
  CheckoutPageTexts,
  CheckoutPageErrorMsg,
} from "../../types/checkoutPage.enum";
import { ProductsPageTexts } from "../../types/productsPage.enums";
import { PricingUtils } from "../../utils/pricing.utils";

// I didn’t repeat all the same tests for the error user as for the standard user to reduce the amount of code to review.
// Most of them fail the same way for this user — the bug is that the finish button can not be clicked.
test.describe("Checkout flow - error user", () => {
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

  test("should add 2 items and complete checkout successfully --> BUG: unable to click the finish button", async ({
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

    const classAttr = await cartPage.checkoutButton.getAttribute("class");

    expect.soft(classAttr).not.toContain("btn_visual_failure");

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

  test("should remove one item after continuing shopping, then complete checkout --> BUG: unable to click the remove and finish button", async ({
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
});

// I didn’t repeat all the same tests for the glitch user as for the standard user to reduce the amount of code to review.
// I only included the cases where the glitch bug actually occurs (see below).
test.describe("Checkout flow - glitch user", () => {
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_PERFORMACE_GLITCH_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
  });

  test("should remove one item after continuing shopping, then complete checkout --> BUG: continue shopping takes more than 1.5s", async ({
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

  test("should cancel on the overview page, return to inventory, and preserve items --> BUG: cancel takes more than 1.5s", async ({
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
});

// I didn’t repeat all the same tests for the visual user as for the standard user to reduce the amount of code to review.
// I only included the cases where the visual bug actually occurs (see below).
test.describe("Checkout flow - visual user", () => {
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_VISUAL_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
  });

  test("should add 2 items and complete checkout successfully --> BUGS: incorrect price in the inventory, and forbidden class on the checkout button", async ({
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

    const classAttr = await cartPage.checkoutButton.getAttribute("class");
    expect.soft(classAttr).not.toContain("btn_visual_failure");

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

test.describe("Negative scenario – error handling in the checkout personal information form", () => {
  test("should display an error message in the checkout personal information form - standard user", async ({
    page,
    loginPage,
    productsPage,
    checkoutPage,
    cartPage,
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

    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateUserData();

    await test.step("should fill in last name and postal code, then attempt to continue without first name", async () => {
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.FirstName);
    });

    await test.step("should fill in first name and postal code, then attempt to continue without last name", async () => {
      await checkoutPage.clearLastName();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.LastName);
    });

    await test.step("should fill in first name and last name, then attempt to continue without postal code", async () => {
      await checkoutPage.clearPostal();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.PostalCode);
    });
  });

  test("should display an error message in the checkout personal information form - error user --> BUG: unable to type in the last name field", async ({
    page,
    loginPage,
    productsPage,
    checkoutPage,
    cartPage,
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

    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateUserData();

    await test.step("should fill in last name and postal code, then attempt to continue without first name", async () => {
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.FirstName);
    });

    await test.step("should fill in first name and postal code, then attempt to continue without last name", async () => {
      await checkoutPage.clearLastName();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.LastName);
    });

    await test.step("should fill in first name and last name, then attempt to continue without postal code", async () => {
      await checkoutPage.clearPostal();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.PostalCode);
    });
  });

  test("should display an error message in the checkout personal information form - problem user --> BUG: unable to type in the last name field – input overwrites first name instead", async ({
    page,
    loginPage,
    productsPage,
    checkoutPage,
    cartPage,
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

    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBackpack);
    await productsPage.addProductToCart(ProductsCartIds.SauceLabsBikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.header)
      .toHaveText(CartPageTexts.SecondaryHeader);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.header)
      .toHaveText(CheckoutPageTexts.SecondaryHeader);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateUserData();

    await test.step("should fill in last name and postal code, then attempt to continue without first name", async () => {
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.FirstName);
    });

    await test.step("should fill in first name and postal code, then attempt to continue without last name", async () => {
      await checkoutPage.clearLastName();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.LastName);
    });

    await test.step("should fill in first name and last name, then attempt to continue without postal code", async () => {
      await checkoutPage.clearPostal();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMsg.PostalCode);
    });
  });
});
