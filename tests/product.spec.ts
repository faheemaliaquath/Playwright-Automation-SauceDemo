import { test, expect } from "@playwright/test";
import { CollectionPage } from "../pages/collectionPage";
import { ProductPage } from "../pages/productPage";
import { CartPage } from "../pages/cartPage";
import { productData } from "../testData/productData";

test.describe("Product Detail Page", () => {

    let productPage: ProductPage;

    // Navigate directly to a known available product before each test
    test.beforeEach(async ({ page }) => {
        productPage = new ProductPage(page);
        // Use a known available product: grey-jacket at £55.00
        await productPage.goto(productData.products.greyJacket.handle);
    });

    // ─── Page Load ────────────────────────────────────────────────────────────────

    test("TC_PROD_001: Product page URL contains /products/grey-jacket", async ({ page }) => {
        await expect(page).toHaveURL(/products\/grey-jacket/);
    });

    test("TC_PROD_002: Product page title contains the product name", async ({ page }) => {
        const title = await page.title();
        expect(title.toLowerCase()).toContain("jacket");
    });

    // ─── Price ───────────────────────────────────────────────────────────────────

    test("TC_PROD_003: Product price is displayed and contains currency symbol", async ({ page }) => {
        const price = await productPage.getProductPrice();
        expect(price).toContain("£");
        expect(price).toContain("55");
    });

    // ─── Add to Cart ─────────────────────────────────────────────────────────────

    test("TC_PROD_004: Add To Cart button is visible and enabled", async ({ page }) => {
        await expect(page.locator(productPage.addToCartButton)).toBeVisible();
        await expect(page.locator(productPage.addToCartButton)).toBeEnabled();
    });

    test("TC_PROD_005: Add To Cart button value says Add To Cart", async ({ page }) => {
        const btn = page.locator(productPage.addToCartButton);
        const value = await btn.getAttribute("value");
        expect(value?.toLowerCase()).toContain("add to cart");
    });

    test("TC_PROD_006: Clicking Add To Cart updates the cart count in the header", async ({ page }) => {
        // Cart count is (0) before adding
        const countBefore = page.locator('span#cart-target-desktop');
        await expect(countBefore).toContainText("0");

        await productPage.addToCart();

        // Cart count should now show (1)
        await expect(page.locator('span#cart-target-desktop')).not.toContainText("(0)", { timeout: 10000 });
    });

    test("TC_PROD_007: After adding to cart, the cart page shows the product", async ({ page }) => {
        await productPage.addToCart();

        const cartPage = new CartPage(page);
        await cartPage.goto();

        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBe(false);
        const count = await cartPage.getItemCount();
        expect(count).toBeGreaterThan(0);
    });

    // ─── Sold Out Product ─────────────────────────────────────────────────────────

    test("TC_PROD_008: Sold-out product shows Sold Out indicator instead of Add to Cart", async ({ page }) => {
        // Navigate to known sold-out product
        await productPage.goto(productData.products.brownShades.handle);
        const soldOut = await productPage.isSoldOut();
        expect(soldOut).toBe(true);
        // The submit button is disabled and its text indicates Sold Out
        const addBtn = page.locator(productPage.addToCartButton);
        await expect(addBtn).toBeDisabled();
        await expect(addBtn).toHaveValue(/sold out/i);
    });

    // ─── Another Available Product ────────────────────────────────────────────────

    test("TC_PROD_009: Bronze sandals product page loads correctly", async ({ page }) => {
        await productPage.goto(productData.products.bronzeSandals.handle);
        await expect(page).toHaveURL(/products\/bronze-sandals/);
        const price = await productPage.getProductPrice();
        expect(price).toContain("£");
    });

    // ─── Form Structure ───────────────────────────────────────────────────────────

    test("TC_PROD_010: Product form action is /cart/add", async ({ page }) => {
        const form = page.locator(productPage.addToCartForm);
        await expect(form).toBeVisible();
        const action = await form.getAttribute("action");
        expect(action).toContain("/cart/add");
    });

    // ─── Breadcrumb ──────────────────────────────────────────────────────────────

    test("TC_PROD_011: Breadcrumb is displayed on product page", async ({ page }) => {
        const breadcrumb = page.locator(productPage.breadcrumb);
        await expect(breadcrumb).toBeVisible();
    });

    test("TC_PROD_012: Breadcrumb contains links for navigation", async ({ page }) => {
        const links = await productPage.getBreadcrumbLinks();
        expect(links.length).toBeGreaterThan(0);
        const hasHomeOrProduct = links.some(l => l.toLowerCase().includes("home") || l.toLowerCase().includes("jacket"));
        expect(hasHomeOrProduct).toBe(true);
    });
});
