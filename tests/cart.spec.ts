import { test, expect } from "@playwright/test";
import { CartPage } from "../pages/cartPage";
import { CollectionPage } from "../pages/collectionPage";
import { ProductPage } from "../pages/productPage";
import { productData } from "../testData/productData";

/**
 * Reusable helper: add a specific known product to the cart.
 * Uses grey-jacket which is always available.
 */
async function addGreyJacketToCart(page: any): Promise<void> {
    const productPage = new ProductPage(page);
    await productPage.goto(productData.products.greyJacket.handle);
    await productPage.addToCart();
    // Wait for cart count to update
    await expect(page.locator('span#cart-target-desktop')).not.toContainText("(0)", { timeout: 10000 });
}

test.describe("Cart Functionality", () => {

    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        cartPage = new CartPage(page);
    });

    // ─── Empty Cart ───────────────────────────────────────────────────────────────

    test("TC_CART_001: Cart page loads at /cart URL", async ({ page }) => {
        await cartPage.goto();
        await expect(page).toHaveURL(/\/cart/);
    });

    test("TC_CART_002: Empty cart shows the empty message", async ({ page }) => {
        await cartPage.goto();
        await expect(page.locator(cartPage.emptyCartMessage)).toBeVisible();
    });

    test("TC_CART_003: Empty cart shows Continue Shopping link to collections", async ({ page }) => {
        await cartPage.goto();
        await expect(page.locator(cartPage.continueShoppingLink)).toBeVisible();
    });

    test("TC_CART_004: Continue Shopping link navigates away from the cart", async ({ page }) => {
        await cartPage.goto();
        await cartPage.clickContinueShopping();
        await expect(page).toHaveURL(/collections\/all/);
    });

    // ─── Adding Items to Cart ─────────────────────────────────────────────────────

    test("TC_CART_005: Adding a product removes the empty cart message", async ({ page }) => {
        await addGreyJacketToCart(page);
        await cartPage.goto();
        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBe(false);
    });

    test("TC_CART_006: Cart item count is 1 after adding one product", async ({ page }) => {
        await addGreyJacketToCart(page);
        await cartPage.goto();
        const count = await cartPage.getItemCount();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test("TC_CART_007: Cart item shows the product title", async ({ page }) => {
        await addGreyJacketToCart(page);
        await cartPage.goto();
        const titles = await cartPage.getCartItemTitles();
        expect(titles.length).toBeGreaterThan(0);
        const hasJacket = titles.some(t => t.toLowerCase().includes("jacket"));
        expect(hasJacket).toBe(true);
    });

    test("TC_CART_008: Cart item shows a price containing a currency symbol", async ({ page }) => {
        await addGreyJacketToCart(page);
        await cartPage.goto();
        const price = await cartPage.getItemPrice(0);
        expect(price).toContain("£");
    });

    test("TC_CART_009: Cart subtotal is displayed and non-empty", async ({ page }) => {
        await addGreyJacketToCart(page);
        await cartPage.goto();
        const subtotal = await cartPage.getSubtotal();
        expect(subtotal.trim().length).toBeGreaterThan(0);
    });

    // ─── Adding Multiple Different Products ───────────────────────────────────────

    test("TC_CART_010: Adding two different products increases cart item count", async ({ page }) => {
        // Add grey-jacket
        const productPage = new ProductPage(page);
        await productPage.goto(productData.products.greyJacket.handle);
        await productPage.addToCart();
        await expect(page.locator('span#cart-target-desktop')).not.toContainText("(0)", { timeout: 10000 });

        // Add bronze-sandals
        await productPage.goto(productData.products.bronzeSandals.handle);
        await productPage.addToCart();

        await cartPage.goto();
        const count = await cartPage.getItemCount();
        expect(count).toBeGreaterThanOrEqual(2);
    });

    // ─── Checkout Button ──────────────────────────────────────────────────────────

    test("TC_CART_011: Checkout button is visible in cart when items are present", async ({ page }) => {
        await addGreyJacketToCart(page);
        await cartPage.goto();
        await expect(page.locator(cartPage.cartCheckoutButton)).toBeVisible();
    });

    test("TC_CART_012: Clicking Checkout button from cart navigates to Shopify checkout", async ({ page }) => {
        await addGreyJacketToCart(page);
        await cartPage.goto();
        await cartPage.clickCheckout();
        await expect(page).toHaveURL(/checkout/, { timeout: 20000 });
    });
});
