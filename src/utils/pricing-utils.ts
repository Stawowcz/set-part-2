
export class PricingUtils {
  private static readonly TAX_RATE = 0.0801;

  private static round2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  public static calculateTax(subtotal: number): number {
    return this.round2(subtotal * this.TAX_RATE);
  }

  public static calculateTotalWithTax(subtotal: number): number {
    const tax = this.calculateTax(subtotal);
    return this.round2(subtotal + tax);
  }
}

