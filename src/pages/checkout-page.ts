import { Locator } from "@playwright/test";
import { BasePage } from "./base-page";
import { CheckoutFormData } from "@typings/checkout/checkout-types";

export class CheckoutPage extends BasePage {
  public readonly firstName = this.page.getByTestId("firstName");
  public readonly lastName = this.page.getByTestId("lastName");
  public readonly postalCode = this.page.getByTestId("postalCode");
  public readonly continueButton = this.page.getByTestId("continue");
  public readonly finishButton = this.page.getByTestId("finish");
  public readonly completeHeader = this.page.getByTestId("complete-header");
  public readonly checkoutButton = this.page.getByTestId("checkout");
  public readonly cancelButton = this.page.getByTestId("cancel");
  public readonly header = this.page.getByTestId("title");
  public readonly summarySubtotalLabel: Locator =
    this.page.getByTestId("subtotal-label");
  public readonly summaryTaxLabel = this.page.getByTestId("tax-label");
  public readonly summaryTotalLabel = this.page.getByTestId("total-label");
  public readonly itemQuantity = this.page.getByTestId("item-quantity");
  public readonly error = this.page.getByTestId("error");
  public async getOverviewItemsCount(): Promise<number> {
    return this.page.getByTestId("inventory-item").count();
  }

  public async fillFirstName(value: string): Promise<void> {
    await this.safeFill(this.firstName, value);
  }

  public async clearFirstName(): Promise<void> {
    await this.safeClear(this.firstName);
  }

  public async clearLastName(): Promise<void> {
    await this.safeClear(this.lastName);
  }

  public async clearPostal(): Promise<void> {
    await this.safeClear(this.postalCode);
  }

  public async fillLastName(value: string): Promise<void> {
    await this.safeFill(this.lastName, value);
  }

  public async fillPostalCode(value: string): Promise<void> {
    await this.safeFill(this.postalCode, value);
  }

  public async fillInfo(data: CheckoutFormData): Promise<void> {
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.fillPostalCode(data.postalCode);
  }

  public async clickContinue(): Promise<void> {
    await this.safeClick(this.continueButton);
  }

  public async clickFinish(): Promise<void> {
    await this.safeClick(this.finishButton);
  }

  public async clickCancel(): Promise<void> {
    await this.safeClick(this.cancelButton);
  }

  // These three methods: getSubtotalPrice, getTax, and getTotalPrice are very similar
  // and could technically be combined into a single reusable function in the base page.
  // However, keeping them separate may improve readability and clarity,
  // especially when debugging or maintaining the code.
  public async getSubtotalPrice(): Promise<number> {
    await this.summarySubtotalLabel.waitFor({ state: "visible" });
    const text = await this.summarySubtotalLabel.textContent();
    if (!text) {
      throw new Error("Subtotal price text is missing");
    }
    return parseFloat(text?.replace("Item total: $", "").trim());
  }

  public async getTax(): Promise<number> {
    await this.summaryTaxLabel.waitFor({ state: "visible" });
    const text = await this.summaryTaxLabel.textContent();
    if (!text) {
      throw new Error("Tax text is missing");
    }
    return parseFloat(text?.replace("Tax: $", "").trim());
  }

  public async getTotalPrice(): Promise<number> {
    await this.summaryTotalLabel.waitFor({ state: "visible" });
    const text = await this.summaryTotalLabel.textContent();
    if (!text) {
      throw new Error("Total price text is missing");
    }
    return parseFloat(text?.replace("Total: $", "").trim());
  }
}
