import { expect } from "@fixtures";
import { incorrectUser, incorrectPassword } from "@fixtures";
import { LoginPageErrorMessages } from "@typings/auth";

incorrectUser.describe(
  "Negatvie scenarios - authentication with user using wrong credentials",
  () => {
    incorrectUser(
      "should show error for incorrect username @smoke @regression",
      async ({ loginPage }) => {
        await expect.soft(loginPage.errorButton).toBeVisible();
        await expect
          .soft(loginPage.errorMessage)
          .toHaveText(LoginPageErrorMessages.InvalidCreds);
      },
    );

    incorrectPassword(
      "should show error for incorrect password @smoke @regression",
      async ({ loginPage }) => {
        await expect.soft(loginPage.errorButton).toBeVisible();
        await expect
          .soft(loginPage.errorMessage)
          .toHaveText(LoginPageErrorMessages.InvalidCreds);
      },
    );
  },
);
