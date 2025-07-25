// src/fixtures/index.ts

import { test as baseTest } from '@playwright/test';
import { loginFixtures }    from './login.fixture';
import { productsFixtures } from './products.fixture';
import { aboutFixtures }    from './about.fixture';
import { cartFixtures }     from './cart.fixture';
import { checkoutFixtures } from './checkout.fixture';

import { LoginPage }     from '../pages/login.page';
import { ProductsPage }  from '../pages/product.page';   // <- tutaj
import { AboutPage }     from '../pages/about.page';
import { CartPage }      from '../pages/cart.page';
import { CheckoutPage }  from '../pages/checkout.page';

// <-- ręcznie określasz, że loginPage to instancja LoginPage, a nie funkcja
type MyFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  aboutPage: AboutPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = baseTest.extend<MyFixtures>({
  ...loginFixtures,
  ...productsFixtures,
  ...aboutFixtures,
  ...cartFixtures,
  ...checkoutFixtures,
});

export const expect = test.expect;
