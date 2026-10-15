import { test, expect } from "@playwright/test";
import { AccountPage } from "../pages/accountPage";
import { RegisterPage } from "../pages/registerPage";
import { LoginPage } from "../pages/LoginPage";

test.describe("Account Functionality & Authentication Access Controls", () => {

    // ─── Unauthenticated Access & Security Enforcement ────────────────────────────

    test("TC_ACCT_001: Accessing /account without login redirects to login page", async ({ page }) => {
        const accountPage = new AccountPage(page);
        await accountPage.goto();
        await expect(page).toHaveURL(/account\/login/);
    });

    test("TC_ACCT_002: Accessing /account/addresses without login redirects to login page", async ({ page }) => {
        await page.goto("/account/addresses");
        await expect(page).toHaveURL(/account\/login/);
    });

    test("TC_ACCT_003: Login page heading is displayed upon redirection from protected account page", async ({ page }) => {
        await page.goto("/account");
        const loginPage = new LoginPage(page);
        const heading = page.locator(loginPage.pageHeading).first();
        await expect(heading).toBeVisible();
        await expect(heading).toHaveText("Customer Login");
    });

    test("TC_ACCT_004: Customer login link is present in header", async ({ page }) => {
        await page.goto("/");
        const loginLink = page.locator('a#customer_login_link').first();
        await expect(loginLink).toBeVisible();
    });

    test("TC_ACCT_005: Customer register link is present in header", async ({ page }) => {
        await page.goto("/");
        const registerLink = page.locator('a#customer_register_link').first();
        await expect(registerLink).toBeVisible();
    });

    test("TC_ACCT_006: Direct access to /account/login loads login form directly", async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await expect(page.locator(loginPage.emailInput)).toBeVisible();
        await expect(page.locator(loginPage.passwordInput)).toBeVisible();
    });

    test("TC_ACCT_007: Account page model isLoggedIn returns false for unauthenticated state", async ({ page }) => {
        const accountPage = new AccountPage(page);
        await accountPage.goto();
        const loggedIn = await accountPage.isLoggedIn();
        expect(loggedIn).toBe(false);
    });

    test("TC_ACCT_008: Account page model getOrderCount returns 0 when unauthenticated", async ({ page }) => {
        const accountPage = new AccountPage(page);
        await accountPage.goto();
        const orderCount = await accountPage.getOrderCount();
        expect(orderCount).toBe(0);
    });

    // ─── Registration Page Feature ────────────────────────────────────────────────

    test("TC_ACCT_009: Registration page loads at /account/register", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await expect(page).toHaveURL(/account\/register/);
    });

    test("TC_ACCT_010: Registration page heading displays Create Account", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await expect(page.locator(registerPage.pageHeading)).toHaveText("Create Account");
    });

    test("TC_ACCT_011: Registration form contains First Name input field", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await expect(page.locator(registerPage.firstNameInput)).toBeVisible();
    });

    test("TC_ACCT_012: Registration form contains Last Name input field", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await expect(page.locator(registerPage.lastNameInput)).toBeVisible();
    });

    test("TC_ACCT_013: Registration form contains Email Address input field", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await expect(page.locator(registerPage.emailInput)).toBeVisible();
    });

    test("TC_ACCT_014: Registration form contains Password input field with masked type", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        const pwd = page.locator(registerPage.passwordInput);
        await expect(pwd).toBeVisible();
        await expect(pwd).toHaveAttribute("type", "password");
    });

    test("TC_ACCT_015: Registration form displays Create submit button", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await expect(page.locator(registerPage.createAccountButton)).toBeVisible();
    });

    test("TC_ACCT_016: Registration form is configured with POST action to /account", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        const form = page.locator('form#create_customer');
        await expect(form).toBeVisible();
        const action = await form.getAttribute("action");
        const method = await form.getAttribute("method");
        expect(action).toContain("/account");
        expect(method?.toLowerCase()).toBe("post");
    });

    test("TC_ACCT_017: Registration page contains link to login page", async ({ page }) => {
        const registerPage = new RegisterPage(page);
        await registerPage.goto();
        await expect(page.locator(registerPage.loginLink).first()).toBeVisible();
    });
});
