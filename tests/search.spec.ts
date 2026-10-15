import { test, expect } from "@playwright/test";
import { SearchPage } from "../pages/searchPage";
import { productData } from "../testData/productData";

test.describe("Search Functionality", () => {

    let searchPage: SearchPage;

    test.beforeEach(async ({ page }) => {
        searchPage = new SearchPage(page);
        await page.goto("/");
        await page.waitForLoadState("domcontentloaded");
    });

    // ─── URL Navigation to Search ─────────────────────────────────────────────────

    test("TC_SEARCH_001: Navigating directly to /search loads the search page", async ({ page }) => {
        await searchPage.gotoSearchResults("jacket");
        await expect(page).toHaveURL(/search.*q=jacket/);
    });

    test("TC_SEARCH_002: Search URL contains the encoded query parameter", async ({ page }) => {
        await searchPage.gotoSearchResults("sandals");
        const url = page.url();
        expect(url).toContain("q=sandals");
    });

    // ─── Results with Matches ─────────────────────────────────────────────────────

    test("TC_SEARCH_003: Searching for jacket returns product results", async ({ page }) => {
        await searchPage.gotoSearchResults(productData.searchTerms.returnsResults);
        const count = await searchPage.getResultCount();
        expect(count).toBeGreaterThan(0);
    });

    test("TC_SEARCH_004: Searching for sandals returns product results", async ({ page }) => {
        await searchPage.gotoSearchResults(productData.searchTerms.returnsResultsAlt);
        const count = await searchPage.getResultCount();
        expect(count).toBeGreaterThan(0);
    });

    test("TC_SEARCH_005: Clicking a search result navigates to the product page", async ({ page }) => {
        await searchPage.gotoSearchResults(productData.searchTerms.returnsResults);
        const count = await searchPage.getResultCount();
        expect(count).toBeGreaterThan(0);
        await searchPage.clickFirstResult();
        await expect(page).toHaveURL(/\/products\//);
    });

    // ─── No Results ───────────────────────────────────────────────────────────────

    test("TC_SEARCH_006: Searching for a nonsense term returns zero results", async ({ page }) => {
        await searchPage.gotoSearchResults(productData.searchTerms.noResults);
        const count = await searchPage.getResultCount();
        expect(count).toBe(0);
    });

    // ─── Header Search Interaction ────────────────────────────────────────────────

    test("TC_SEARCH_007: Search input in the header is visible on homepage", async ({ page }) => {
        await expect(page.locator(searchPage.searchInput)).toBeVisible();
    });

    test("TC_SEARCH_008: Typing a search term and pressing Enter navigates to results", async ({ page }) => {
        await searchPage.search("jacket");
        await expect(page).toHaveURL(/search/);
    });

    test("TC_SEARCH_009: After header search, query is displayed in the search results keyword area", async ({ page }) => {
        await searchPage.search("sandals");
        const keyword = await searchPage.getSearchKeyword();
        expect(keyword.toLowerCase()).toContain("sandals");
    });

    // ─── Edge Cases ───────────────────────────────────────────────────────────────

    test("TC_SEARCH_010: Searching with special characters does not crash the page", async ({ page }) => {
        await searchPage.gotoSearchResults("jacket & sandals");
        // Page should load without error
        await expect(page).toHaveURL(/search/);
    });

    test("TC_SEARCH_011: Partial product name search returns results", async ({ page }) => {
        await searchPage.gotoSearchResults("jack"); // partial match for "jacket"
        const count = await searchPage.getResultCount();
        expect(count).toBeGreaterThan(0);
    });

    test("TC_SEARCH_012: Empty search query navigates to search page", async ({ page }) => {
        await searchPage.gotoSearchResults("");
        await expect(page).toHaveURL(/search/);
    });
});
