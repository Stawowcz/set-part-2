import { Locator, Page, expect } from "@playwright/test";
import { ProductNames } from "@typings/common";
import { GotoOptions, LocatorWaitOptions } from "@typings/framework";

export abstract class BasePage {
  protected readonly page: Page;
  public readonly title: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.title = this.page.getByTestId("title");
  }

  public async goto(
    url: string = "/",
    options: GotoOptions = { waitUntil: "load" },
  ): Promise<void> {
    await this.page.goto(url, options);
  }

  protected async safeClick(
    locator: Locator,
    options: LocatorWaitOptions = { state: "visible" },
  ): Promise<void> {
    await locator.waitFor(options);
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  protected async safeFill(
    locator: Locator,
    value: string,
    options: LocatorWaitOptions = { state: "visible" },
  ): Promise<void> {
    await locator.waitFor(options);
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
  }

  protected async safeClear(
    locator: Locator,
    options: LocatorWaitOptions = { state: "visible" },
  ): Promise<void> {
    await locator.waitFor(options);
    await locator.scrollIntoViewIfNeeded();
    await locator.clear();
  }

  public async getProductPriceByName(productName: string): Promise<number> {
    const productItem = this.page.getByTestId("inventory-item").filter({
      has: this.page
        .getByTestId("inventory-item-name")
        .filter({ hasText: productName }),
    });
    const priceLocator = productItem.getByTestId("inventory-item-price");
    await priceLocator.waitFor({ state: "visible", timeout: 5000 });
    const raw = await priceLocator.textContent();
    if (!raw) {
      throw new Error("Products price text is missing");
    }
    const price = parseFloat(raw?.replace("$", "").trim());
    return price;
  }

  public getProductNameLocatorByName(productName: ProductNames): Locator {
    return this.page
      .getByTestId("inventory-item-name")
      .filter({ hasText: productName });
  }

  public async clickProductByName(productName: ProductNames): Promise<void> {
    await this.safeClick(this.getProductNameLocatorByName(productName));
  }

  async goBack() {
    await this.page.goBack();
  }

  async goForward() {
    await this.page.goForward();
  }

  async reloadPage() {
    await this.page.reload();
  }

  async expectUrlContains(path: string) {
    await expect.soft(this.page).toHaveURL(new RegExp(`.*${path}`));
  }
}
