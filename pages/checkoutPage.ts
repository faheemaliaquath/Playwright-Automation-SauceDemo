import { Page } from "@playwright/test";

/**
 * CheckoutPage - Page Object for the Shopify Checkout Pages
 * URL: https://sauce-demo.myshopify.com/checkouts/...
 *
 * Note: Shopify checkout flows through multiple steps:
 * 1. Contact / Email
 * 2. Shipping address & Shipping method
 * 3. Payment
 * 4. Order confirmation
 */
export class CheckoutPage {

    constructor(private page: Page) {}

    // ─── Locators — Contact Step ──────────────────────────────────────────────────

    emailInput = 'input[type="email"], [id="email"], input[name="email"], input[autocomplete="email"], input[placeholder*="Email"]';
    emailLabel = 'label[for="email"]';

    // ─── Locators — Shipping Address Step ────────────────────────────────────────

    firstNameInput = 'input[placeholder*="First name"], input[name*="firstName"], input[autocomplete="given-name"], [id="TextField0"]';
    lastNameInput = 'input[placeholder*="Last name"], input[name*="lastName"], input[autocomplete="family-name"], [id="TextField1"]';
    addressInput = 'input[placeholder*="Address"], input[name*="address1"], input[autocomplete="street-address"], [id="TextField2"]';
    apartmentInput = 'input[placeholder*="Apartment"], input[name*="address2"], input[autocomplete="address-line2"], [id="TextField3"]';
    cityInput = 'input[placeholder*="City"], input[name*="city"], input[autocomplete="home city"], [id="TextField4"]';
    countrySelect = 'select[name="countryCode"], select[name="country"], combobox[name*="country"]';
    stateSelect = 'select[name="zoneCode"], select[name="province"], combobox[name*="state"]';
    zipInput = 'input[placeholder*="Postal code"], input[placeholder*="PIN code"], input[name="postalCode"], [id="TextField5"]';
    phoneInput = 'input[placeholder*="Phone"], input[name="phone"], input[autocomplete="tel"]';

    // Shipping method step
    continueToShippingButton = 'button:has-text("Continue to shipping"), [id="continue_button"]:has-text("Continue to shipping")';
    shippingMethods = '.radio-wrapper, [class*="shipping-method"]';
    firstShippingMethod = '.radio-wrapper:first-child input[type="radio"], [class*="shipping-method"]:first-child input';
    continueToPaymentButton = 'button:has-text("Continue to payment"), button:has-text("Continue to Payment")';

    // ─── Locators — Payment Step ──────────────────────────────────────────────────

    // Note: Real payment iframe - we do NOT fill actual card details in tests
    cardNumberFrame = 'iframe[id*="number"], iframe[title*="Card number"]';
    cardExpiryFrame = 'iframe[id*="expiry"]';
    cardCvvFrame = 'iframe[id*="verification_value"]';

    // Billing address
    billingAddressSameAsShipping = '[id="billing_address_selector_same"]';
    billingAddressDifferent = '[id="billing_address_selector_different"]';

    // Pay button (final submit)
    payButton = 'button:has-text("Pay now"), button:has-text("Complete order"), button[data-trekkie-id*="complete_order"]';

    // ─── Locators — Order Summary ─────────────────────────────────────────────────

    orderSummaryToggle = 'button[aria-label*="summary"], [class*="order-summary-toggle"]';
    orderSummaryItems = '[class*="product-table"] tr, .product, [class*="order-summary"] .product, table tr';
    orderSummary = 'table:has-text("Subtotal"), [class*="order-summary"], [role="table"], table';
    orderTotalInSummary = '[class*="total-line--grand-total"] .total-line__price, [class*="payment-due__price"], strong:has-text("£")';

    // Breadcrumb steps
    stepBreadcrumbs = '.step, [class*="breadcrumb"]';
    cartStep = 'a:has-text("Cart")';
    informationStep = 'a:has-text("Information"), span:has-text("Information")';
    shippingStep = 'a:has-text("Shipping"), span:has-text("Shipping")';
    paymentStep = 'a:has-text("Payment"), span:has-text("Payment")';

    // Error messages
    errorBanner = '[id="error-for-email"], .field__message--error, [class*="notice--error"]';

    // ─── Locators — Order Confirmation ───────────────────────────────────────────

