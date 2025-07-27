import { faker } from "@faker-js/faker";
import type { CheckoutFormData } from "@typings/checkout";

export class CheckoutDataGenerator {
  public static generateCheckoutFormData(): CheckoutFormData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode(),
    };
  }
}
