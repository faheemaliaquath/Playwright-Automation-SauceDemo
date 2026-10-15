# Test Cases Documentation

This document outlines the complete test suite automated for **Sauce Demo Shopify Store** (`https://sauce-demo.myshopify.com/`).
The framework is built using **Playwright + TypeScript** following the **Page Object Model (POM)** architecture.

---

## 1. Test Suite Summary

| Module | Test File | Test Cases Count | Description |
|---|---|---|---|
| **Home Page** | `tests/home.spec.ts` | 14 | Verifies homepage loading, title, branding, header links, cart badge, search bar, product grid, and quick links. |
| **Collection / Catalog** | `tests/collection.spec.ts` | 10 | Verifies all-products collection view, breadcrumbs, grid rendering, product counts, stock status, and direct product navigation. |
| **Product Detail** | `tests/product.spec.ts` | 12 | Verifies product details, dynamic pricing, Add to Cart workflows, cart count updates, breadcrumb links, and sold-out product states. |
| **Search** | `tests/search.spec.ts` | 12 | Verifies search URL query parameters, positive search matching, negative/zero results, partial queries, special character handling, and input retention. |
| **Cart** | `tests/cart.spec.ts` | 12 | Verifies empty cart messaging, continue shopping redirect, adding single/multiple items, subtotal calculation, and checkout navigation. |
| **Checkout** | `tests/checkout.spec.ts` | 9 | Verifies navigation to Shopify secure checkout, guest checkout support, contact & shipping form fields, order summary visibility, and payment step boundary. |
| **Account** | `tests/account.spec.ts` | 17 | Verifies unauthenticated redirects, authenticated account dashboard access, addresses management, order history section, registration form, and logout. |
| **Login** | `tests/login.spec.ts` | 16 | Verifies unauthenticated route protection, login UI elements, field interactions, recovery toggle, registration link, empty submission, invalid credentials, incorrect password, malformed email, authentication boundary, and logout session termination. |
| **Navigation & Links** | `tests/navigation.spec.ts` | 8 | Verifies global navigation, header logo return to home, footer branding, and 404 response handling. |

**Total Automated Test Cases: 100**

---

## 2. Detailed Test Cases by Feature

### 2.1 Login Feature (`tests/login.spec.ts`)
- **TC_LOGIN_001**: Verify accessing protected `/account` without authentication redirects to login with `return_url`.
- **TC_LOGIN_002**: Verify accessing protected `/account/addresses` without authentication redirects to login.
- **TC_LOGIN_003**: Verify login page displays title, heading ("Customer Login"), and form elements (email, password, Sign In button).
- **TC_LOGIN_004**: Verify password input field is masked with `type="password"`.
- **TC_LOGIN_005**: Verify presence of "Forgot your password?" and "Create account" / "Sign up" links.
- **TC_LOGIN_006**: Verify email input field accepts and retains user input.
- **TC_LOGIN_007**: Verify password input field accepts input and remains masked.
- **TC_LOGIN_008**: Verify clicking "Forgot your password?" toggles recovery form into view and clicking "Cancel" restores login form.
- **TC_LOGIN_009**: Verify clicking "Create account" navigates to `/account/register`.
- **TC_LOGIN_010**: Verify login form is configured with POST action to `/account/login`.
- **TC_LOGIN_011**: Verify submitting empty form keeps user on login page without authenticating.
- **TC_LOGIN_012**: Verify submitting invalid credentials enforces security boundary and remains on login page.
- **TC_LOGIN_013**: Verify submitting incorrect password fails authentication and protects account routes.
- **TC_LOGIN_014**: Verify submitting malformed email format remains on login page.
- **TC_LOGIN_015**: Verify valid credentials submission targets authentication endpoint and enforces security protection.
- **TC_LOGIN_016**: Verify navigating to `/account/logout` terminates session, redirects to homepage, and clears access.

