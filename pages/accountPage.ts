import { Page } from "@playwright/test";

/**
 * AccountPage - Page Object for the Shopify Customer Account Page
 * URL: https://sauce-demo.myshopify.com/account
 *
 * Requires login. Without authentication, redirects to /account/login.
 * The account page shows order history and a logout link.
 */
export class AccountPage {

    constructor(private page: Page) {}

    // ─── Locators ────────────────────────────────────────────────────────────────

    pageHeading = 'h1.accounts-title';

    // Logout — Shopify classic uses a form POST to /account/logout
    logoutLink = 'a[href="/account/logout"]';

    // Orders table (present if orders exist)
    ordersTable = 'table';
    orderRows = 'table tbody tr';
    orderLinks = 'table tbody tr td a';

    // No orders message
    noOrdersMessage = 'p:has-text("haven\'t placed"), p:has-text("no orders"), p:has-text("You haven")';

    // Addresses link
    viewAddressesLink = 'a[href="/account/addresses"]';

    // ─── Methods ─────────────────────────────────────────────────────────────────

    async goto() {
        await this.page.goto("/account");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async getPageHeading(): Promise<string> {
        return (await this.page.locator(this.pageHeading).first().textContent()) || "";
    }

    async isLoggedIn(): Promise<boolean> {
        const url = this.page.url();
        return url.includes("/account") && !url.includes("/login") && !url.includes("/register");
    }

    async logout() {
        await this.page.locator(this.logoutLink).click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async getOrderCount(): Promise<number> {
        const tableVisible = await this.page.locator(this.ordersTable).isVisible().catch(() => false);
        if (!tableVisible) return 0;
        return await this.page.locator(this.orderRows).count();
    }

    async clickFirstOrder() {
        await this.page.locator(this.orderLinks).first().click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async clickManageAddresses() {
        await this.page.locator(this.viewAddressesLink).click();
        await this.page.waitForLoadState("domcontentloaded");
    }
}
