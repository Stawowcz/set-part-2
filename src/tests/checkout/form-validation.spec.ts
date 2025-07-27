import { test, expect } from '@fixtures';
import { ProductPageItemIds } from "@typings/products";
import { CheckoutDataGenerator, env } from "@utils";
import { CartPageTexts } from "@typings/cart";
import {
  CheckoutFormData,
  CheckoutPageTexts,
  CheckoutPageErrorMessages,
} from '@typings/checkout/';

import { SharedTexts } from "../../types/common/common-enums";

test.describe("Negative scenario – error handling in the checkout personal information form", () => {
  test("should display an error message in the checkout personal information form - standard user", async ({
    page,
    loginPage,
    productsPage,
    checkoutPage,
    cartPage,
  }) => {
    await loginPage.login(
      env.SAUCE_DEMO_STANDARD_USER,
      env.SAUCE_DEMO_PASSWORD
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(SharedTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();

    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.title)
      .toHaveText(CartPageTexts.Header);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateCheckoutFormData();

    await test.step("should fill in last name and postal code, then attempt to continue without first name", async () => {
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.FirstNameRequired);
    });

    await test.step("should fill in first name and postal code, then attempt to continue without last name", async () => {
      await checkoutPage.clearLastName();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.LastNameRequired);
    });

    await test.step("should fill in first name and last name, then attempt to continue without postal code", async () => {
      await checkoutPage.clearPostal();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.PostalCodeRequired);
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
      env.SAUCE_DEMO_ERROR_USER,
      env.SAUCE_DEMO_PASSWORD,
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(SharedTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();

    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.title)
      .toHaveText(CartPageTexts.Header);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateCheckoutFormData();

    await test.step("should fill in last name and postal code, then attempt to continue without first name", async () => {
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.LastNameRequired);
    });

    await test.step("should fill in first name and postal code, then attempt to continue without last name", async () => {
      await checkoutPage.clearLastName();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.LastNameRequired);
    });

    await test.step("should fill in first name and last name, then attempt to continue without postal code", async () => {
      await checkoutPage.clearPostal();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.PostalCodeRequired);
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
      env.SAUCE_DEMO_PROBLEM_USER,
      env.SAUCE_DEMO_PASSWORD,
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(SharedTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();

    await productsPage.addProductToCart(ProductPageItemIds.Backpack);
    await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
    const badge = await productsPage.waitForCartBadge();

    await expect.soft(badge).toHaveText("2");

    await productsPage.clickOnCartBasket();

    await expect.soft(page).toHaveURL(/.*cart/);
    await expect
      .soft(cartPage.title)
      .toHaveText(CartPageTexts.Header);

    await cartPage.clickCheckout();

    await expect.soft(page).toHaveURL(/.*checkout-step-one/);
    await expect
      .soft(checkoutPage.title)
      .toHaveText(CheckoutPageTexts.Step1Header);

    const formData: CheckoutFormData = CheckoutDataGenerator.generateCheckoutFormData();

    await test.step("should fill in last name and postal code, then attempt to continue without first name", async () => {
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.LastNameRequired);
    });

    await test.step("should fill in first name and postal code, then attempt to continue without last name", async () => {
      await checkoutPage.clearLastName();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillPostalCode(formData.postalCode);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.LastNameRequired);
    });

    await test.step("should fill in first name and last name, then attempt to continue without postal code", async () => {
      await checkoutPage.clearPostal();
      await checkoutPage.fillFirstName(formData.firstName);
      await checkoutPage.fillLastName(formData.lastName);
      await checkoutPage.clickContinue();

      await expect
        .soft(checkoutPage.error)
        .toHaveText(CheckoutPageErrorMessages.PostalCodeRequired);
    });
  });
});
