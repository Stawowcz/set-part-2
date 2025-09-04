
import { test as loginTest, expect } from "./login-fixture";
import { productsFixtures } from "./pages-fixtures";
import { aboutFixtures } from "./pages-fixtures";
import { cartFixtures } from "./pages-fixtures";
import { checkoutFixtures } from "./pages-fixtures";

import type { UserCredentials } from "./login-fixture";
import { env } from "@utils/env-utils";
import type { MyFixtures } from "@typings/fixtures";


export const test = loginTest.extend<MyFixtures>({
  ...productsFixtures,
  ...aboutFixtures,
  ...cartFixtures,
  ...checkoutFixtures,
});

export { expect };

export const standardUser = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_STANDARD_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },
});

export const lockedUser = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_LOCKED_OUT_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },
});

export const incorrectUser = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_INCORRECT_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },
});

export const incorrectPassword = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_STANDARD_USER,
      password: env.SAUCE_DEMO_INCORRECT_PASSWORD,
    });
  },
});

export const problemUser = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_PROBLEM_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },
});

export const performanceGlitchUser = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_PERFORMACE_GLITCH_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },
});

export const errorUser = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_ERROR_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },
});

export const visualUser = test.extend<{
  user: UserCredentials;
}>({
  user: async (
    {}: {},
    use: (user: UserCredentials) => Promise<void>,
  ): Promise<void> => {
    await use({
      username: env.SAUCE_DEMO_VISUAL_USER,
      password: env.SAUCE_DEMO_PASSWORD,
    });
  },
});
