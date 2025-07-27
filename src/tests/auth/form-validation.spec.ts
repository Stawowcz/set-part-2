import { test, expect } from "@fixtures";
import { LoginPageErrorMessages } from "@typings/auth";
import { env }  from '@utils';

test.describe("Negatvie scenarios - authentication with user using wrong credentials", () => {
  test("should show error for incorrect username", async ({ loginPage }) => {
    await loginPage.login(
      env.SAUCE_DEMO_INCORRECT_USER,
      env.SAUCE_DEMO_PASSWORD,
    );

    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect
      .soft(loginPage.errorMessage)
      .toHaveText(LoginPageErrorMessages.InvalidCreds);
  });

  test("should show error for incorrect password", async ({ loginPage }) => {
    await loginPage.login(
      env.SAUCE_DEMO_STANDARD_USER,
      env.SAUCE_DEMO_INCORRECT_PASSWORD,
    );

    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect
      .soft(loginPage.errorMessage)
      .toHaveText(LoginPageErrorMessages.InvalidCreds);
  });
});
