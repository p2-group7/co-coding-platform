import { LoginPage } from "tests/pages/login.page";
import { test, expect } from "../fixtures/base.fixtures";
import { login } from "@/lib/auth";

test.describe("authentication", () => {
  test("redirect to login page when not logged in", async ({ page }) => {
    // Go to the dashboard page
    await page.goto("http://localhost:3000/courses/1");

    // Wait for navigation to the login page
    await page.waitForURL("/login");

    // Check if user is not logged in
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });
  test("Login and logout", async ({ page, loginPage, user }) => {
    // Go to the login page and login
    await loginPage.goto();
    await loginPage.populateLoginForm(user.username, user.password);
    await loginPage.clickSubmit();

    // check if user is logged in
    await page.waitForURL("/");

    await page.locator("button", { hasText: "Menu" }).click({ timeout: 3000 });

    // wait for the sign out button to appear
    await page
      .getByRole("link", { name: "Sign Out" })
      .waitFor({ state: "visible" });

    await page.getByRole("link", { name: "Sign Out" }).click();

    // Verify redirection to login page
    await expect(page).toHaveURL("/signout");

    await expect(
      page.locator("text=You signed out. Go to login"),
    ).toBeVisible();

    await page.getByRole("link", { name: "login" }).click();

    await expect(page).toHaveURL("/login");
  });
  test("Login with invalid credentials", async ({ page, loginPage }) => {
    // Go to the login page
    await loginPage.goto();
    await loginPage.populateLoginForm("exampleuser", "invalidpassword");
    await loginPage.clickSubmit();

    // Check if user is not logged in
    await expect(page.locator("text=Wrong username or password")).toBeVisible();
  });
  test("Login with empty credentials", async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.clickSubmit();

    // Check that it is not possible to submit an empty form
    await expect(
      page.locator("text=username must be at least 2 characters"),
    ).toBeVisible();

    await expect(
      page.locator("text=password must be at least 5 characters"),
    ).toBeVisible();
  });
});
