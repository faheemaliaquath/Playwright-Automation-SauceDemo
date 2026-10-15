import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/homePage";
import { LoginPage } from "../pages/LoginPage";
import { loginData } from "../testData/loginData";

test.describe("Home Page", () => {

    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    // ─── Page Load & Structure ────────────────────────────────────────────────────

    test("TC_HOME_001: Homepage loads at the root URL", async ({ page }) => {
        await expect(page).toHaveURL("https://sauce-demo.myshopify.com/");
    });

    test("TC_HOME_002: Homepage has a non-empty page title", async ({ page }) => {
        const title = await page.title();
        expect(title.trim().length).toBeGreaterThan(0);
    });

    test("TC_HOME_003: Logo element is present in the header", async ({ page }) => {
        await expect(page.locator(homePage.headerLogo)).toBeVisible();
    });

    // ─── Navigation Links ─────────────────────────────────────────────────────────

    test("TC_HOME_004: Log In link is visible in navigation", async ({ page }) => {
        await expect(page.locator(homePage.loginLink).first()).toBeVisible();
    });

    test("TC_HOME_005: Sign Up / Register link is visible in navigation", async ({ page }) => {
        await expect(page.locator(homePage.registerLink).first()).toBeVisible();
    });

    test("TC_HOME_006: Clicking Log In link navigates to login page", async ({ page }) => {
        await homePage.clickLoginLink();
        await expect(page).toHaveURL(/account\/login/);
    });

    test("TC_HOME_007: Clicking Register link navigates to registration page", async ({ page }) => {
        await homePage.clickRegisterLink();
        await expect(page).toHaveURL(/account\/register/);
    });

    // ─── Cart ─────────────────────────────────────────────────────────────────────

    test("TC_HOME_008: Cart link is visible in header", async ({ page }) => {
        await expect(page.locator(homePage.cartLink).first()).toBeVisible();
    });

    test("TC_HOME_009: Clicking cart link in header interacts with cart", async ({ page }) => {
        await homePage.clickCartLink();
        const isCartOrDrawer = await page.evaluate(() => {
            const drawer = document.querySelector('#drawer');
            return window.location.pathname.includes('/cart') || (drawer !== null);
        });
        expect(isCartOrDrawer).toBe(true);
    });

    test("TC_HOME_010: Cart count shows (0) for an empty cart", async ({ page }) => {
        const count = await homePage.getCartCountText();
        expect(count).toContain("0");
    });

    // ─── Search ───────────────────────────────────────────────────────────────────

    test("TC_HOME_011: Search input field is visible in the header", async ({ page }) => {
        await expect(page.locator(homePage.searchInput)).toBeVisible();
    });

    test("TC_HOME_012: Submitting a search navigates to the search results page", async ({ page }) => {
        await homePage.typeSearch("jacket");
        await expect(page).toHaveURL(/search.*q=jacket/);
    });

    // ─── Products ─────────────────────────────────────────────────────────────────

    test("TC_HOME_013: Homepage displays at least one product", async ({ page }) => {
        const count = await homePage.getProductCount();
        expect(count).toBeGreaterThan(0);
    });

    test("TC_HOME_014: Clicking first product navigates to a product page", async ({ page }) => {
        await homePage.clickFirstProduct();
        await expect(page).toHaveURL(/\/products\//);
    });
});
