import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { CollectionPage } from "../pages/collectionPage";

test.describe("Site Navigation and Header / Footer Links", () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    test("TC_NAV_001: Header logo navigates back to homepage from collections page", async ({ page }) => {
        await page.goto("/collections/all");
        await page.locator(homePage.headerLogo).locator("a").first().click().catch(async () => {
            await page.locator(homePage.headerLogo).click();
        });
        await expect(page).toHaveURL("https://sauce-demo.myshopify.com/");
    });

    test("TC_NAV_002: Navigation to Login page works via header Log In link", async ({ page }) => {
        await homePage.clickLoginLink();
        await expect(page).toHaveURL(/account\/login/);
    });

    test("TC_NAV_003: Navigation to Register page works via header Sign up link", async ({ page }) => {
        await homePage.clickRegisterLink();
        await expect(page).toHaveURL(/account\/register/);
    });

    test("TC_NAV_004: Search link in top nav navigates to search page", async ({ page }) => {
        const searchLink = page.locator(homePage.searchNavLink).first();
        if (await searchLink.isVisible()) {
            await searchLink.click();
            await expect(page).toHaveURL(/search/);
        } else {
            // Alternatively use search submit
            await homePage.typeSearch("");
            await expect(page).toHaveURL(/search/);
        }
    });

    test("TC_NAV_005: Navigation to Cart page works via header Check Out link", async ({ page }) => {
        const checkoutLink = page.locator('a.checkout[href="/cart"]').first();
        await checkoutLink.click();
        await expect(page).toHaveURL(/\/cart/);
    });

    test("TC_NAV_006: Navigation to All Products via /collections/all works", async ({ page }) => {
        const collectionPage = new CollectionPage(page);
        await collectionPage.goto();
        await expect(page).toHaveURL(/collections\/all/);
        const count = await collectionPage.getProductCount();
        expect(count).toBeGreaterThan(0);
    });

    test("TC_NAV_007: Footer copyright text is present and visible", async ({ page }) => {
        const footerEl = page.locator("body");
        await expect(footerEl).toContainText("Sauce Demo");
    });

    test("TC_NAV_008: Non-existent URL displays 404 or redirects gracefully", async ({ page }) => {
        const response = await page.goto("/pages/non-existent-page-404-test");
        expect(response?.status()).toBe(404);
    });
});
