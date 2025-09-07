import { expect, standardUser } from "@fixtures";
import { ProductPageItemIds, ProductsPageTexts } from "@typings/products";
import { CheckoutFormData, CheckoutPageTexts } from "@typings/checkout";
import { CartPageTexts } from "@typings/cart";
import { CheckoutDataGenerator } from "@utils";
import { ProductNames } from "@typings/common";

standardUser.describe("Checkout flow - standard user", () => {
  standardUser.beforeEach(async ({ loginPage: _, productsPage }) => {
    await productsPage.expectUrlContains("inventory");
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  standardUser(
    "Should navigate back to products page after order completion",
    async ({ productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("1");

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

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
    },
  );

  standardUser(
    "Should navigate to product detail page when clicking product link in checkout",
    async ({ productsPage, checkoutPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("1");

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

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

      await checkoutPage.clickProductByName(ProductNames.Backpack);
      await expect
        .soft(productsPage.getProductNameLocatorByName(ProductNames.Backpack))
        .toBeVisible();
      await productsPage.expectUrlContains("inventory-item.html");
    },
  );

  standardUser(
    "Should navigate to product detail page when clicking product link in cart",
    async ({ productsPage, cartPage }) => {
      await productsPage.addProductToCart(ProductPageItemIds.Backpack);
      const badge = await productsPage.waitForCartBadge();

      await expect.soft(badge).toHaveText("1");

      await productsPage.clickOnCartBasket();

      await productsPage.expectUrlContains("cart");
      await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

      await cartPage.clickProductByName(ProductNames.Backpack);
      await productsPage.expectUrlContains("inventory-item.html");
      await expect
        .soft(productsPage.getProductNameLocatorByName(ProductNames.Backpack))
        .toBeVisible();
    },
  );
});
