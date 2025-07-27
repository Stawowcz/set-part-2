import { BasePage } from "@pages";

export class AboutPage extends BasePage {
  public readonly sauceLabHeader = this.page.locator(
    '//div[contains(@class,"MuiBox-root")]//h1[normalize-space(text())="Build apps users love with AI-driven insights"]',
  );
}