### 2.2 Home Page Feature (`tests/home.spec.ts`)
- **TC_HOME_001**: Verify homepage loads at base URL (`https://sauce-demo.myshopify.com/`).
- **TC_HOME_002**: Verify homepage has a non-empty, meaningful `<title>`.
- **TC_HOME_003**: Verify logo is present in the header.
- **TC_HOME_004**: Verify "Log In" link is visible in top navigation.
- **TC_HOME_005**: Verify "Sign up" link is visible in top navigation.
- **TC_HOME_006**: Verify clicking "Log In" navigates to login page.
- **TC_HOME_007**: Verify clicking "Sign up" navigates to registration page.
- **TC_HOME_008**: Verify cart link is visible in header.
- **TC_HOME_009**: Verify clicking cart link navigates to `/cart`.
- **TC_HOME_010**: Verify cart counter displays `(0)` when empty.
- **TC_HOME_011**: Verify search input is present in the header.
- **TC_HOME_012**: Verify executing search navigates to `/search?q=...`.
- **TC_HOME_013**: Verify product grid displays products on homepage.
- **TC_HOME_014**: Verify clicking a product card opens product details.

### 2.3 Collection / Catalog Feature (`tests/collection.spec.ts`)
- **TC_COLL_001**: Verify `/collections/all` loads successfully.
- **TC_COLL_002**: Verify collection page has a valid title.
- **TC_COLL_003**: Verify breadcrumb displays active collection name ("Products").
- **TC_COLL_004**: Verify collection displays expected product inventory (>= 5 products).
- **TC_COLL_005**: Verify product image assets render inside grid items.
- **TC_COLL_006**: Verify clicking the first product opens the product detail page.
- **TC_COLL_007**: Verify clicking second product navigates to its corresponding product page.
- **TC_COLL_008**: Verify direct navigation to known product handle (`grey-jacket`).
- **TC_COLL_009**: Verify at least one product is available in stock.
- **TC_COLL_010**: Verify selecting first in-stock product reveals functional "Add to Cart" button.

### 2.4 Product Detail Feature (`tests/product.spec.ts`)
- **TC_PROD_001**: Verify product URL matches handle pattern (`/products/grey-jacket`).
- **TC_PROD_002**: Verify page title contains product name.
- **TC_PROD_003**: Verify product price is displayed with currency formatting (`£55.00`).
- **TC_PROD_004**: Verify "Add To Cart" button is visible and enabled for in-stock items.
- **TC_PROD_005**: Verify "Add To Cart" submit button text.
- **TC_PROD_006**: Verify clicking "Add To Cart" updates header cart counter.
- **TC_PROD_007**: Verify item added appears in cart view.
- **TC_PROD_008**: Verify sold-out product displays "Sold Out" badge and hides "Add to Cart".
- **TC_PROD_009**: Verify secondary product (`bronze-sandals`) detail page and pricing.
- **TC_PROD_010**: Verify product form submits to `/cart/add`.
- **TC_PROD_011**: Verify breadcrumb container is present on product page.
- **TC_PROD_012**: Verify breadcrumb link navigates back to products catalog.

### 2.5 Search Feature (`tests/search.spec.ts`)
- **TC_SEARCH_001**: Verify navigating to `/search?q=jacket` loads search results.
- **TC_SEARCH_002**: Verify search URL properly reflects query string.
- **TC_SEARCH_003**: Verify positive search query (`jacket`) yields relevant product items.
- **TC_SEARCH_004**: Verify secondary positive query (`sandals`) yields results.
- **TC_SEARCH_005**: Verify clicking search result item navigates to product detail page.
- **TC_SEARCH_006**: Verify non-matching query (`xyzabc123noitem`) returns 0 product items.
- **TC_SEARCH_007**: Verify search input field is visible on header.
- **TC_SEARCH_008**: Verify submitting form via Enter key navigates to search page.
- **TC_SEARCH_009**: Verify search query persists inside search input after search.
- **TC_SEARCH_010**: Verify search handles special characters (`&`) without error.
- **TC_SEARCH_011**: Verify partial keyword matching (`jack` matches `jacket`).
- **TC_SEARCH_012**: Verify submitting empty search query navigates to search view.

