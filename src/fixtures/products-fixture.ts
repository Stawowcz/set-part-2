import { ProductsPage } from '../pages/product-page';
export const productsFixtures = {
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
};
