import { AboutPage } from '../pages/about.page';
export const aboutFixtures = {
  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
};
