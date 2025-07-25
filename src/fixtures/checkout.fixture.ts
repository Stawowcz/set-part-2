import { CheckoutPage } from '../pages/checkout.page';
export const checkoutFixtures = {
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
};
