import { Page } from "@playwright/test";

/**
 * HomePage - Page Object for the Sauce Demo Shopify Store Homepage
 * URL: https://sauce-demo.myshopify.com/
 *
 * This store uses a classic Shopify theme (not Dawn).
 * All locators are verified against the actual live DOM.
 */
export class HomePage {

    constructor(private page: Page) {}

    // ─── Locators ────────────────────────────────────────────────────────────────

    // Header
    headerLogo = 'h1#logo';
    searchInput = 'input#search-field';
    searchForm = 'form.search-form';

    // Cart in header
    cartLink = 'a.cart:visible, a.toggle-drawer.cart.desktop';
    cartCountDesktop = 'span#cart-target-desktop';
    cartCountMobile = 'span#cart-target-mobile';
    checkoutLink = 'a.checkout';

    // Navigation
    loginLink = 'a#customer_login_link';
    registerLink = 'a#customer_register_link';
    searchNavLink = 'nav a[href="/search"]';

    // Product grid on homepage
    productGrid = 'section.product-grid';
    productLinks = 'section.product-grid a.animated';
    productImages = 'section.product-grid a.animated img.product';

    // Footer
    footer = 'footer, div.footer, .copyright';

    // ─── Methods ─────────────────────────────────────────────────────────────────

    async goto() {
        await this.page.goto("/");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async clickCartLink() {
        await this.page.locator(this.cartLink).first().click();
    }

    async clickLoginLink() {
        await this.page.locator(this.loginLink).first().click();
    }

    async clickRegisterLink() {
        await this.page.locator(this.registerLink).first().click();
    }

    async getCartCountText(): Promise<string> {
        const countEl = this.page.locator(this.cartCountDesktop);
        return (await countEl.textContent()) || "(0)";
    }

    async getProductCount(): Promise<number> {
        return await this.page.locator(this.productLinks).count();
    }

    async clickFirstProduct() {
        await this.page.locator(this.productLinks).first().click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async clickProductByIndex(index: number) {
        await this.page.locator(this.productLinks).nth(index).click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async typeSearch(query: string) {
        await this.page.locator(this.searchInput).fill(query);
        await this.page.locator(this.searchInput).press("Enter");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async isSearchInputVisible(): Promise<boolean> {
        return this.page.locator(this.searchInput).isVisible();
    }
}
