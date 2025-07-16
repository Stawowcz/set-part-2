import { BasePage } from "./base.page";
import { ProductsCartIds } from "../types/productsPage.enums";

export class CartPage extends BasePage {
  public readonly continueShoppingButton =
    this.page.getByTestId("continue-shopping");
  public readonly cartItems = this.page.getByTestId("inventory-item");
  public readonly checkoutButton = this.page.getByTestId("checkout");
  public readonly header = this.page.getByTestId("title");
  public readonly itemQuantity = this.page.getByTestId("item-quantity");

  public async clickContinueShopping(): Promise<void> {
    await this.safeClick(this.continueShoppingButton);
  }

  public async getCartItemsCount(): Promise<number> {
    await this.cartItems.nth(0).waitFor({ state: "visible" });
    return this.cartItems.count();
  }

  public async clickCheckout(): Promise<void> {
    await this.safeClick(this.checkoutButton);
  }

  public async removeProductFromCart(productId: ProductsCartIds) {
    const btn = this.page.getByTestId(`remove-${productId}`);
    await this.safeClick(btn);
  }
}
