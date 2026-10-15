import { Page } from "@playwright/test";

/**
 * ProductPage - Page Object for a Shopify Product Detail Page
 * URL: https://sauce-demo.myshopify.com/products/<handle>
 *
 * Verified locators against the live DOM.
 *
 * Product form:  form#product-form.quickAdd  action="/cart/add"
 * Add to Cart:   input#add[type="submit"][value="Add To Cart"]
 * Price:         span.product-price inside h2#product-price
 * Variant:       select#product-select (hidden, JS-driven)
 * Sold Out:      div.sold-out  (shown instead of add button)
 */
export class ProductPage {

    constructor(private page: Page) {}

    // ─── Locators ────────────────────────────────────────────────────────────────

    // Product title — shown as the page <title> or a heading in the product body
    // The store renders it via JS; the safest locator is the page h1 (logo) — product
    // name is instead displayed via JS above the form. Use img alt as fallback.
    productImage = 'img.product-image, #product-photo-container img, .product_image, img[id*="product"]';

    // Price
    productPriceSpan = 'span.product-price';
    productPriceContainer = 'h2#product-price';

    // Add to Cart form
    addToCartForm = 'form#product-form';
    addToCartButton = 'input#add[type="submit"]';

    // Sold out indicator (on product page it is button or input with 'Sold Out')
    soldOutDiv = 'button:has-text("Sold Out"), input[value*="Sold Out"], div.sold-out, [class*="sold-out"]';

    // Variant select (hidden, driven by OptionSelectors JS)
    variantSelect = 'select#product-select';

    // Quantity input — not present in the basic theme (quantity is always 1 by default)

    // Breadcrumb
    breadcrumb = 'div#breadcrumb';
    breadcrumbLinks = 'div#breadcrumb a';

    // ─── Methods ─────────────────────────────────────────────────────────────────

    async goto(handle: string) {
        await this.page.goto(`/products/${handle}`);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async getProductPrice(): Promise<string> {
        return (await this.page.locator(this.productPriceSpan).first().textContent()) || "";
    }

    async clickAddToCart() {
        await this.page.locator(this.addToCartButton).click();
    }

    /**
     * Add to cart and wait for Shopify /cart/add API response
     */
    async addToCart() {
        const addResponsePromise = this.page.waitForResponse(
            resp => resp.url().includes('/cart/add') && resp.status() === 200,
            { timeout: 10000 }
        ).catch(() => null);

        await this.clickAddToCart();
        await addResponsePromise;
        // Small buffer for frontend cart state update
        await this.page.waitForLoadState("domcontentloaded");
    }

    async isSoldOut(): Promise<boolean> {
        return this.page.locator(this.soldOutDiv).isVisible();
    }

    async isAddToCartVisible(): Promise<boolean> {
        return this.page.locator(this.addToCartButton).isVisible();
    }

    async getProductImageAlt(): Promise<string> {
        // Get the alt text of the product image as a proxy for product name
        const img = this.page.locator(this.productImage).first();
        return (await img.getAttribute("alt")) || "";
    }

    async getBreadcrumbLinks(): Promise<string[]> {
        const links = this.page.locator(this.breadcrumbLinks);
        const count = await links.count();
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = await links.nth(i).textContent();
            if (text?.trim()) texts.push(text.trim());
        }
        return texts;
    }
}
