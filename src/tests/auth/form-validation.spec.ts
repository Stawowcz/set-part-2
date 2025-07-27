import { test, expect, incorrectUser, incorrectPassword } from "@fixtures";
import { LoginPageErrorMessages } from "@typings/auth";
import { env } from "@utils";

test.describe("Negatvie scenarios - authentication with user using wrong credentials", () => {
  incorrectUser("should show error for incorrect username", async ({ loginPage }) => {
    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect
      .soft(loginPage.errorMessage)
      .toHaveText(LoginPageErrorMessages.InvalidCreds);
  });

  incorrectPassword("should show error for incorrect password", async ({ loginPage }) => {
    await expect.soft(loginPage.errorButton).toBeVisible();
    await expect
      .soft(loginPage.errorMessage)
      .toHaveText(LoginPageErrorMessages.InvalidCreds);
  });
});
