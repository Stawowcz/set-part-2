import { test, expect } from "@fixtures";
import { ProductPageItemIds, ProductPageNames, ProductsPageTexts } from "@typings/products";
import { CheckoutFormData, CheckoutPageTexts } from "@typings/checkout";
import { CartPageTexts } from "@typings/cart";
import { SharedTexts } from "@typings/common";
import { PricingUtils, env, CheckoutDataGenerator } from "@utils";

test.describe("Checkout flow - standard user", () => {
  test.beforeEach(async ({ page, loginPage:_, productsPage }) => {
    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  test("should add 2 items and complete checkout successfully", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductPageNames.BikeLight,
    );
    const expectedTotal = inventoryPriceBP + inventoryPriceBL;
    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }
    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductPageNames.BikeLight,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    const classAttr = await cartPage.checkoutButton.getAttribute("class");
    expect.soft(classAttr).not.toContain("btn_visual_failure");

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData: CheckoutFormData =
      CheckoutDataGenerator.generateCheckoutFormData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }
    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductPageNames.BikeLight,
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
      .toContainText(CheckoutPageTexts.SuccessHeader);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should remove one item after continuing shopping, then complete checkout", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const expectedTotal = inventoryPriceBP;
    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }
    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);

    const start = Date.now();
    await cartPage.clickContinueShopping();
    const continueShoppingDuration = Date.now() - start;

    expect.soft(continueShoppingDuration).toBeLessThanOrEqual(1500);
    await expect.soft(page).toHaveURL(/.*inventory/);

    await productsPage.removeProductToCart(ProductPageItemIds.BikeLight);

    await expect.soft(badge).toHaveText("1");

    await badge.waitFor({ state: "visible" });

    await expect.soft(badge).toHaveText("1");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);

    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

    const updatedCartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < updatedCartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }
    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData = CheckoutDataGenerator.generateCheckoutFormData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }
    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductPageNames.Backpack,
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
      .toContainText(CheckoutPageTexts.SuccessHeader);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should add 2 items, start checkout, cancel, return to cart, verify item count, then complete checkout", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductPageNames.BikeLight,
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
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductPageNames.BikeLight,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    await checkoutPage.clickCancel();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData = CheckoutDataGenerator.generateCheckoutFormData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);

    const overviewQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }
    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductPageNames.BikeLight,
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
      .toContainText(CheckoutPageTexts.SuccessHeader);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should cancel on the overview page, return to inventory, and preserve items", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);

    const cartQuantities = await checkoutPage.itemQuantity.count();
    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData = CheckoutDataGenerator.generateCheckoutFormData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);

    const overviewQuantities = await checkoutPage.itemQuantity.count();

    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);
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
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
    const badge1 = await productsPage.waitForCartBadge();

    await expect.soft(badge1).toHaveText("2");

    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductPageNames.BikeLight,
    );
    const expectedTotal = inventoryPriceBL;
    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);

    const cartQuantities = await checkoutPage.itemQuantity.count();

    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
    await expect.soft(cartPage.getCartItemsCount()).resolves.toBe(2);

    await cartPage.removeProductFromCart(ProductPageItemIds.Backpack);

    await expect.soft(cartPage.getCartItemsCount()).resolves.toBe(1);

    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductPageNames.BikeLight,
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
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData = CheckoutDataGenerator.generateCheckoutFormData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);

    const overviewQuantities = await checkoutPage.itemQuantity.count();

    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductPageNames.BikeLight,
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
      .toContainText(CheckoutPageTexts.SuccessHeader);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });

  test("should add 2 items from product details pages, and complete checkout successfully", async ({
    page,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    await productsPage.openProductByName(ProductPageNames.Backpack);
    await productsPage.addToCartFromProjectDetails();
    const inventoryPriceBP = await productsPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    await productsPage.clickBackToProducts();
    await productsPage.openProductByName(ProductPageNames.BikeLight);
    await productsPage.addToCartFromProjectDetails();
    const inventoryPriceBL = await productsPage.getProductPriceByName(
      ProductPageNames.BikeLight,
    );
    const expectedTotal = inventoryPriceBP + inventoryPriceBL;
    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
    expect.soft(await cartPage.getCartItemsCount()).toBe(2);

    const cartQuantities = await checkoutPage.itemQuantity.count();

    for (let i = 0; i < cartQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const cartPriceBP = await cartPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const cartPriceBL = await cartPage.getProductPriceByName(
      ProductPageNames.BikeLight,
    );

    expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
    expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData: CheckoutFormData =
      CheckoutDataGenerator.generateCheckoutFormData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await expect.soft(page).toHaveURL(/.*checkout-step-two/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);

    const overviewQuantities = await checkoutPage.itemQuantity.count();

    for (let i = 0; i < overviewQuantities; i++) {
      const quantity = checkoutPage.itemQuantity.nth(i);
      await expect.soft(quantity).toHaveText("1");
    }

    const overviewPriceBP = await checkoutPage.getProductPriceByName(
      ProductPageNames.Backpack,
    );
    const overviewPriceBL = await checkoutPage.getProductPriceByName(
      ProductPageNames.BikeLight,
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
      .toContainText(CheckoutPageTexts.SuccessHeader);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);
  });
});
