import { BasePage } from "@pages";
import { ProductPageItemIds } from "@typings/products";

export class CartPage extends BasePage {
  private readonly continueShoppingButton =
    this.page.getByTestId("continue-shopping");
  private readonly cartItems = this.page.getByTestId("inventory-item");
  public readonly checkoutButton = this.page.getByTestId("checkout");


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

  public async removeProductFromCart(productId: ProductPageItemIds) {
    const btn = this.page.getByTestId(`remove-${productId}`);
    await this.safeClick(btn);
  }
}
