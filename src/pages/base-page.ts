import { Locator, Page } from "@playwright/test";

export type GotoOptions = {
  timeout?: number;
  waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
};

export type LocatorWaitOptions = {
  timeout?: number;
  state?: "attached" | "detached" | "visible" | "hidden";
};

export class BasePage {
  protected readonly page: Page;

  public constructor(page: Page) {
    this.page = page;
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
}
