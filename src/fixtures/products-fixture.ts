import type { Page } from '@playwright/test';
import { ProductsPage } from "@pages";

export const productsFixtures = {
  productsPage: async (
    { page }: { page: Page },
    use: (productsPage: ProductsPage) => Promise<void>
  ) => {
    await use(new ProductsPage(page));
  },
};

