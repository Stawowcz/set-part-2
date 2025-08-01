import {
  expect,
  problemUser,
  errorUser,
  performanceGlitchUser,
  visualUser,
} from "@fixtures";
import { ProductPageItemIds, ProductsPageTexts } from "@typings/products";
import { CheckoutFormData } from "@typings/checkout";
import { CheckoutDataGenerator, PricingUtils, env } from "@utils";
import { CartPageTexts } from "@typings/cart";
import { CheckoutPageTexts } from "@typings/checkout/checkout-enums";
import { ProductNames } from "@typings/common";

// I didn’t repeat all the same tests for the problem user as for the standard user to reduce the amount of code to review.
// Most of them fail the same way for this user — the bug is that the last name field cannot be typed in.
problemUser.describe("Checkout flow - problem user", () => {
  problemUser.beforeEach(async ({ loginPage: _, productsPage }) => {
    await productsPage.expectUrlContains("inventory");
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  problemUser(
    "should add 2 items and complete checkout successfully --> BUG: unable to type in the last name field",
    async ({  productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("2");

      const inventoryPriceBP = await productsPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const inventoryPriceBL = await productsPage.getProductPriceByName(
        ProductNames.BikeLight,
      );
      const expectedTotal = inventoryPriceBP + inventoryPriceBL;

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
      expect.soft(await cartPage.getCartItemsCount()).toBe(2);

      const cartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < cartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const cartPriceBP = await cartPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const cartPriceBL = await cartPage.getProductPriceByName(
        ProductNames.BikeLight,
      );

      expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
      expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

      const classAttr = await cartPage.checkoutButton.getAttribute("class");

      expect.soft(classAttr).not.toContain("btn_visual_failure");

      await cartPage.clickCheckout();

      await productsPage.expectUrlContains("checkout-step-one");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step1Header);

      const formData: CheckoutFormData =
        CheckoutDataGenerator.generateCheckoutFormData();
      await checkoutPage.fillInfo(formData);
      await checkoutPage.clickContinue();

      await productsPage.expectUrlContains("checkout-step-two");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step2Header);

      const overviewQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < overviewQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const overviewPriceBP = await checkoutPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const overviewPriceBL = await checkoutPage.getProductPriceByName(
        ProductNames.BikeLight,
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
      await productsPage.expectUrlContains("checkout-complete");
    },
  );

  problemUser(
    "should add 2 items from product details pages, and complete checkout successfully --> BUG: unable to add item from the product details page",
    async ({  productsPage, cartPage, checkoutPage }) => {
      await productsPage.clickProductByName(ProductNames.Backpack);
      await productsPage.addToCartFromProjectDetails();
      const inventoryPriceBP = await productsPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      await productsPage.clickBackToProducts();
      await productsPage.clickProductByName(ProductNames.BikeLight);
      await productsPage.addToCartFromProjectDetails();
      const inventoryPriceBL = await productsPage.getProductPriceByName(
        ProductNames.BikeLight,
      );
      const expectedTotal = inventoryPriceBP + inventoryPriceBL;
      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
      expect.soft(await cartPage.getCartItemsCount()).toBe(2);

      const cartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < cartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const cartPriceBP = await cartPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const cartPriceBL = await cartPage.getProductPriceByName(
        ProductNames.BikeLight,
      );

      expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
      expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

      await cartPage.clickCheckout();

      await productsPage.expectUrlContains("checkout-step-one");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step1Header);

      const formData: CheckoutFormData =
        CheckoutDataGenerator.generateCheckoutFormData();
      await checkoutPage.fillInfo(formData);
      await checkoutPage.clickContinue();

      await productsPage.expectUrlContains("checkout-step-two");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step2Header);

      const overviewQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < overviewQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const overviewPriceBP = await checkoutPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const overviewPriceBL = await checkoutPage.getProductPriceByName(
        ProductNames.BikeLight,
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
      await productsPage.expectUrlContains("checkout-complete");
    },
  );
});

// I didn’t repeat all the same tests for the error user as for the standard user to reduce the amount of code to review.
// Most of them fail the same way for this user — the bug is that the finish button can not be clicked.
errorUser.describe("Checkout flow - error user", () => {
  errorUser.beforeEach(async ({  loginPage: _, productsPage }) => {
    await productsPage.expectUrlContains("inventory");
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  errorUser(
    "should add 2 items and complete checkout successfully --> BUG: unable to click the finish button",
    async ({ productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("2");

      const inventoryPriceBP = await productsPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const inventoryPriceBL = await productsPage.getProductPriceByName(
        ProductNames.BikeLight,
      );
      const expectedTotal = inventoryPriceBP + inventoryPriceBL;

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
      expect.soft(await cartPage.getCartItemsCount()).toBe(2);

      const cartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < cartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const cartPriceBP = await cartPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const cartPriceBL = await cartPage.getProductPriceByName(
        ProductNames.BikeLight,
      );

      expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
      expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

      const classAttr = await cartPage.checkoutButton.getAttribute("class");

      expect.soft(classAttr).not.toContain("btn_visual_failure");

      await cartPage.clickCheckout();

      await productsPage.expectUrlContains("checkout-step-one");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step1Header);

      const formData: CheckoutFormData =
        CheckoutDataGenerator.generateCheckoutFormData();
      await checkoutPage.fillInfo(formData);
      await checkoutPage.clickContinue();

      await productsPage.expectUrlContains("checkout-step-two");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step2Header);

      const overviewQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < overviewQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const overviewPriceBP = await checkoutPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const overviewPriceBL = await checkoutPage.getProductPriceByName(
        ProductNames.BikeLight,
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
      await productsPage.expectUrlContains("checkout-complete");
    },
  );

  errorUser(
    "should remove one item after continuing shopping, then complete checkout --> BUG: unable to click the remove and finish button",
    async ({  productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("2");

      const inventoryPriceBP = await productsPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const expectedTotal = inventoryPriceBP;
      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
      expect.soft(await cartPage.getCartItemsCount()).toBe(2);

      const cartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < cartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const cartPriceBP = await cartPage.getProductPriceByName(
        ProductNames.Backpack,
      );

      expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);

      const start = Date.now();
      await cartPage.clickContinueShopping();
      const continueShoppingDuration = Date.now() - start;

      expect.soft(continueShoppingDuration).toBeLessThanOrEqual(1500);
      await productsPage.expectUrlContains("inventory");

      await productsPage.removeProductToCart(ProductPageItemIds.BikeLight);
      await badge.waitFor({ state: "visible" });

      await expect.soft(badge).toHaveText("1");

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

      const updatedCartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < updatedCartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      await cartPage.clickCheckout();

      await productsPage.expectUrlContains("checkout-step-one");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step1Header);

      const formData = CheckoutDataGenerator.generateCheckoutFormData();
      await checkoutPage.fillInfo(formData);
      await checkoutPage.clickContinue();

      await productsPage.expectUrlContains("checkout-step-two");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step2Header);

      const overviewQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < overviewQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const overviewPriceBP = await checkoutPage.getProductPriceByName(
        ProductNames.Backpack,
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
      await productsPage.expectUrlContains("checkout-complete");
    },
  );
});

// I didn’t repeat all the same tests for the glitch user as for the standard user to reduce the amount of code to review.
// I only included the cases where the glitch bug actually occurs (see below).
performanceGlitchUser.describe("Checkout flow - glitch user", () => {
  performanceGlitchUser.beforeEach(
    async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    },
  );

  performanceGlitchUser(
    "should remove one item after continuing shopping, then complete checkout --> BUG: continue shopping takes more than 1.5s",
    async ({ productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("2");

      const inventoryPriceBP = await productsPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const expectedTotal = inventoryPriceBP;

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
      expect.soft(await cartPage.getCartItemsCount()).toBe(2);

      const cartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < cartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const cartPriceBP = await cartPage.getProductPriceByName(
        ProductNames.Backpack,
      );

      expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);

      const start = Date.now();
      await cartPage.clickContinueShopping();
      const continueShoppingDuration = Date.now() - start;

      expect.soft(continueShoppingDuration).toBeLessThanOrEqual(1500);
      await productsPage.expectUrlContains("inventory");

      await productsPage.removeProductToCart(ProductPageItemIds.BikeLight);

      await expect.soft(badge).toHaveText("1");

      await badge.waitFor({ state: "visible" });

      await expect.soft(badge).toHaveText("1");

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");

      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

      const updatedCartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < updatedCartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      await cartPage.clickCheckout();

      await productsPage.expectUrlContains("checkout-step-one");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step1Header);

      const formData = CheckoutDataGenerator.generateCheckoutFormData();
      await checkoutPage.fillInfo(formData);
      await checkoutPage.clickContinue();

      await productsPage.expectUrlContains("checkout-step-two");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step2Header);

      const overviewQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < overviewQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const overviewPriceBP = await checkoutPage.getProductPriceByName(
        ProductNames.Backpack,
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
      await productsPage.expectUrlContains("checkout-complete");
    },
  );

  performanceGlitchUser(
    "should cancel on the overview page, return to inventory, and preserve items --> BUG: cancel takes more than 1.5s",
    async ({  productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("2");

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");

      const cartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < cartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

      await cartPage.clickCheckout();
      await productsPage.expectUrlContains("checkout-step-one");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step1Header);

      const formData = CheckoutDataGenerator.generateCheckoutFormData();
      await checkoutPage.fillInfo(formData);
      await checkoutPage.clickContinue();

      await productsPage.expectUrlContains("checkout-step-two");

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
      await productsPage.expectUrlContains("inventory");

      const badgeAfterCancel = await productsPage.waitForCartBadge();

      await expect.soft(badgeAfterCancel).toHaveText("2");
    },
  );
});

