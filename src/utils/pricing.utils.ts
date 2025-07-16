export class PricingUtils {
  private static readonly TAX_RATE = 0.0801;

  public static calculateTax(subtotal: number): number {
    return parseFloat((subtotal * this.TAX_RATE).toFixed(2));
  }

  public static calculateTotalWithTax(subtotal: number): number {
    const tax = this.calculateTax(subtotal);
    return parseFloat((subtotal + tax).toFixed(2));
  }
}
