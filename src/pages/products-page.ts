import { Locator } from "@playwright/test";
import { BasePage } from "@pages";
import { ProductPageItemIds } from "@typings/products";

export class ProductsPage extends BasePage {
  public readonly primaryHeader: Locator =
    this.page.getByTestId("primary-header");
  public readonly hamburgerMenu: Locator = this.page.getByTestId("open-menu");
  private readonly hamburgerMenuButton: Locator = this.page.locator(
    "#react-burger-menu-btn",
  );
  public readonly shoppingCartLink: Locator =
    this.page.getByTestId("shopping-cart-link");
  public readonly addToCardButton: Locator =
    this.page.getByTestId("add-to-cart");
  private readonly removeFromCardButton: Locator =
    this.page.getByTestId("remove");
  public readonly shopingCartContainer: Locator = this.page.locator(
    "#shopping_cart_container",
  );
  public getProductImageByAltText(altText: string): Locator {
    return this.page.locator(`img[alt="${altText}"]`);
  }
  public readonly resetAppButton: Locator =
    this.page.getByTestId("reset-sidebar-link");
  public readonly menuLogoutLink = this.page.getByTestId("logout-sidebar-link");
  public readonly menuAboutLink = this.page.getByTestId("about-sidebar-link");
  public readonly getCartBadge: Locator = this.page.getByTestId(
    "shopping-cart-badge",
  );
  public readonly sortDropdown: Locator = this.page.getByTestId(
    "product-sort-container",
  );
  private readonly backToProductsButton =
    this.page.getByTestId("back-to-products");
  public readonly getAllProductDescription: Locator = this.page.getByTestId(
    "inventory-item-desc",
  );
  public readonly getAllProductTitles: Locator = this.page.getByTestId(
    "inventory-item-name",
  );
  public readonly getAddToCartButtonByRole: Locator = this.page.getByRole(
    "button",
    { name: /add to cart/i },
  );
  public readonly getAllProductPrices: Locator = this.page.getByTestId(
    "inventory-item-price",
  );

  public readonly burgerMenuCloseButton: Locator = this.page.locator(
    "#react-burger-cross-btn",
  );

  public readonly burgerMenu: Locator = this.page.locator(".bm-menu-wrap");

  public getAddToCartButton(productId: ProductPageItemIds): Locator {
    return this.page.getByTestId(`add-to-cart-${productId}`);
  }

  public getRemoveFromCartButton(productId: ProductPageItemIds): Locator {
    return this.page.getByTestId(`remove-${productId}`);
  }

  public async clickOnCartBasket(): Promise<void> {
    await this.safeClick(this.shoppingCartLink);
  }

  public async waitForCartBadge(): Promise<Locator> {
    await this.getCartBadge.waitFor({ state: "visible" });
    await this.getCartBadge.scrollIntoViewIfNeeded();
    return this.getCartBadge;
  }

  public async addProductToCart(productId: ProductPageItemIds): Promise<void> {
    const btn = this.getAddToCartButton(productId);
    await this.safeClick(btn);
  }

  public async addToCartFromProjectDetails(): Promise<void> {
    await this.safeClick(this.addToCardButton);
  }

  public async removeFromProjectDetails(): Promise<void> {
    await this.safeClick(this.removeFromCardButton);
  }

  public async removeProductToCart(
    productId: ProductPageItemIds,
  ): Promise<void> {
    const btn = this.getRemoveFromCartButton(productId);
    await this.safeClick(btn);
  }

  public async openMenu(): Promise<void> {
    await this.safeClick(this.hamburgerMenuButton);
  }

  public async clickAbout(): Promise<void> {
    await this.safeClick(this.menuAboutLink);
  }

  public async clickLogout(): Promise<void> {
    await this.safeClick(this.menuLogoutLink);
  }

  public async clickResetApp(): Promise<void> {
    await this.safeClick(this.resetAppButton);
  }

  public async clickBackToProducts(): Promise<void> {
    await this.safeClick(this.backToProductsButton);
  }

  public async clickBurgerMenuCLoseButton(): Promise<void> {
    await this.safeClick(this.burgerMenuCloseButton);
  }
}
