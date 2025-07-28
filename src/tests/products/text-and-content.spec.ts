import { test, expect, standardUser, visualUser } from "@fixtures";
import { suspiciousPatterns, forbiddenCssClasses, env } from "@utils";
import { ProductsPageTexts } from "@typings/products";

standardUser.describe(
  "Products - content and style checks - standard user",
  () => {
    standardUser.beforeEach(async ({ page, loginPage: _, productsPage }) => {
      await expect.soft(page).toHaveURL(/.*inventory/);
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    });

    standardUser(
      "should not contain suspicious patterns in product names or descriptions --> BUG: found in some entries",
      async ({ productsPage }) => {
        const names = await productsPage.getAllProductTitles.allTextContents();
        const descriptions =
          await productsPage.getAllProductDescription.allTextContents();
        const errors: string[] = [];

        names.forEach((name) => {
          suspiciousPatterns.forEach((pattern) => {
            if (name.toLowerCase().includes(pattern.toLowerCase())) {
              errors.push(
                `Pattern "${pattern}" found in product name: ${name}`,
              );
            }
          });
        });

        descriptions.forEach((desc) => {
          suspiciousPatterns.forEach((pattern) => {
            if (desc.toLowerCase().includes(pattern.toLowerCase())) {
              errors.push(
                `Pattern "${pattern}" found in product description: ${desc}`,
              );
            }
          });
        });

        expect.soft(errors.length, errors.join("\n")).toBe(0);
      },
    );

    standardUser(
      "should align product names correctly",
      async ({ productsPage }) => {
        const nameElements = await productsPage.getAllProductTitles.all();
        const misalignedNames: string[] = [];

        for (const [index, el] of nameElements.entries()) {
          const classAttr = await el.getAttribute("class");
          if (classAttr) {
            for (const forbidden of forbiddenCssClasses) {
              if (classAttr.includes(forbidden)) {
                misalignedNames.push(
                  `Name ${index} contains forbidden class: ${forbidden}`,
                );
              }
            }
          }
        }

        expect.soft(misalignedNames.length, misalignedNames.join("\n")).toBe(0);
      },
    );

    standardUser(
      "should not apply forbidden classes to Add to Cart buttons",
      async ({ productsPage }) => {
        const addToCartbuttons =
          await productsPage.getAddToCartButtonByRole.all();
        const misaligned: string[] = [];

        for (const [index, button] of addToCartbuttons.entries()) {
          const classAttr = await button.getAttribute("class");
          if (classAttr) {
            for (const forbidden of forbiddenCssClasses) {
              if (classAttr.includes(forbidden)) {
                misaligned.push(
                  `Add to cart button ${index} contains forbidden class: ${forbidden}`,
                );
              }
            }
          }
        }

        expect.soft(misaligned.length, misaligned.join("\n")).toBe(0);
      },
    );
  },
);

visualUser.describe("Products - content and style checks - visual user", () => {
  visualUser.beforeEach(async ({ page, loginPage: _, productsPage }) => {
    await expect.soft(page).toHaveURL(/.*inventory/);
    await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
  });

  visualUser(
    "should not contain suspicious patterns in product names or descriptions --> BUG: found in some entries",
    async ({ productsPage }) => {
      const names = await productsPage.getAllProductTitles.allTextContents();
      const descriptions =
        await productsPage.getAllProductDescription.allTextContents();
      const errors: string[] = [];

      names.forEach((name) => {
        suspiciousPatterns.forEach((pattern) => {
          if (name.toLowerCase().includes(pattern.toLowerCase())) {
            errors.push(`Pattern "${pattern}" found in product name: ${name}`);
          }
        });
      });

      descriptions.forEach((desc) => {
        suspiciousPatterns.forEach((pattern) => {
          if (desc.toLowerCase().includes(pattern.toLowerCase())) {
            errors.push(
              `Pattern "${pattern}" found in product description: ${desc}`,
            );
          }
        });
      });

      expect.soft(errors.length, errors.join("\n")).toBe(0);
    },
  );

  visualUser(
    "should align product names correctly -->  BUG: some names are right-aligned",
    async ({ productsPage }) => {
      const nameElements = await productsPage.getAllProductTitles.all();
      const misalignedNames: string[] = [];

      for (const [index, el] of nameElements.entries()) {
        const classAttr = await el.getAttribute("class");
        if (classAttr) {
          for (const forbidden of forbiddenCssClasses) {
            if (classAttr.includes(forbidden)) {
              misalignedNames.push(
                `Name ${index} contains forbidden class: ${forbidden}`,
              );
            }
          }
        }
      }

      expect.soft(misalignedNames.length, misalignedNames.join("\n")).toBe(0);
    },
  );

  visualUser(
    "should not apply forbidden classes to Add to Cart buttons --> BUG: class btn_inventory_misaligned present",
    async ({ productsPage }) => {
      const addToCartbuttons =
        await productsPage.getAddToCartButtonByRole.all();
      const misaligned: string[] = [];

      for (const [index, button] of addToCartbuttons.entries()) {
        const classAttr = await button.getAttribute("class");
        if (classAttr) {
          for (const forbidden of forbiddenCssClasses) {
            if (classAttr.includes(forbidden)) {
              misaligned.push(
                `Add to cart button ${index} contains forbidden class: ${forbidden}`,
              );
            }
          }
        }
      }

      expect.soft(misaligned.length, misaligned.join("\n")).toBe(0);
    },
  );
});
