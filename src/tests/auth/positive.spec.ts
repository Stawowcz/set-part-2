import { standardUser, lockedUser, expect, test } from "@fixtures";
import { SharedTexts } from "@typings/common";
import { env } from "@utils";

test.describe("Positive scenarios – authentication with different users", () => {
  standardUser(
    "should log in - standard user",
    async ({ loginPage: _, productsPage, page }) => {
      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(SharedTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
      await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    },
  );

  lockedUser(
    "should log in – locked out user --> BUG: user is locked",
    async ({ loginPage: _, productsPage, page }) => {
      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect
        .soft(productsPage.primaryHeader)
        .toContainText(SharedTexts.PrimaryHeader);
      await expect.soft(productsPage.hamburgerMenu).toBeVisible();
      await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    },
  );

  test("should log in - glitch user --> BUG: login takes longer than 1.5s", async ({
    loginPage,
    productsPage,
  }) => {
    await loginPage.goto(env.SAUCE_DEMO_BASEURL);
    await loginPage.fillUserNameField(env.SAUCE_DEMO_PERFORMACE_GLITCH_USER);
    await loginPage.fillPasswordField(env.SAUCE_DEMO_PASSWORD);
    const start = Date.now();
    await loginPage.clickOnLoginButton();

    await expect
      .soft(productsPage.primaryHeader)
      .toContainText(SharedTexts.PrimaryHeader);
    await expect.soft(productsPage.hamburgerMenu).toBeVisible();
    await expect.soft(productsPage.shoppingCartLink).toBeVisible();
    const duration = Date.now() - start;
    expect.soft(duration).toBeLessThanOrEqual(1500);
  });
});
