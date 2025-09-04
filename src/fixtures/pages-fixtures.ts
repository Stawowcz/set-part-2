import type { Page } from "@playwright/test";
import { ProductsPage } from "@pages";
import { CheckoutPage } from "@pages";
import { CartPage } from "@pages";
import { AboutPage } from "@pages";

export const aboutFixtures = {
  aboutPage: async (
    { page }: { page: Page },
    use: (aboutPage: AboutPage) => Promise<void>,
  ) => {
    await use(new AboutPage(page));
  },
};

export const cartFixtures = {
  cartPage: async (
    { page }: { page: Page },
    use: (cartPage: CartPage) => Promise<void>,
  ) => {
    await use(new CartPage(page));
  },
};

export const productsFixtures = {
  productsPage: async (
    { page }: { page: Page },
    use: (productsPage: ProductsPage) => Promise<void>,
  ) => {
    await use(new ProductsPage(page));
  },
};

export const checkoutFixtures = {
  checkoutPage: async (
    { page }: { page: Page },
    use: (checkoutPage: CheckoutPage) => Promise<void>,
  ) => {
    await use(new CheckoutPage(page));
  },
};
