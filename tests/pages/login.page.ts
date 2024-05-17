import type { Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("http://localhost:3000/login");
    await this.page.waitForURL("http://localhost:3000/login");
  }

  async populateLoginForm(username: string, password: string) {
    await this.page.fill("input[name='username']", username);

    await this.page.fill("input[name='password']", password);
  }

  async clickSubmit() {
    await this.page.click("button[type='submit']");
  }
}
