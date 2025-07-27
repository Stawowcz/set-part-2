import type { Page } from '@playwright/test';
import { LoginPage } from "@pages";

export const loginFixtures = {
  loginPage: async (
    { page }: { page: Page },
    use: (loginPage: LoginPage) => Promise<void>
  ) => {
    await use(new LoginPage(page));
  },
};

