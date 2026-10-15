import { Page } from "@playwright/test";

/**
 * RegisterPage - Page Object for Account Registration
 * URL: https://sauce-demo.myshopify.com/account/register
 *
 * Verified locators:
 *  - Form:      form#create_customer  action="/account"
 *  - First:     input#first_name  name="customer[first_name]"
 *  - Last:      input#last_name   name="customer[last_name]"
 *  - Email:     input#email       name="customer[email]"
 *  - Password:  input#password    name="customer[password]"
 *  - Submit:    input[type="submit"][value="Create"]
 */
export class RegisterPage {

    constructor(private page: Page) {}

    // ─── Locators ────────────────────────────────────────────────────────────────

    firstNameInput = 'input#first_name';
    lastNameInput = 'input#last_name';
    emailInput = 'input#email';
    passwordInput = 'input#password';
    createAccountButton = 'input[type="submit"][value="Create"]';

    loginLink = 'a#customer_login_link';
    pageHeading = 'h1.accounts-title';
    errorMessage = 'div#errors, .errors';

    // ─── Methods ─────────────────────────────────────────────────────────────────

    async goto() {
        await this.page.goto("/account/register");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async enterFirstName(firstName: string) {
        await this.page.locator(this.firstNameInput).fill(firstName);
    }

    async enterLastName(lastName: string) {
        await this.page.locator(this.lastNameInput).fill(lastName);
    }

    async enterEmail(email: string) {
        await this.page.locator(this.emailInput).fill(email);
    }

    async enterPassword(password: string) {
        await this.page.locator(this.passwordInput).fill(password);
    }

    async clickCreateAccount() {
        await this.page.locator(this.createAccountButton).click();
    }

    async getPageHeading(): Promise<string> {
        return (await this.page.locator(this.pageHeading).textContent()) || "";
    }

    async isErrorVisible(): Promise<boolean> {
        return this.page.locator(this.errorMessage).isVisible();
    }
}
