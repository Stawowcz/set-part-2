import {
  test as baseTest,
  type Page,
  expect as baseExpect,
} from "@playwright/test";
import { LoginPage } from "@pages/login-page";
import { env } from "@utils/env-utils";

export type UserCredentials = {
  username: string;
  password: string;
};

export const test = baseTest.extend<{
  user: UserCredentials;
  loginPage: LoginPage;
}>({
  user: async ({}, use) => {
    await use({
      username: env.SAUCE_DEMO_STANDARD_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },

  loginPage: async (
    { page, user }: { page: Page; user: UserCredentials },
    use: (loginPage: LoginPage) => Promise<void>,
  ) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await use(loginPage);
  },
});

export const expect = baseExpect;