    confirmationHeading = 'h2:has-text("Thank you"), h1:has-text("Order confirmed"), [class*="thank-you"]';
    orderNumber = '[class*="order-number"], .os-header__heading strong, [class*="order-number"]';
    continueShoppingButton = 'a:has-text("Continue shopping")';

    // ─── Methods — Navigation ─────────────────────────────────────────────────────

    /**
     * Navigate to the Shopify checkout page
     */
    async goto() {
        await this.page.goto("/checkout");
    }

    // ─── Methods — Step 1: Contact / Email ────────────────────────────────────────

    /**
     * Enter the email address on the checkout contact step
     */
    async enterEmail(email: string) {
        const emailField = this.page.locator(this.emailInput);
        await emailField.fill(email);
    }

    // ─── Methods — Step 2: Shipping ───────────────────────────────────────────────

    /**
     * Fill the shipping address form
     */
    async fillShippingAddress(data: {
        firstName: string;
        lastName: string;
        address: string;
        apartment?: string;
        city: string;
        state?: string;
        zip: string;
        country?: string;
        phone?: string;
    }) {
        await this.page.locator(this.firstNameInput).fill(data.firstName);
        await this.page.locator(this.lastNameInput).fill(data.lastName);
        await this.page.locator(this.addressInput).fill(data.address);

        if (data.apartment) {
            const apt = this.page.locator(this.apartmentInput);
            if (await apt.isVisible()) await apt.fill(data.apartment);
        }

        await this.page.locator(this.cityInput).fill(data.city);

        if (data.country) {
            const countrySelect = this.page.locator(this.countrySelect);
            if (await countrySelect.isVisible()) {
                await countrySelect.selectOption({ label: data.country });
            }
        }

        if (data.state) {
            const stateSelect = this.page.locator(this.stateSelect);
            if (await stateSelect.isVisible()) {
                await stateSelect.selectOption({ label: data.state });
            }
        }

        await this.page.locator(this.zipInput).fill(data.zip);

        if (data.phone) {
            const phoneField = this.page.locator(this.phoneInput);
            if (await phoneField.isVisible()) await phoneField.fill(data.phone);
        }
    }

    /**
     * Click the "Continue to shipping" button
     */
    async clickContinueToShipping() {
        await this.page.locator(this.continueToShippingButton).click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    /**
     * Select the first available shipping method
     */
    async selectFirstShippingMethod() {
        const method = this.page.locator(this.firstShippingMethod);
        if (await method.isVisible()) {
            await method.check();
        }
    }

    /**
     * Click "Continue to payment" button
     */
    async clickContinueToPayment() {
        await this.page.locator(this.continueToPaymentButton).click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    /**
     * Get available shipping methods count
     */
    async getShippingMethodsCount(): Promise<number> {
        return await this.page.locator(this.shippingMethods).count();
    }

    // ─── Methods — Step 3: Payment ────────────────────────────────────────────────

    /**
     * Check if payment page is displayed
     * Note: We do NOT fill real payment details in tests
     */
    async isPaymentPageDisplayed(): Promise<boolean> {
        return this.page.locator(this.payButton).isVisible();
    }

    /**
     * Get the order total displayed during payment
     */
    async getOrderTotal(): Promise<string> {
        return (await this.page.locator(this.orderTotalInSummary).first().textContent()) || "";
    }

    // ─── Methods — Order Confirmation ─────────────────────────────────────────────

    /**
     * Check if the order confirmation page is displayed
     */
    async isOrderConfirmed(): Promise<boolean> {
        return this.page.locator(this.confirmationHeading).isVisible();
    }

    /**
     * Get the order number from confirmation page
     */
    async getOrderNumber(): Promise<string> {
        return (await this.page.locator(this.orderNumber).first().textContent()) || "";
    }

    // ─── Methods — Error Handling ─────────────────────────────────────────────────

    /**
     * Get error message if displayed
     */
    async getErrorMessage(): Promise<string> {
        try {
            return (await this.page.locator(this.errorBanner).first().textContent()) || "";
        } catch {
            return "";
        }
    }

    /**
     * Check if checkout is on expected step based on URL
     */
    async getCurrentStep(): Promise<string> {
        const url = this.page.url();
        if (url.includes("/checkouts/")) {
            if (url.includes("/information")) return "information";
            if (url.includes("/shipping")) return "shipping";
            if (url.includes("/payment")) return "payment";
            if (url.includes("/thank_you") || url.includes("/confirm")) return "confirmation";
            return "one-page-checkout";
        }
        return "checkout";
    }
}
