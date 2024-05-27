import type { Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("http://localhost:3000/login");
    await this.page.waitForURL("http://localhost:3000/login");
    await this.page.waitForSelector("text=login");
    // sleep for 2 seconds to make sure the page is fully loaded
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  async populateLoginForm(username: string, password: string) {
    await this.page.fill("input[name='username']", username);

    await this.page.fill("input[name='password']", password);
  }

  async clickSubmit() {
    await this.page.click("button[type='submit']");
  }
}
