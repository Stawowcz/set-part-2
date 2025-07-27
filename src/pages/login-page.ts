import { Locator } from "@playwright/test";
import { BasePage } from "@pages";

export class LoginPage extends BasePage {
  private readonly userNameField: Locator = this.page.getByTestId("username");
  private readonly passwordField: Locator = this.page.getByTestId("password");
  private readonly loginButton: Locator = this.page.getByTestId("login-button");
  public readonly errorButton: Locator = this.page.getByTestId("error-button");
  public readonly errorMessage: Locator = this.page.getByTestId("error");

  public async clickOnLoginButton(): Promise<void> {
    await this.safeClick(this.loginButton);
  }

  public async fillUserNameField(userName: string): Promise<void> {
    await this.safeFill(this.userNameField, userName);
  }

  public async fillPasswordField(password: string): Promise<void> {
    await this.safeFill(this.passwordField, password);
  }

  public async login(userName: string, password: string): Promise<void> {
    await this.goto(process.env.SAUCE_DEMO_BASEURL!);
    await this.fillUserNameField(userName);
    await this.fillPasswordField(password);
    await this.clickOnLoginButton();
  }
}
