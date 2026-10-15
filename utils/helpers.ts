import { Page, expect } from "@playwright/test";

export class Helpers {

    constructor(private page: Page) {}

    /**
     * Navigate to a given URL and wait for the page to load
     */
    async navigateTo(url: string) {
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
    }

    /**
     * Wait for a given number of milliseconds
     */
    async wait(ms: number) {
        await this.page.waitForTimeout(ms);
    }

    /**
     * Scroll to the bottom of the page
     */
    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    /**
     * Scroll to the top of the page
     */
    async scrollToTop() {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }

    /**
     * Clear and fill an input field
     */
    async clearAndFill(locator: string, value: string) {
        await this.page.locator(locator).clear();
        await this.page.locator(locator).fill(value);
    }

    /**
     * Assert that the current URL contains a given string
     */
    async assertUrlContains(urlFragment: string) {
        await expect(this.page).toHaveURL(new RegExp(urlFragment));
    }

    /**
     * Assert page title
     */
    async assertTitle(title: string) {
        await expect(this.page).toHaveTitle(title);
    }

    /**
     * Assert title contains substring
     */
    async assertTitleContains(titleFragment: string) {
        await expect(this.page).toHaveTitle(new RegExp(titleFragment));
    }

    /**
     * Wait for a selector to be visible
     */
    async waitForVisible(locator: string, timeout = 10000) {
        await this.page.locator(locator).waitFor({ state: "visible", timeout });
    }

    /**
     * Check if an element is visible on the page
     */
    async isVisible(locator: string): Promise<boolean> {
        try {
            return await this.page.locator(locator).isVisible();
        } catch {
            return false;
        }
    }

    /**
     * Get the text content of an element
     */
    async getText(locator: string): Promise<string> {
        return (await this.page.locator(locator).textContent()) || "";
    }

    /**
     * Take a screenshot with a name
     */
    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    }

    /**
     * Dismiss cookie consent banner if present
     */
    async dismissCookieBannerIfPresent() {
        const cookieSelectors = [
            'button:has-text("Accept")',
            'button:has-text("Accept All")',
            'button:has-text("OK")',
            'button:has-text("Got it")',
            '[aria-label="Accept cookies"]',
        ];

        for (const selector of cookieSelectors) {
            const btn = this.page.locator(selector).first();
            if (await btn.isVisible().catch(() => false)) {
                await btn.click();
                break;
            }
        }
    }

    /**
     * Get count of elements matching a locator
     */
    async getCount(locator: string): Promise<number> {
        return await this.page.locator(locator).count();
    }

    /**
     * Generate a random string for test data
     */
    generateRandomString(length: number = 8): string {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    }
}
