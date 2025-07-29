import { expect, standardUser } from "@fixtures";
import { ProductPageItemIds, ProductsPageTexts } from "@typings/products";
import { CheckoutFormData, CheckoutPageTexts } from "@typings/checkout";
import { CartPageTexts } from "@typings/cart";
import { CheckoutDataGenerator } from "@utils";

standardUser.describe("Checkout flow - standard user", () => {
  standardUser.beforeEach(async ({  loginPage: _, productsPage }) => {
    await productsPage.expectUrlContains("inventory");
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  standardUser("should show “Basket is empty” popup when trying to proceed with empty cart --> BUG: popup not exits", async ({
    page,
    productsPage,
    cartPage,
  }) => {
    await productsPage.clickOnCartBasket();

    await productsPage.expectUrlContains("cart");
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

    await cartPage.clickCheckout();

    await expect(page.getByText(CartPageTexts.EmptyBasket)).toBeVisible({
      timeout: 5_000,
    });
  });

  standardUser("should support navigation between checkout steps using goBack and goForward", async ({
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("1");

    await productsPage.clickOnCartBasket();

    await checkoutPage.expectUrlContains("cart");
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

    await cartPage.clickCheckout();

    await checkoutPage.expectUrlContains("checkout-step-one.html");
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData: CheckoutFormData =
      CheckoutDataGenerator.generateCheckoutFormData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await checkoutPage.expectUrlContains("checkout-step-two");
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);

    await checkoutPage.goBack();

    await checkoutPage.expectUrlContains("checkout-step-one.html");
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    await checkoutPage.goForward();

    await checkoutPage.expectUrlContains("checkout-step-two");
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);
  });

  standardUser("should support reload in checkout", async ({
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("1");

    await productsPage.clickOnCartBasket();

    await checkoutPage.expectUrlContains("cart");
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

    await cartPage.clickCheckout();

    await checkoutPage.expectUrlContains("checkout-step-one.html");
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData: CheckoutFormData =
      CheckoutDataGenerator.generateCheckoutFormData();
    await checkoutPage.fillInfo(formData);
    await checkoutPage.clickContinue();

    await checkoutPage.expectUrlContains("checkout-step-two");
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);

    await checkoutPage.reloadPage();

    await checkoutPage.expectUrlContains("checkout-step-two");
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step2Header);
  });
});
