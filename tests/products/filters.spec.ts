import {
  standardUser,
  problemUser,
  errorUser,
  visualUser,
  performanceGlitchUser,
} from "@fixtures";
import { ProductsPageTexts } from "@typings/products";
import { expect } from "@fixtures";

standardUser.describe("Filters - different users", () => {
  standardUser.describe("Filters - standard user", () => {
    standardUser.beforeEach(async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    });

    standardUser("should sort A --> Z", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    standardUser("should sort Z --> A", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort().reverse());
    });

    standardUser("should sort price low --> high", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("lohi");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    standardUser("should sort price high --> low", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("hilo");
      const prices = (
        await productsPage.getAllProductPrices.allTextContents()
      ).map((p) => parseFloat(p.replace("$", "")));
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
    });
  });

  problemUser.describe("Filters - problem user", () => {
    problemUser.beforeEach(async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    });

    problemUser("should sort A --> Z", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    problemUser(
      "should sort Z --> A --> BUG: sorting order incorrect",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("za");
        const names = await productsPage.getAllProductTitles.allTextContents();
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(names).toEqual([...names].sort().reverse());
      },
    );

    problemUser(
      "should sort price low --> high --> BUG: sorting order incorrect",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("lohi");
        const prices = (
          await productsPage.getAllProductPrices.allTextContents()
        ).map((p) => parseFloat(p.replace("$", "")));
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
      },
    );

    problemUser(
      "should sort price high --> low --> BUG: sorting order incorrect",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("hilo");
        const prices = (
          await productsPage.getAllProductPrices.allTextContents()
        ).map((p) => parseFloat(p.replace("$", "")));
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
      },
    );
  });

  errorUser.describe("Filters - error user", () => {
    errorUser.beforeEach(async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    });

    errorUser("should sort A --> Z", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    errorUser(
      "should sort Z --> A --> BUG: sorting order incorrect",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("za");
        const names = await productsPage.getAllProductTitles.allTextContents();
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(names).toEqual([...names].sort().reverse());
      },
    );

    errorUser(
      "should sort price low --> high --> BUG: sorting order incorrect",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("lohi");
        const prices = (
          await productsPage.getAllProductPrices.allTextContents()
        ).map((p) => parseFloat(p.replace("$", "")));
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
      },
    );

    errorUser(
      "should sort price high --> low --> BUG: sorting order incorrect",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("hilo");
        const prices = (
          await productsPage.getAllProductPrices.allTextContents()
        ).map((p) => parseFloat(p.replace("$", "")));
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
      },
    );
  });

  visualUser.describe("Filters - visual user", () => {
    visualUser.beforeEach(async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    });

    visualUser("should sort A --> Z", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("az");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort());
    });

    visualUser("should sort Z --> A", async ({ productsPage }) => {
      const start = Date.now();
      await productsPage.sortDropdown.selectOption("za");
      const names = await productsPage.getAllProductTitles.allTextContents();
      const filterDuration = Date.now() - start;

      expect.soft(filterDuration).toBeLessThanOrEqual(1500);
      expect.soft(names).toEqual([...names].sort().reverse());
    });

    visualUser(
      "should sort price low --> high --> BUG: sorting order incorrect",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("lohi");
        const prices = (
          await productsPage.getAllProductPrices.allTextContents()
        ).map((p) => parseFloat(p.replace("$", "")));
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
      },
    );

    visualUser(
      "should sort price high --> low --> BUG: sorting order incorrect",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("hilo");
        const prices = (
          await productsPage.getAllProductPrices.allTextContents()
        ).map((p) => parseFloat(p.replace("$", "")));
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
      },
    );
  });

  performanceGlitchUser.describe("Filters - glitch user", () => {
    performanceGlitchUser.beforeEach(async ({ loginPage: _, productsPage }) => {
      await productsPage.expectUrlContains("inventory");
      await expect.soft(productsPage.title).toHaveText(ProductsPageTexts.Title);
    });

    performanceGlitchUser(
      "should sort items A --> Z --> BUG: sorting takes more than 1.5s",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("az");
        const names = await productsPage.getAllProductTitles.allTextContents();
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(names).toEqual([...names].sort());
      },
    );

    performanceGlitchUser(
      "should sort Z --> A  --> BUG: sorting takes more than 1.5s",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("za");
        const names = await productsPage.getAllProductTitles.allTextContents();
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(names).toEqual([...names].sort().reverse());
      },
    );

    performanceGlitchUser(
      "should sort price low --> high --> BUG: sorting takes more than 1.5s",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("lohi");
        const prices = (
          await productsPage.getAllProductPrices.allTextContents()
        ).map((p) => parseFloat(p.replace("$", "")));
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(prices).toEqual([...prices].sort((a, b) => a - b));
      },
    );

    performanceGlitchUser(
      "should sort price high --> low --> BUG: sorting takes more than 1.5s",
      async ({ productsPage }) => {
        const start = Date.now();
        await productsPage.sortDropdown.selectOption("hilo");
        const prices = (
          await productsPage.getAllProductPrices.allTextContents()
        ).map((p) => parseFloat(p.replace("$", "")));
        const filterDuration = Date.now() - start;

        expect.soft(filterDuration).toBeLessThanOrEqual(1500);
        expect.soft(prices).toEqual([...prices].sort((a, b) => b - a));
      },
    );
  });
});
