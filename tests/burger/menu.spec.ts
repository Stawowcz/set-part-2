import { standardUser, problemUser, errorUser } from "@fixtures";
import { expect } from "@fixtures";
import { ProductPageItemIds, ProductsPageTexts } from "@typings/products";
import { env } from "@utils";

standardUser.describe(
  "Navigation - burger menu scenarios for different users",
  () => {
    standardUser.describe("Burger menu scenarios - standard user", () => {
      standardUser.beforeEach(async ({ loginPage: _, productsPage }) => {
        await productsPage.expectUrlContains("inventory");
        await expect
          .soft(productsPage.title)
          .toHaveText(ProductsPageTexts.Title);
      });

      standardUser(
        "should navigate to Saucelabs in the same tab when clicking 'About'",
        async ({ page, productsPage, aboutPage }) => {
          await productsPage.openMenu();

          await expect.soft(productsPage.menuAboutLink).toBeVisible();

          await productsPage.clickAbout();
          await page.waitForLoadState();

          await productsPage.expectUrlContains("saucelabs.com");
          await expect.soft(aboutPage.sauceLabHeader).toBeVisible();
        },
      );

      standardUser(
        "should navigate to login page after clicking 'Logout'",
        async ({ productsPage }) => {
          await productsPage.openMenu();

          await expect.soft(productsPage.menuLogoutLink).toBeVisible();

          await productsPage.clickLogout();

          await productsPage.expectUrlContains(env.SAUCE_DEMO_BASEURL);
        },
      );

      standardUser("should close burger menu", async ({ productsPage }) => {
        await productsPage.openMenu();

        await expect.soft(productsPage.menuLogoutLink).toBeVisible();
        await expect(productsPage.burgerMenu).toHaveAttribute(
          "aria-hidden",
          "false",
        );

        await productsPage.clickBurgerMenuCLoseButton();

        await expect(productsPage.burgerMenu).toHaveAttribute(
          "aria-hidden",
          "true",
        );

        await expect.soft(productsPage.menuLogoutLink).not.toBeVisible();
      });
    });

    problemUser.describe("Burger menu scenarios - problem user", () => {
      problemUser.beforeEach(async ({ loginPage: _, productsPage }) => {
        await productsPage.expectUrlContains("inventory");
        await expect
          .soft(productsPage.title)
          .toHaveText(ProductsPageTexts.Title);
      });

      problemUser(
        "should navigate to Saucelabs in the same tab when clicking 'About' --> BUG: 404 page shown",
        async ({ page, productsPage, aboutPage }) => {
          await productsPage.openMenu();

          await expect.soft(productsPage.menuAboutLink).toBeVisible();

          await productsPage.clickAbout();
          await page.waitForLoadState();

          await productsPage.expectUrlContains("saucelabs.com");
          await expect.soft(aboutPage.sauceLabHeader).toBeVisible();
        },
      );

      problemUser(
        "should navigate to login page after clicking 'Logout'",
        async ({ productsPage }) => {
          await productsPage.openMenu();

          await expect.soft(productsPage.menuLogoutLink).toBeVisible();

          await productsPage.clickLogout();

          await productsPage.expectUrlContains(env.SAUCE_DEMO_BASEURL);
        },
      );

      problemUser("should close burger menu", async ({ productsPage }) => {
        await productsPage.openMenu();

        await expect.soft(productsPage.menuLogoutLink).toBeVisible();
        await expect(productsPage.burgerMenu).toHaveAttribute(
          "aria-hidden",
          "false",
        );

        await productsPage.clickBurgerMenuCLoseButton();

        await expect(productsPage.burgerMenu).toHaveAttribute(
          "aria-hidden",
          "true",
        );

        await expect.soft(productsPage.menuLogoutLink).not.toBeVisible();
      });
    });

    errorUser.describe("Burger menu scenarios - error user", () => {
      errorUser.beforeEach(async ({ loginPage: _, productsPage }) => {
        await productsPage.expectUrlContains("inventory");
        await expect
          .soft(productsPage.title)
          .toHaveText(ProductsPageTexts.Title);
      });

      errorUser(
        "should navigate to Saucelabs in the same tab when clicking 'About'",
        async ({ page, productsPage, aboutPage }) => {
          await productsPage.openMenu();

          await expect.soft(productsPage.menuAboutLink).toBeVisible();

          await productsPage.clickAbout();
          await page.waitForLoadState();

          await productsPage.expectUrlContains("saucelabs.com");
          await expect.soft(aboutPage.sauceLabHeader).toBeVisible();
        },
      );

      errorUser(
        "should navigate to login page after clicking 'Logout'",
        async ({ productsPage }) => {
          await productsPage.openMenu();

          await expect.soft(productsPage.menuLogoutLink).toBeVisible();

          await productsPage.clickLogout();

          await productsPage.expectUrlContains(env.SAUCE_DEMO_BASEURL);
        },
      );

      errorUser("should close burger menu", async ({ productsPage }) => {
        await productsPage.openMenu();

        await expect.soft(productsPage.menuLogoutLink).toBeVisible();
        await expect(productsPage.burgerMenu).toHaveAttribute(
          "aria-hidden",
          "false",
        );

        await productsPage.clickBurgerMenuCLoseButton();

        await expect(productsPage.burgerMenu).toHaveAttribute(
          "aria-hidden",
          "true",
        );

        await expect.soft(productsPage.menuLogoutLink).not.toBeVisible();
      });
    });

    standardUser.describe(
      "Reset app state via burger menu – standard user",
      () => {
        standardUser.beforeEach(async ({ loginPage: _, productsPage }) => {
          await productsPage.expectUrlContains("inventory");
          await expect
            .soft(productsPage.title)
            .toHaveText(ProductsPageTexts.Title);
        });

        standardUser(
          "should reset cart, filters and buttons --> BUG: reset does not affect the state",
          async ({ productsPage }) => {
            await productsPage.addProductToCart(ProductPageItemIds.Backpack);
            await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
            const badge = await productsPage.waitForCartBadge();

            await expect.soft(badge).toHaveText("2");

            await productsPage.sortDropdown.selectOption("za");
            const names =
              await productsPage.getAllProductTitles.allTextContents();

            expect.soft(names).toEqual([...names].sort().reverse());
            await expect.soft(productsPage.sortDropdown).toHaveValue("za");

            const removeBtnBp = productsPage.getRemoveFromCartButton(
              ProductPageItemIds.Backpack,
            );
            const removeBtnBl = productsPage.getRemoveFromCartButton(
              ProductPageItemIds.BikeLight,
            );
            const isRemoveVisibleBp = await removeBtnBp.isVisible();
            const isRemoveVisibleBl = await removeBtnBl.isVisible();

            expect.soft(isRemoveVisibleBp).toBe(true);
            expect.soft(isRemoveVisibleBl).toBe(true);

            await productsPage.openMenu();

            await expect.soft(productsPage.resetAppButton).toBeVisible();

            await productsPage.clickResetApp();

            await expect.soft(badge).not.toBeVisible();

            const addToCartBp = productsPage.getAddToCartButton(
              ProductPageItemIds.Backpack,
            );
            const addToCartBl = productsPage.getAddToCartButton(
              ProductPageItemIds.BikeLight,
            );
            const isAddToCartVisibleBp = await addToCartBp.isVisible();
            const isAddToCartVisibleBl = await addToCartBl.isVisible();

            expect.soft(isAddToCartVisibleBp).toBe(true);
            expect.soft(isAddToCartVisibleBl).toBe(true);
            expect.soft(isRemoveVisibleBp).toBe(false);
            expect.soft(isRemoveVisibleBl).toBe(false);
            await expect.soft(productsPage.sortDropdown).toHaveValue("az");
          },
        );
      },
    );

    problemUser.describe(
      "Reset app state via burger menu - problem user",
      () => {
        problemUser.beforeEach(async ({ loginPage: _, productsPage }) => {
          await productsPage.expectUrlContains("inventory");
          await expect
            .soft(productsPage.title)
            .toHaveText(ProductsPageTexts.Title);
        });

        problemUser(
          "sshould reset cart, filters and buttons --> BUG: reset does not affect the state",
          async ({ productsPage }) => {
            await productsPage.addProductToCart(ProductPageItemIds.Backpack);
            await productsPage.addProductToCart(ProductPageItemIds.BikeLight);
            const badge = await productsPage.waitForCartBadge();

            await expect.soft(badge).toHaveText("2");

            await productsPage.sortDropdown.selectOption("za");
            const names =
              await productsPage.getAllProductTitles.allTextContents();

            expect.soft(names).toEqual([...names].sort().reverse());
            await expect.soft(productsPage.sortDropdown).toHaveValue("za");

            const removeBtnBp = productsPage.getRemoveFromCartButton(
              ProductPageItemIds.Backpack,
            );
            const removeBtnBl = productsPage.getRemoveFromCartButton(
              ProductPageItemIds.BikeLight,
            );
            const isRemoveVisibleBp = await removeBtnBp.isVisible();
            const isRemoveVisibleBl = await removeBtnBl.isVisible();

            expect.soft(isRemoveVisibleBp).toBe(true);
            expect.soft(isRemoveVisibleBl).toBe(true);

            await productsPage.openMenu();

            await expect.soft(productsPage.resetAppButton).toBeVisible();

            await productsPage.clickResetApp();

            await expect.soft(badge).not.toBeVisible();

            const addToCartBp = productsPage.getAddToCartButton(
              ProductPageItemIds.Backpack,
            );
            const addToCartBl = productsPage.getAddToCartButton(
              ProductPageItemIds.BikeLight,
            );
            const isAddToCartVisibleBp = await addToCartBp.isVisible();
            const isAddToCartVisibleBl = await addToCartBl.isVisible();

            expect.soft(isAddToCartVisibleBp).toBe(true);
            expect.soft(isAddToCartVisibleBl).toBe(true);
            expect.soft(isRemoveVisibleBp).toBe(false);
            expect.soft(isRemoveVisibleBl).toBe(false);
            await expect.soft(productsPage.sortDropdown).toHaveValue("az");
          },
        );
      },
    );
  },
);
