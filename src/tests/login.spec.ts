import { test } from "../fixtures/fixtures";
import { expect } from "@playwright/test";
import { ProductsPageTexts } from "../types/productsPage.enums";
import { LoginPageTexts } from "../types/loginPage.enums";

test.describe("Positive scenarios – authentication with different users", () => {
  test("should log in - standard user", async ({
    loginPage,
    productsPage,
    page,
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
  });

  test("should log in – locked out user --> BUG: user is locked", async ({
    loginPage,
    productsPage,
    page,
  }) => {
    //here I show that user does not work, this is how I understand it that I need to show where application does not work properly or user is corrupted
    await loginPage.login(
      process.env.SAUCE_DEMO_LOCKED_OUT_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
  });

  test("should log in - glitch user --> BUG: login takes longer than 1.5s", async ({
    loginPage,
    productsPage,
  }) => {
    await loginPage.goto(process.env.SAUCE_DEMO_BASEURL ?? "<unknown>");
    await loginPage.fillUserNameField(
      process.env.SAUCE_DEMO_PERFORMACE_GLITCH_USER ?? "<unknown>",
    );
    await loginPage.fillPasswordField(
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );
    const start = Date.now();
    await loginPage.clickOnLoginButton();

    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(ProductsPageTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    const duration = Date.now() - start;
    expect.soft(duration).toBeLessThanOrEqual(1500);
  });
});

test.describe("Negatvie scenarios - authentication with user using wrong credentials", () => {
  test("should show error for incorrect username", async ({
    loginPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_INCORRECT_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect
      .soft(loginPage.errorMessage)
      .toHaveText(LoginPageTexts.WrongPasswordOrUser);
  });

  test("should show error for incorrect password", async ({
    loginPage,
  }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_STANDARD_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_INCORRECT_PASSWORD ?? "<unknown>",
    );

    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect
      .soft(loginPage.errorMessage)
      .toHaveText(LoginPageTexts.WrongPasswordOrUser);
  });
});
