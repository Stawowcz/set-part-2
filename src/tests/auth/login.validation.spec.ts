import { test } from "../../fixtures";
import { expect } from "@playwright/test";
import { ProductsPageTexts } from "../../types/productsPage.enums";
import { LoginPageTexts } from "../../types/loginPage.enums";

test.describe("Negatvie scenarios - authentication with user using wrong credentials", () => {
  test("should show error for incorrect username", async ({ loginPage }) => {
    await loginPage.login(
      process.env.SAUCE_DEMO_INCORRECT_USER ?? "<unknown>",
      process.env.SAUCE_DEMO_PASSWORD ?? "<unknown>",
    );

    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect
      .soft(loginPage.errorMessage)
      .toHaveText(LoginPageTexts.WrongPasswordOrUser);
  });

  test("should show error for incorrect password", async ({ loginPage }) => {
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
