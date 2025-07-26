import { LoginPage } from '../pages/login-page';
export const loginFixtures = {
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
};
