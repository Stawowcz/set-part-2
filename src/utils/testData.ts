import { faker } from "@faker-js/faker";
import type { CheckoutFormData } from "../types/userData";

export class CheckoutDataGenerator {
  public static generateUserData(): CheckoutFormData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode(),
    };
  }
}
