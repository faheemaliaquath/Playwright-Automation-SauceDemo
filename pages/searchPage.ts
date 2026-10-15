import { Page } from "@playwright/test";

/**
 * SearchPage - Page Object for the Shopify Search Functionality
 * URL: https://sauce-demo.myshopify.com/search?q=<query>&type=product
 *
 * Verified against real DOM. The store uses a classic theme.
 * Search form:  form.search-form  action="/search"  method="get"
 * Search input: input#search-field.search  name="q"
 * Type hidden:  input[name="type"][value="product"]
 */
export class SearchPage {

    constructor(private page: Page) {}

    // ─── Locators ────────────────────────────────────────────────────────────────

    // Header search (available on all pages)
    searchInput = 'input#search-field';
    searchForm = 'form.search-form';

    // Search results page product links
    productLinks = 'section.product-grid a.animated';
    soldOutBadge = 'div.sold-out';
    searchKeyword = 'div#keyword span';

    // No-results message
    noResultsMessage = 'p:has-text("No results"), p:has-text("no results"), p:has-text("0 results")';

    // ─── Methods ─────────────────────────────────────────────────────────────────

    /**
     * Navigate directly to search results URL
     */
    async gotoSearchResults(query: string) {
        await this.page.goto(`/search?q=${encodeURIComponent(query)}&type=product`);
        await this.page.waitForLoadState("domcontentloaded");
    }

    /**
     * Type into the header search input and submit
     */
    async search(query: string) {
        await this.page.locator(this.searchInput).fill(query);
        await this.page.locator(this.searchInput).press("Enter");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async getResultCount(): Promise<number> {
        return await this.page.locator(this.productLinks).count();
    }

    async isNoResultsMessageVisible(): Promise<boolean> {
        return this.page.locator(this.noResultsMessage).isVisible();
    }

    async clickFirstResult() {
        await this.page.locator(this.productLinks).first().click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async getSearchInputValue(): Promise<string> {
        return (await this.page.locator(this.searchInput).inputValue()) || "";
    }

    async getSearchKeyword(): Promise<string> {
        return (await this.page.locator(this.searchKeyword).first().textContent()) || "";
    }
}
