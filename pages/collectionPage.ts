import { Page } from "@playwright/test";

/**
 * CollectionPage - Page Object for Shopify Collection / Product Listing Pages
 * URL: https://sauce-demo.myshopify.com/collections/all
 *
 * Uses classic Shopify theme locators verified against live DOM.
 *
 * Real products in this store:
 *  - flower-print-jeans (Black heels) £45.00
 *  - bronze-sandals £39.99
 *  - brown-shades £20.00 (SOLD OUT)
 *  - grey-jacket £55.00
 *  - noir-jacket £60.00
 *  - striped-top £50.00
 *  - white-sandals £25.00
 */
export class CollectionPage {

    constructor(private page: Page) {}

    // ─── Locators ────────────────────────────────────────────────────────────────

    // Breadcrumb / page title
    breadcrumbActive = '#breadcrumb a.active';

    // Product links in the grid — each is an <a> tag with class "animated fadeInUpBig"
    productLinks = 'section.product-grid a.animated';
    // Sold-out indicator inside a product link
    soldOutBadge = 'div.sold-out';
    // Product image within a link
    productImages = 'section.product-grid a.animated img.product';

    // Sidebar navigation menu (collections/categories)
    sidebarMenu = 'ul#main-menu';
    sidebarLinks = 'ul#main-menu a';

    // ─── Methods ─────────────────────────────────────────────────────────────────

    async goto() {
        await this.page.goto("/collections/all");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async gotoCollection(handle: string) {
        await this.page.goto(`/collections/${handle}`);
        await this.page.waitForLoadState("domcontentloaded");
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

    async clickProductByHandle(handle: string) {
        await this.page.locator(`a[href*="/products/${handle}"]`).first().click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async getProductUrls(): Promise<string[]> {
        const links = this.page.locator(this.productLinks);
        const count = await links.count();
        const urls: string[] = [];
        for (let i = 0; i < count; i++) {
            const href = await links.nth(i).getAttribute("href");
            if (href) urls.push(href);
        }
        return urls;
    }

    async isSoldOut(index: number): Promise<boolean> {
        const productLink = this.page.locator(this.productLinks).nth(index);
        return productLink.locator(this.soldOutBadge).isVisible();
    }

    /**
     * Returns the index of the first product that is NOT sold out.
     * Returns -1 if all products are sold out.
     */
    async getFirstAvailableProductIndex(): Promise<number> {
        const count = await this.getProductCount();
        for (let i = 0; i < count; i++) {
            const soldOut = await this.isSoldOut(i);
            if (!soldOut) return i;
        }
        return -1;
    }

    async clickFirstAvailableProduct() {
        const idx = await this.getFirstAvailableProductIndex();
        if (idx === -1) throw new Error("No available (non-sold-out) products found");
        await this.clickProductByIndex(idx);
    }

    async getBreadcrumbText(): Promise<string> {
        return (await this.page.locator(this.breadcrumbActive).first().textContent()) || "";
    }
}
