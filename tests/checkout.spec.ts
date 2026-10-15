import { test, expect } from "@playwright/test";
import { CartPage } from "../pages/cartPage";
import { ProductPage } from "../pages/productPage";
import { CheckoutPage } from "../pages/checkoutPage";
import { checkoutData } from "../testData/checkoutData";
import { productData } from "../testData/productData";

/**
 * Reusable setup: add a product to cart and navigate to checkout.
 * Returns the CheckoutPage instance ready to use.
 */
async function setupCheckout(page: any): Promise<CheckoutPage> {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add a known available product
    await productPage.goto(productData.products.greyJacket.handle);
    await productPage.addToCart();

    // Navigate to cart and proceed to checkout
    await cartPage.goto();
    await expect(page.locator(cartPage.cartCheckoutButton).first()).toBeVisible();
    await cartPage.clickCheckout();

    // Wait for Shopify checkout page to load
    await page.waitForURL(/checkout/, { timeout: 20000 });

    return new CheckoutPage(page);
}

test.describe("Checkout Flow", () => {

    // ─── Reaching Checkout ────────────────────────────────────────────────────────

    test("TC_CHECKOUT_001: Cart checkout button navigates to Shopify checkout domain", async ({ page }) => {
        await setupCheckout(page);
        const url = page.url();
        expect(url).toMatch(/checkout/);
    });

    test("TC_CHECKOUT_002: Checkout URL is a Shopify-hosted checkout page", async ({ page }) => {
        await setupCheckout(page);
        const url = page.url();
        expect(url).toMatch(/shopify\.com\/checkouts|myshopify\.com\/checkouts|\.myshopify\.com\/\d+\/checkouts/);
    });

    // ─── Checkout Page Structure ──────────────────────────────────────────────────

    test("TC_CHECKOUT_003: Checkout page has an email/contact input field", async ({ page }) => {
        const checkoutPage = await setupCheckout(page);
        const emailInput = page.locator(checkoutPage.emailInput).first();
        await expect(emailInput).toBeVisible({ timeout: 15000 });
    });

    test("TC_CHECKOUT_004: Checkout page shows an order summary section", async ({ page }) => {
        const checkoutPage = await setupCheckout(page);
        const summarySection = page.locator(checkoutPage.orderSummary).first();
        await expect(summarySection).toBeVisible({ timeout: 15000 });
    });

    // ─── Contact / Information Step ───────────────────────────────────────────────

    test("TC_CHECKOUT_005: Can type an email address into the contact field", async ({ page }) => {
        const checkoutPage = await setupCheckout(page);
        const emailField = page.locator(checkoutPage.emailInput).first();
        await expect(emailField).toBeVisible({ timeout: 15000 });
        await emailField.fill(checkoutData.shippingAddress.email);
        await expect(emailField).toHaveValue(checkoutData.shippingAddress.email);
    });

    test("TC_CHECKOUT_006: Shipping address first name field is present", async ({ page }) => {
        const checkoutPage = await setupCheckout(page);
        const firstName = page.locator(checkoutPage.firstNameInput).first();
        await expect(firstName).toBeVisible({ timeout: 15000 });
    });

    // ─── Checkout Step Navigation ──────────────────────────────────────────────────

    test("TC_CHECKOUT_007: Checkout step is identified correctly", async ({ page }) => {
        const checkoutPage = await setupCheckout(page);
        const step = await checkoutPage.getCurrentStep();
        expect(["information", "shipping", "payment", "one-page-checkout", "checkout"]).toContain(step);
    });

    // ─── Guest Checkout ───────────────────────────────────────────────────────────

    test("TC_CHECKOUT_008: Checkout proceeds without requiring prior login", async ({ page }) => {
        await setupCheckout(page);
        const url = page.url();
        expect(url).not.toContain("/account/login");
        expect(url).toContain("checkout");
    });

    // ─── Payment Boundary ─────────────────────────────────────────────────────────

    /**
     * NOTE: We do NOT enter real payment card details.
     * The test verifies we can reach the payment section, then stops.
     * Real payment processing is out of scope for automation in a demo environment.
     */
    test("TC_CHECKOUT_009: Payment section is displayed on checkout", async ({ page }) => {
        await setupCheckout(page);
        const paymentHeading = page.locator('h2:has-text("Payment"), h2:has-text("Pay with"), region:has-text("Payment"), [id*="payment"]').first();
        await expect(paymentHeading).toBeVisible({ timeout: 15000 });
    });
});
