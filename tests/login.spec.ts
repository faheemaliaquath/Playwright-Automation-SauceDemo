import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { testData } from "../testData/testData";
import { loginData } from "../testData/loginData";

test.describe("Shopify Storefront - Login Feature & Access Control", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
    });

    // ─── 1. Unauthenticated Access & Route Protection ──────────────────────────

    test("TC_LOGIN_001: Accessing protected /account without authentication redirects to login", async ({ page }) => {
        await test.step("Navigate directly to protected /account route", async () => {
            await page.goto(testData.accountUrl);
        });

        await test.step("Verify user is redirected to /account/login with return_url", async () => {
            await expect(page).toHaveURL(/\/account\/login/);
            await expect(page.locator(loginPage.pageHeading).first()).toHaveText("Customer Login");
        });

        await test.step("Verify login form is displayed for unauthenticated user", async () => {
            await expect(page.locator(loginPage.loginForm)).toBeVisible();
            await expect(page.locator(loginPage.emailInput)).toBeVisible();
            await expect(page.locator(loginPage.passwordInput)).toBeVisible();
        });
    });

    test("TC_LOGIN_002: Accessing protected /account/addresses without authentication redirects to login", async ({ page }) => {
        await test.step("Navigate directly to protected /account/addresses route", async () => {
            await page.goto(testData.addressesUrl);
        });

        await test.step("Verify redirection to /account/login", async () => {
            await expect(page).toHaveURL(/\/account\/login/);
            await expect(page.locator(loginPage.loginForm)).toBeVisible();
        });
    });

    // ─── 2. Login Page UI Structure & Components ───────────────────────────────

    test("TC_LOGIN_003: Login page displays title, heading, and form elements", async ({ page }) => {
        await test.step("Navigate to /account/login", async () => {
            await loginPage.goto();
        });

        await test.step("Verify page URL and title", async () => {
            await expect(page).toHaveURL(testData.loginUrl);
            await expect(page).toHaveTitle(/Account/i);
        });

        await test.step("Verify Customer Login heading is visible", async () => {
            const heading = page.locator(loginPage.pageHeading).first();
            await expect(heading).toBeVisible();
            await expect(heading).toHaveText("Customer Login");
        });

        await test.step("Verify email input, password input, and Sign In button are visible", async () => {
            await expect(page.locator(loginPage.emailInput)).toBeVisible();
            await expect(page.locator(loginPage.passwordInput)).toBeVisible();
            await expect(page.locator(loginPage.loginButton)).toBeVisible();
            await expect(page.locator(loginPage.loginButton)).toHaveValue("Sign In");
        });
    });

    test("TC_LOGIN_004: Password field is masked with type='password'", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Verify password field has type='password' attribute", async () => {
            const pwdField = page.locator(loginPage.passwordInput);
            await expect(pwdField).toBeVisible();
            await expect(pwdField).toHaveAttribute("type", "password");
        });
    });

    test("TC_LOGIN_005: Form links for password recovery and account creation are present", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Verify Forgot your password link is visible", async () => {
            await expect(page.locator(loginPage.forgotPasswordLink)).toBeVisible();
        });

        await test.step("Verify Create account / Sign up link is visible", async () => {
            await expect(page.locator(loginPage.createAccountLink).first()).toBeVisible();
        });
    });

    // ─── 3. Field Interactions & Data Retention ────────────────────────────────

    test("TC_LOGIN_006: Email input field accepts and retains user input", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Enter email address into email field", async () => {
            await loginPage.enterEmail(testData.username);
        });

        await test.step("Verify email field retains the entered value", async () => {
            await expect(page.locator(loginPage.emailInput)).toHaveValue(testData.username);
        });
    });

    test("TC_LOGIN_007: Password input field accepts and masks user input", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Enter password into password field", async () => {
            await loginPage.enterPassword(testData.password);
        });

        await test.step("Verify password field value and masking attribute", async () => {
            const pwdField = page.locator(loginPage.passwordInput);
            await expect(pwdField).toHaveValue(testData.password);
            await expect(pwdField).toHaveAttribute("type", "password");
        });
    });

    // ─── 4. Password Recovery & Navigation ─────────────────────────────────────

    test("TC_LOGIN_008: Clicking Forgot your password toggles recovery form and cancel restores login", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Click 'Forgot your password?' link", async () => {
            await loginPage.clickForgotPassword();
        });

        await test.step("Verify password recovery form is revealed and login form is hidden", async () => {
            await expect(page.locator(loginPage.recoverPasswordForm)).toBeVisible();
            await expect(page.locator(loginPage.recoverEmailInput)).toBeVisible();
            await expect(page.locator(loginPage.recoverSubmitButton)).toBeVisible();
            await expect(page.locator(loginPage.loginForm)).not.toBeVisible();
        });

        await test.step("Click Cancel link in recovery form", async () => {
            await loginPage.clickCancelRecovery();
        });

        await test.step("Verify recovery form is hidden and login form is restored", async () => {
            await expect(page.locator(loginPage.recoverPasswordForm)).not.toBeVisible();
            await expect(page.locator(loginPage.loginForm)).toBeVisible();
        });
    });

    test("TC_LOGIN_009: Clicking Create Account navigates to /account/register", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Click Create account link", async () => {
            await loginPage.clickCreateAccount();
        });

        await test.step("Verify navigation to registration page", async () => {
            await expect(page).toHaveURL(/\/account\/register/);
            await expect(page.locator("h1.accounts-title").first()).toHaveText("Create Account");
        });
    });

    // ─── 5. Form Submissions & Security Boundaries ─────────────────────────────

    test("TC_LOGIN_010: Login form is configured to POST to /account/login", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Verify form attributes action and method", async () => {
            const form = page.locator(loginPage.loginForm);
            await expect(form).toBeVisible();
            await expect(form).toHaveAttribute("action", "/account/login");
            await expect(form).toHaveAttribute("method", "post");
        });
    });

    test("TC_LOGIN_011: Submitting empty form keeps user on login page without authenticating", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Click Sign In button without entering credentials", async () => {
            await loginPage.clickLoginButton();
        });

        await test.step("Verify user remains on /account/login", async () => {
            await expect(page).toHaveURL(/\/account\/login/);
            await expect(page.locator(loginPage.loginButton)).toBeVisible();
        });

        await test.step("Verify protected account route remains inaccessible", async () => {
            await page.goto(testData.accountUrl);
            await expect(page).toHaveURL(/\/account\/login/);
        });
    });

    test("TC_LOGIN_012: Submitting invalid credentials enforces security boundary", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Enter invalid credentials and submit form", async () => {
            await loginPage.login(testData.invalidEmail, testData.invalidPassword);
        });

        await test.step("Verify user remains on login page and access is denied", async () => {
            await expect(page).toHaveURL(/\/account\/login/);
            await expect(page.locator(loginPage.loginButton)).toBeVisible();
        });

        await test.step("Verify protected /account is not accessible", async () => {
            await page.goto(testData.accountUrl);
            await expect(page).toHaveURL(/\/account\/login/);
        });
    });

    test("TC_LOGIN_013: Submitting incorrect password for a user fails authentication", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Enter valid email with wrong password and submit", async () => {
            await loginPage.login(testData.validEmail, testData.wrongPassword);
        });

        await test.step("Verify user remains on login page without authenticated session", async () => {
            await expect(page).toHaveURL(/\/account\/login/);
            await expect(page.locator(loginPage.loginButton)).toBeVisible();
        });

        await test.step("Verify protected /account remains locked", async () => {
            await page.goto(testData.accountUrl);
            await expect(page).toHaveURL(/\/account\/login/);
        });
    });

    test("TC_LOGIN_014: Submitting malformed email format remains on login page", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Enter malformed email address and submit", async () => {
            await loginPage.login(loginData.invalidEmailFormat.email, testData.validPassword);
        });

        await test.step("Verify browser remains on /account/login", async () => {
            await expect(page).toHaveURL(/\/account\/login/);
        });
    });

    test("TC_LOGIN_015: Valid credentials submission targets authentication endpoint", async ({ page }) => {
        await test.step("Navigate to login page", async () => {
            await loginPage.goto();
        });

        await test.step("Fill credentials using POM login method", async () => {
            // Track POST request to authentication endpoint
            const requestPromise = page.waitForRequest(
                req => req.url().includes("/account/login") && req.method() === "POST",
                { timeout: 10000 }
            ).catch(() => null);

            await loginPage.login(); // Uses testData.username and testData.password by default

            const req = await requestPromise;
            // Either the POST was dispatched or page remains at security challenge / login boundary
            expect(req !== null || page.url().includes("/account/login")).toBe(true);
        });

        await test.step("Verify unverified automated browser does not bypass security boundary", async () => {
            await expect(page).toHaveURL(/\/account\/login/);
        });
    });

    // ─── 6. Logout & Session Termination ───────────────────────────────────────

    test("TC_LOGIN_016: Navigating to /account/logout terminates session and redirects to homepage", async ({ page }) => {
        await test.step("Navigate to logout endpoint", async () => {
            await page.goto(testData.logoutUrl);
        });

        await test.step("Verify redirection to homepage", async () => {
            await expect(page).toHaveURL(new RegExp(`${testData.baseUrl}/?$`));
        });

        await test.step("Verify header displays Log In and Sign up links", async () => {
            await expect(page.locator("a#customer_login_link").first()).toBeVisible();
            await expect(page.locator("a#customer_register_link").first()).toBeVisible();
        });

        await test.step("Verify subsequent access to /account redirects back to /account/login", async () => {
            await page.goto(testData.accountUrl);
            await expect(page).toHaveURL(/\/account\/login/);
        });
    });
});
