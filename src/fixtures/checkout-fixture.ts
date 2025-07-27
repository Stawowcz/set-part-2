import type { Page } from "@playwright/test";
import { CheckoutPage } from "@pages";

export const checkoutFixtures = {
  checkoutPage: async (
    { page }: { page: Page },
    use: (checkoutPage: CheckoutPage) => Promise<void>,
  ) => {
    await use(new CheckoutPage(page));
  },
};
