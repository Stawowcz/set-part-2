import { test, expect } from "@fixtures";
import { ProductPageItemIds, ProductsPageTexts } from "@typings/products";
import { CheckoutFormData, CheckoutPageTexts } from "@typings/checkout";
import { CartPageTexts } from "@typings/cart";
import { CheckoutDataGenerator } from "@utils";
import { ProductNames } from "@typings/common";

test.describe("Checkout flow - standard user", () => {
  test.beforeEach(async ({ page, loginPage: _, productsPage }) => {
    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  test("Should navigate back to products page after order completion", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("1");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

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

    await checkoutPage.clickFinish();
    await checkoutPage.completeHeader.waitFor({ state: "visible" });

    await expect
      .soft(checkoutPage.completeHeader)
      .toContainText(CheckoutPageTexts.SuccessHeader);
    await expect.soft(page).toHaveURL(/.*checkout-complete/);

    await checkoutPage.clickBackToProduct();
    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.title)
      .toContainText(ProductsPageTexts.Title);
  });

  test("Should navigate to product detail page when clicking product link in checkout", async ({
    page,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("1");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

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

    await checkoutPage.clickProductByName(ProductNames.Backpack);
    await expect
      .soft(productsPage.getProductNameLocatorByName(ProductNames.Backpack))
      .toBeVisible();
    await expect.soft(page).toHaveURL(/.*inventory-item\.html/);
  });

  test("Should navigate to product detail page when clicking product link in cart", async ({
    page,
    productsPage,
    cartPage,
  }) => {
    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("1");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect.soft(cartPage.title).toHaveText(CartPageTexts.Header);

    await cartPage.clickProductByName(ProductNames.Backpack);
    await expect.soft(page).toHaveURL(/.*inventory-item\.html/);
    await expect
      .soft(productsPage.getProductNameLocatorByName(ProductNames.Backpack))
      .toBeVisible();
  });
});
