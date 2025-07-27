import type { Page } from '@playwright/test';
import { AboutPage } from "@pages";

export const aboutFixtures = {
  aboutPage: async (
    { page }: { page: Page },
    use: (aboutPage: AboutPage) => Promise<void>
  ) => {
    await use(new AboutPage(page));
  },
};
