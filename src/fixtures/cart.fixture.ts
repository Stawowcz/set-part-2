import { CartPage } from '../pages/cart.page';
export const cartFixtures = {
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
};
