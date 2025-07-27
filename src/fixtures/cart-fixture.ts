import type { Page } from "@playwright/test";
import { CartPage } from "@pages";

export const cartFixtures = {
  cartPage: async (
    { page }: { page: Page },
    use: (cartPage: CartPage) => Promise<void>,
  ) => {
    await use(new CartPage(page));
  },
};
