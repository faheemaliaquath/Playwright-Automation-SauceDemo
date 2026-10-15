import { Page } from "@playwright/test";
import { testData } from "../testData/testData";

/**
 * LoginPage - Page Object Model for Shopify Sauce Demo Store Login Page
 * URL: https://sauce-demo.myshopify.com/account/login
 *
 * Locators verified against the live DOM:
 * - Email field:       input#customer_email (name="customer[email]")
 * - Password field:    input#customer_password (name="customer[password]")
 * - Sign In button:    input[type="submit"][value="Sign In"] (class="button")
 * - Login form:        form#customer_login (action="/account/login", method="post")
 * - Forgot password:   a[onclick*="showRecoverPasswordForm"]
 * - Recover form:      div#recover-password (style="display:none" initially)
 * - Recover email:     input#recover-email (name="email")
 * - Recover submit:    div#recover-password input[type="submit"]
 * - Cancel recovery:   a[onclick*="hideRecoverPasswordForm"]
 * - Create account:    a#customer_register_link
 * - Page heading:      h1.accounts-title ("Customer Login")
 * - Error message:     div#errors, .errors, p.error
 */
export class LoginPage {
    constructor(private page: Page) {}

    // ─── Verified Locators ────────────────────────────────────────────────────────
    emailInput = 'input#customer_email';
    passwordInput = 'input#customer_password';
    loginButton = 'input[type="submit"][value="Sign In"]';

    loginForm = 'form#customer_login';
    forgotPasswordLink = 'a[onclick*="showRecoverPasswordForm"]';
    createAccountLink = 'a#customer_register_link';
    pageHeading = 'h1.accounts-title';

    // Password recovery elements
    recoverPasswordForm = 'div#recover-password';
    recoverHeading = 'div#recover-password h1.accounts-title';
    recoverEmailInput = 'input#recover-email';
    recoverSubmitButton = 'div#recover-password input[type="submit"]';
    cancelRecoveryLink = 'a[onclick*="hideRecoverPasswordForm"]';

    // Dynamic error notification container
    errorMessage = 'div#errors, .errors, p.error';

    // ─── Page Actions ────────────────────────────────────────────────────────────

    async goto(path: string = "/account/login") {
        await this.page.goto(path);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async enterEmail(email: string) {
        await this.page.locator(this.emailInput).fill(email);
    }

    async enterPassword(password: string) {
        await this.page.locator(this.passwordInput).fill(password);
    }

    async clickLoginButton() {
        await this.page.locator(this.loginButton).click();
    }

    /**
     * Performs login using provided credentials or defaults to testData.username and testData.password.
     * Adheres to the user's POM coding style.
     */
    async login(email: string = testData.username, password: string = testData.password) {
        await this.page.locator(this.emailInput).fill(email);
        await this.page.locator(this.passwordInput).fill(password);
        await this.page.locator(this.loginButton).click();
    }

    async clickForgotPassword() {
        await this.page.locator(this.forgotPasswordLink).click();
    }

    async clickCancelRecovery() {
        await this.page.locator(this.cancelRecoveryLink).click();
    }

    async clickCreateAccount() {
        await this.page.locator(this.createAccountLink).first().click();
    }

    async enterRecoverEmail(email: string) {
        await this.page.locator(this.recoverEmailInput).fill(email);
    }

    async clickRecoverSubmit() {
        await this.page.locator(this.recoverSubmitButton).click();
    }

    async getPageHeading(): Promise<string> {
        return (await this.page.locator(this.pageHeading).first().textContent()) || "";
    }

    async isErrorMessageVisible(): Promise<boolean> {
        return this.page.locator(this.errorMessage).isVisible();
    }

    async getErrorMessage(): Promise<string> {
        const el = this.page.locator(this.errorMessage);
        if (await el.isVisible()) {
            return (await el.textContent()) || "";
        }
        return "";
    }
}