// I didn’t repeat all the same tests for the visual user as for the standard user to reduce the amount of code to review.
// I only included the cases where the visual bug actually occurs (see below).
visualUser.describe("Checkout flow - visual user", () => {
  visualUser.beforeEach(async ({ loginPage: _, productsPage }) => {
    await productsPage.expectUrlContains("inventory");
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  visualUser(
    "should add 2 items and complete checkout successfully --> BUGS: incorrect price in the inventory, and forbidden class on the checkout button",
    async ({ productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("2");

      const inventoryPriceBP = await productsPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const inventoryPriceBL = await productsPage.getProductPriceByName(
        ProductNames.BikeLight,
      );
      const expectedTotal = inventoryPriceBP + inventoryPriceBL;
      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
      expect.soft(await cartPage.getCartItemsCount()).toBe(2);

      const cartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < cartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const cartPriceBP = await cartPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const cartPriceBL = await cartPage.getProductPriceByName(
        ProductNames.BikeLight,
      );

      expect.soft(cartPriceBP).toBeCloseTo(inventoryPriceBP, 2);
      expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

      const classAttr = await cartPage.checkoutButton.getAttribute("class");
      expect.soft(classAttr).not.toContain("btn_visual_failure");

      await cartPage.clickCheckout();

      await productsPage.expectUrlContains("checkout-step-one");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step1Header);

      const formData: CheckoutFormData =
        CheckoutDataGenerator.generateCheckoutFormData();
      await checkoutPage.fillInfo(formData);
      await checkoutPage.clickContinue();

      await productsPage.expectUrlContains("checkout-step-two");
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step2Header);

      const overviewQuantities = await checkoutPage.itemQuantity.count();
      for (let i = 0; i < overviewQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const overviewPriceBP = await checkoutPage.getProductPriceByName(
        ProductNames.Backpack,
      );
      const overviewPriceBL = await checkoutPage.getProductPriceByName(
        ProductNames.BikeLight,
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
      await productsPage.expectUrlContains("checkout-complete");
    },
  );
});
