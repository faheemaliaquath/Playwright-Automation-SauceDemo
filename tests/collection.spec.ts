import { test, expect } from "@playwright/test";
import { CollectionPage } from "../pages/collectionPage";
import { ProductPage } from "../pages/productPage";

test.describe("Collection / Product Listing Page", () => {

    let collectionPage: CollectionPage;

    test.beforeEach(async ({ page }) => {
        collectionPage = new CollectionPage(page);
        await collectionPage.goto();
    });

    // ─── Page Load ────────────────────────────────────────────────────────────────

    test("TC_COLL_001: Collections/all page loads at the correct URL", async ({ page }) => {
        await expect(page).toHaveURL(/collections\/all/);
    });

    test("TC_COLL_002: Collections page has a non-empty title", async ({ page }) => {
        const title = await page.title();
        expect(title.trim().length).toBeGreaterThan(0);
    });

    test("TC_COLL_003: Breadcrumb shows Products for the all-products collection", async ({ page }) => {
        const breadcrumb = await collectionPage.getBreadcrumbText();
        expect(breadcrumb.toLowerCase()).toContain("product");
    });

    // ─── Product Grid ─────────────────────────────────────────────────────────────

    test("TC_COLL_004: Collection page displays at least 5 products", async ({ page }) => {
        const count = await collectionPage.getProductCount();
        expect(count).toBeGreaterThanOrEqual(5);
    });

    test("TC_COLL_005: Product images are visible in the grid", async ({ page }) => {
        const firstImg = page.locator(collectionPage.productImages).first();
        await expect(firstImg).toBeVisible();
    });

    // ─── Product Navigation ───────────────────────────────────────────────────────

    test("TC_COLL_006: Clicking the first product navigates to a product detail page", async ({ page }) => {
        await collectionPage.clickFirstProduct();
        await expect(page).toHaveURL(/\/products\//);
    });

    test("TC_COLL_007: Clicking second product navigates to a product detail page", async ({ page }) => {
        const count = await collectionPage.getProductCount();
        if (count < 2) {
            test.skip();
            return;
        }
        await collectionPage.clickProductByIndex(1);
        await expect(page).toHaveURL(/\/products\//);
    });

    test("TC_COLL_008: Clicking a known product by handle navigates correctly", async ({ page }) => {
        await collectionPage.clickProductByHandle("grey-jacket");
        await expect(page).toHaveURL(/products\/grey-jacket/);
    });

    // ─── Available Products ───────────────────────────────────────────────────────

    test("TC_COLL_009: At least one product is not sold out", async ({ page }) => {
        const idx = await collectionPage.getFirstAvailableProductIndex();
        expect(idx).toBeGreaterThanOrEqual(0);
    });

    test("TC_COLL_010: Clicking first available (non-sold-out) product opens the product page", async ({ page }) => {
        await collectionPage.clickFirstAvailableProduct();
        await expect(page).toHaveURL(/\/products\//);
        const productPage = new ProductPage(page);
        await expect(page.locator(productPage.addToCartButton)).toBeVisible();
    });
});
