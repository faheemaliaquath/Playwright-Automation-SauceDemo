import { Page } from "@playwright/test";

/**
 * CartPage - Page Object for the Shopify Cart Page
 * URL: https://sauce-demo.myshopify.com/cart
 *
 * Verified locators against the live DOM.
 *
 * Empty cart:   p containing "It appears that your cart is currently empty!"
 * Continue link: a[href="/collections/all"] inside that paragraph
 * Filled cart:
 *   - Heading:    h1:has-text("My Cart")
 *   - Line items: Each item has a remove link: a[href*="/cart/change?line="]
 *   - Title:      h3 a[href*="/products/"]
 *   - Total:      h2:has-text("Total")
 *   - Checkout:   input[name="checkout"], button:has-text("Check Out")
 */
export class CartPage {

    constructor(private page: Page) {}

    // ─── Locators ────────────────────────────────────────────────────────────────

    // Empty cart state
    emptyCartMessage = 'p:has-text("It appears that your cart is currently empty!")';
    continueShoppingLink = 'a:has-text("Continue Shopping")';

    // Cart items
    cartForm = '#main form[action="/cart"]';
    cartItemRemoveLinks = '#main a[href*="/cart/change?line="]';
    cartItemTitles = '#main h3 a[href*="/products/"]';
    cartItemQuantityInputs = '#main input[name*="updates"]';

    // Subtotal / total
    cartTotal = '#main h2:has-text("Total"), h2:has-text("Total"):visible';

    // Checkout button inside cart form
    cartCheckoutButton = '#main input[name="checkout"], #main button:has-text("Check Out"), input[name="checkout"]:visible';

    // ─── Methods ─────────────────────────────────────────────────────────────────

    async goto() {
        await this.page.goto("/cart");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async isCartEmpty(): Promise<boolean> {
        return this.page.locator(this.emptyCartMessage).isVisible();
    }

    async clickContinueShopping() {
        await this.page.locator(this.continueShoppingLink).first().click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async getItemCount(): Promise<number> {
        const isEmpty = await this.isCartEmpty();
        if (isEmpty) return 0;
        const removeCount = await this.page.locator(this.cartItemRemoveLinks).count();
        if (removeCount > 0) return removeCount;
        return await this.page.locator(this.cartItemTitles).count();
    }

    async getCartItemTitles(): Promise<string[]> {
        const items = this.page.locator(this.cartItemTitles);
        const count = await items.count();
        const titles: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = await items.nth(i).textContent();
            if (text?.trim()) titles.push(text.trim());
        }
        return titles;
    }

    async getItemPrice(index: number): Promise<string> {
        const total = await this.getSubtotal();
        return total;
    }

    async getSubtotal(): Promise<string> {
        const totalEl = this.page.locator(this.cartTotal).first();
        if (await totalEl.isVisible()) {
            return (await totalEl.textContent()) || "";
        }
        return "";
    }

    async updateItemQuantity(index: number, qty: number) {
        const input = this.page.locator(this.cartItemQuantityInputs).nth(index);
        await input.fill(String(qty));
        await input.press("Enter");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async clickCheckout() {
        await this.page.locator(this.cartCheckoutButton).first().click();
    }
}
