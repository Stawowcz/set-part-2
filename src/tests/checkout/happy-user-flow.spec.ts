import { expect, standardUser } from "@fixtures";
import { ProductPageItemIds, ProductsPageTexts } from "@typings/products";
import { CheckoutFormData, CheckoutPageTexts } from "@typings/checkout";
import { CartPageTexts } from "@typings/cart";
import { ProductNames } from "@typings/common";
import { PricingUtils, CheckoutDataGenerator } from "@utils";

standardUser.describe("Checkout flow - standard user", () => {
  standardUser.beforeEach(async ({ loginPage: _, productsPage }) => {
    await productsPage.expectUrlContains("inventory");
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  standardUser(
    "should add 2 items and complete checkout successfully",
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

  standardUser(
    "should remove one item after continuing shopping, then complete checkout",
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

  standardUser(
    "should add 2 items, start checkout, cancel, return to cart, verify item count, then complete checkout",
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
      expect.soft(await cartPage.getCartItemsCount()).toBe(2);

      const cartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < cartQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

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

      await checkoutPage.clickCancel();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
      expect.soft(await cartPage.getCartItemsCount()).toBe(2);
      for (let i = 0; i < cartQuantities; i++) {
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

  standardUser(
    "should cancel on the overview page, return to inventory, and preserve items",
    async ({ productsPage, checkoutPage, cartPage }) => {
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

  standardUser(
    "should add 2 items, delete 1 from cart, verify count, and complete checkout",
    async ({ productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
      const badge1 = await productsPage.waitForCartBadge();

      await expect.soft(badge1).toHaveText("2");

      const inventoryPriceBL = await productsPage.getProductPriceByName(
        ProductNames.BikeLight,
      );
      const expectedTotal = inventoryPriceBL;
      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");

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
        ProductNames.BikeLight,
      );

      expect.soft(cartPriceBL).toBeCloseTo(inventoryPriceBL, 2);

      await cartPage.clickContinueShopping();

      const badge2 = await productsPage.waitForCartBadge();

      await expect.soft(badge2).toHaveText("1");

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");

      const updatedCartQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < updatedCartQuantities; i++) {
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
      await expect
        .soft(checkoutPage.title)
        .toHaveText(CheckoutPageTexts.Step2Header);

      const overviewQuantities = await checkoutPage.itemQuantity.count();

      for (let i = 0; i < overviewQuantities; i++) {
        const quantity = checkoutPage.itemQuantity.nth(i);
        await expect.soft(quantity).toHaveText("1");
      }

      const overviewPriceBL = await checkoutPage.getProductPriceByName(
        ProductNames.BikeLight,
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
      await productsPage.expectUrlContains("checkout-complete");
    },
  );

  standardUser(
    "should add 2 items from product details pages, and complete checkout successfully",
    async ({ productsPage, cartPage, checkoutPage }) => {
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

  standardUser(
    "should add all products, complete checkout, and verify app is reset",
    async ({ productsPage, checkoutPage, cartPage }) => {
      const productIds = [
        ProductPageItemIds.Backpack,
        ProductPageItemIds.BikeLight,
        ProductPageItemIds.BoltTShirt,
        ProductPageItemIds.FleeceJacket,
        ProductPageItemIds.Onesie,
        ProductPageItemIds.RedTShirt,
      ];

      const productNames = [
        ProductNames.Backpack,
        ProductNames.BikeLight,
        ProductNames.BoltTShirt,
        ProductNames.FleeceJacket,
        ProductNames.Onesie,
        ProductNames.RedTShirt,
      ];

      for (const id of productIds) {
        await productsPage.addProductToCart(id);
      }

      const badge = await productsPage.waitForCartBadge();
      await expect.soft(badge).toHaveText("6");

      const inventoryPrices: number[] = [];
      for (const name of productNames) {
        const price = await productsPage.getProductPriceByName(name);
        inventoryPrices.push(price);
      }

      const expectedTotal = inventoryPrices.reduce(
        (sum, price) => sum + price,
        0,
      );

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

      expect.soft(await cartPage.getCartItemsCount()).toBe(6);

      for (let i = 0; i < productNames.length; i++) {
        const name = productNames[i];
        const expectedPrice = inventoryPrices[i];
        const cartPrice = await cartPage.getProductPriceByName(name);
        expect.soft(cartPrice).toBeCloseTo(expectedPrice, 2);
      }

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

      for (let i = 0; i < productNames.length; i++) {
        const name = productNames[i];
        const expectedPrice = inventoryPrices[i];
        const overviewPrice = await checkoutPage.getProductPriceByName(name);
        expect.soft(overviewPrice).toBeCloseTo(expectedPrice, 2);
      }

      const subtotalPrice = await checkoutPage.getSubtotalPrice();
      const displayedTax = await checkoutPage.getTax();
      const displayedTotal = await checkoutPage.getTotalPrice();
      const expectedTax = PricingUtils.calculateTax(expectedTotal);
      const expectedTotalWithTax =
        PricingUtils.calculateTotalWithTax(expectedTotal);

      expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 1);
      expect.soft(displayedTax).toBeCloseTo(expectedTax, 1);
      expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 1);
      expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(6);

      await checkoutPage.clickFinish();
      await checkoutPage.completeHeader.waitFor({ state: "visible" });

      await expect
        .soft(checkoutPage.completeHeader)
        .toContainText(CheckoutPageTexts.SuccessHeader);
      await productsPage.expectUrlContains("checkout-complete");

      await checkoutPage.clickBackToProduct();
      await productsPage.expectUrlContains("inventory");
      await expect
        .soft(productsPage.title)
        .toContainText(ProductsPageTexts.Title);

      for (const id of productIds) {
        const addButton = productsPage.getAddToCartButton(id);
        const isVisible = await addButton.isVisible();
        expect.soft(isVisible).toBe(true);
      }
    },
  );

  standardUser(
    "should add all products from detail page, complete checkout, and verify app is reset",
    async ({ productsPage, checkoutPage, cartPage }) => {
      const productIds = [
        ProductPageItemIds.Backpack,
        ProductPageItemIds.BikeLight,
        ProductPageItemIds.BoltTShirt,
        ProductPageItemIds.FleeceJacket,
        ProductPageItemIds.Onesie,
        ProductPageItemIds.RedTShirt,
      ];

      const productNames = [
        ProductNames.Backpack,
        ProductNames.BikeLight,
        ProductNames.BoltTShirt,
        ProductNames.FleeceJacket,
        ProductNames.Onesie,
        ProductNames.RedTShirt,
      ];

      const inventoryPrices: number[] = [];

      for (const name of productNames) {
        await productsPage.clickProductByName(name);

        const price = await productsPage.getProductPriceByName(name);
        inventoryPrices.push(price);

        await productsPage.addToCartFromProjectDetails();
        await productsPage.clickBackToProducts();
      }

      const badge = await productsPage.waitForCartBadge();
      await expect.soft(badge).toHaveText("6");

      const expectedTotal = inventoryPrices.reduce(
        (sum, price) => sum + price,
        0,
      );

      await productsPage.clickOnCartBasket();
      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);
      expect.soft(await cartPage.getCartItemsCount()).toBe(6);

      for (let i = 0; i < productNames.length; i++) {
        const name = productNames[i];
        const expectedPrice = inventoryPrices[i];
        const cartPrice = await cartPage.getProductPriceByName(name);
        expect.soft(cartPrice).toBeCloseTo(expectedPrice, 2);
      }

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

      for (let i = 0; i < productNames.length; i++) {
        const name = productNames[i];
        const expectedPrice = inventoryPrices[i];
        const overviewPrice = await checkoutPage.getProductPriceByName(name);
        expect.soft(overviewPrice).toBeCloseTo(expectedPrice, 2);
      }

      const subtotalPrice = await checkoutPage.getSubtotalPrice();
      const displayedTax = await checkoutPage.getTax();
      const displayedTotal = await checkoutPage.getTotalPrice();

      const expectedTax = PricingUtils.calculateTax(expectedTotal);
      const expectedTotalWithTax =
        PricingUtils.calculateTotalWithTax(expectedTotal);

      expect.soft(subtotalPrice).toBeCloseTo(expectedTotal, 1);
      expect.soft(displayedTax).toBeCloseTo(expectedTax, 1);
      expect.soft(displayedTotal).toBeCloseTo(expectedTotalWithTax, 1);
      expect.soft(await checkoutPage.getOverviewItemsCount()).toBe(6);

      await checkoutPage.clickFinish();
      await checkoutPage.completeHeader.waitFor({ state: "visible" });

      await expect
        .soft(checkoutPage.completeHeader)
        .toContainText(CheckoutPageTexts.SuccessHeader);
      await productsPage.expectUrlContains("checkout-complete");

      await checkoutPage.clickBackToProduct();
      await productsPage.expectUrlContains("inventory");
      await expect
        .soft(productsPage.title)
        .toContainText(ProductsPageTexts.Title);

      for (const id of productIds) {
        const addButton = productsPage.getAddToCartButton(id);
        const isVisible = await addButton.isVisible();
        expect.soft(isVisible).toBe(true);
      }
    },
  );
});