### 2.6 Cart Feature (`tests/cart.spec.ts`)
- **TC_CART_001**: Verify direct navigation to `/cart`.
- **TC_CART_002**: Verify empty cart message is displayed when cart has no items.
- **TC_CART_003**: Verify "Continue Shopping" link is present in empty cart state.
- **TC_CART_004**: Verify clicking "Continue Shopping" redirects to `/collections/all`.
- **TC_CART_005**: Verify empty cart message disappears once product is added.
- **TC_CART_006**: Verify cart item count is >= 1 after adding an item.
- **TC_CART_007**: Verify cart line item displays correct product title.
- **TC_CART_008**: Verify cart line item displays unit price with currency symbol.
- **TC_CART_009**: Verify cart subtotal is non-empty and formatted.
- **TC_CART_010**: Verify adding multiple distinct products increases item count in cart.
- **TC_CART_011**: Verify "Checkout" button is visible when items exist in cart.
- **TC_CART_012**: Verify clicking "Checkout" initiates navigation to Shopify checkout.

### 2.7 Checkout Feature (`tests/checkout.spec.ts`)
- **TC_CHECKOUT_001**: Verify checkout button navigates to secure checkout.
- **TC_CHECKOUT_002**: Verify checkout domain is on Shopify checkout endpoint.
- **TC_CHECKOUT_003**: Verify contact/email input field is rendered.
- **TC_CHECKOUT_004**: Verify order summary sidebar is rendered.
- **TC_CHECKOUT_005**: Verify contact email field accepts and retains user input.
- **TC_CHECKOUT_006**: Verify shipping address input fields are present.
- **TC_CHECKOUT_007**: Verify checkout stage identification (information, shipping, or payment).
- **TC_CHECKOUT_008**: Verify guest checkout is supported without mandatory prior login.
- **TC_CHECKOUT_009**: Verify completing contact information transitions toward shipping step (stops at payment boundary).

### 2.8 Account Feature (`tests/account.spec.ts`)
- **TC_ACCT_001**: Verify navigating to `/account` unauthenticated redirects to `/account/login`.
- **TC_ACCT_002**: Verify authenticated access to `/account` dashboard.
- **TC_ACCT_003**: Verify account dashboard title is visible.
- **TC_ACCT_004**: Verify "Log out" link is visible on account dashboard.
- **TC_ACCT_005**: Verify clicking "Log out" signs out user and leaves dashboard.
- **TC_ACCT_006**: Verify accessing `/account` after logout redirects back to login.
- **TC_ACCT_007**: Verify orders section is displayed on dashboard.
- **TC_ACCT_008**: Verify `/account/addresses` is accessible to authenticated users.
- **TC_ACCT_009**: Verify addresses page heading is displayed.
- **TC_ACCT_010**: Verify `/account/register` page loads.
- **TC_ACCT_011**: Verify registration page heading ("Create Account").
- **TC_ACCT_012**: Verify First Name input field exists.
- **TC_ACCT_013**: Verify Last Name input field exists.
- **TC_ACCT_014**: Verify Email input field exists.
- **TC_ACCT_015**: Verify Password input field exists.
- **TC_ACCT_016**: Verify Create Account submit button is visible.
- **TC_ACCT_017**: Verify Log In link is present on registration page.

### 2.9 Navigation Feature (`tests/navigation.spec.ts`)
- **TC_NAV_001**: Verify header logo redirects back to home.
- **TC_NAV_002**: Verify Log In header link navigates to login.
- **TC_NAV_003**: Verify Sign Up header link navigates to register.
- **TC_NAV_004**: Verify search link navigates to search page.
- **TC_NAV_005**: Verify header cart link navigates to cart.
- **TC_NAV_006**: Verify catalog navigation to `/collections/all`.
- **TC_NAV_007**: Verify footer branding and copyright.
- **TC_NAV_008**: Verify handling of invalid routes (404 status).

---

## 3. Execution Instructions

```bash
# Run all automated tests
npm test

# Run specific feature tests
npm run test:login
npm run test:home
npm run test:collection
npm run test:product
npm run test:search
npm run test:cart
npm run test:checkout
npm run test:account
npm run test:nav

# Run in headed mode
npm run test:headed

# View HTML test execution report
npm run report
```
