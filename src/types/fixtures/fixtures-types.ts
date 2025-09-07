import type { UserCredentials } from "@fixtures/login-fixture";
import type { LoginPage } from "@pages/login-page";
import type { ProductsPage } from "@pages/products-page";
import type { AboutPage } from "@pages/about-page";
import type { CartPage } from "@pages/cart-page";
import type { CheckoutPage } from "@pages/checkout-page";

export type MyFixtures = {
  user: UserCredentials;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  aboutPage: AboutPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};
