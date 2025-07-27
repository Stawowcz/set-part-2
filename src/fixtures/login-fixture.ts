// src/fixtures/login-page.fixture.ts
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

// Rozszerzony `test` z fixture'ami `user` i `loginPage`
export const test = baseTest.extend<{
  user: UserCredentials;
  loginPage: LoginPage;
}>({
  // 1) dane użytkownika, do nadpisania przez test.use()
  user: async ({}, use) => {
    await use({
      username: env.SAUCE_DEMO_STANDARD_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },

  // 2) fixture `loginPage` wykonuje logowanie
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

// Eksport `expect` powiązany z rozszerzonym `test`
export const expect = baseExpect;
