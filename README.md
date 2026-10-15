# Sauce Demo Shopify — Playwright + TypeScript Automation Framework

> **End-to-End test automation for [sauce-demo.myshopify.com](https://sauce-demo.myshopify.com/)**
> Built with Playwright, TypeScript, and the Page Object Model (POM) design pattern.

---

## 📁 Project Structure

```
sauce-demo-automation/
│
├── pages/                      # Page Object Model classes
│   ├── homePage.ts             # Storefront homepage POM
│   ├── collectionPage.ts       # Collection & product catalog POM
│   ├── productPage.ts          # Product detail page POM
│   ├── cartPage.ts             # Shopping cart page POM
│   ├── checkoutPage.ts         # Shopify One-Page Checkout POM
│   ├── searchPage.ts           # Product search & results POM
│   ├── loginPage.ts            # Customer login & recovery POM
│   ├── registerPage.ts         # Customer registration POM
│   └── accountPage.ts          # Account dashboard & access controls POM
│
├── tests/                      # Automated test suite (100 tests)
│   ├── home.spec.ts            # 14 tests (storefront branding, navigation, products)
│   ├── collection.spec.ts      # 10 tests (catalog grid, inventory, stock status)
│   ├── product.spec.ts         # 12 tests (product details, add-to-cart, pricing)
│   ├── search.spec.ts          # 12 tests (query matching, zero-results, persistence)
│   ├── cart.spec.ts            # 12 tests (empty state, multi-item, calculations)
│   ├── checkout.spec.ts        # 9 tests (secure checkout, one-page checkout, guest flow)
│   ├── login.spec.ts           # 16 tests (form elements, validation, auth boundary, logout)
│   ├── account.spec.ts         # 17 tests (access security, registration, dashboard)
│   └── navigation.spec.ts      # 8 tests (global links, header/footer, 404 handler)
│
├── testData/                   # Centralized test data fixtures
│   ├── testData.ts             # Base URL & route endpoints
│   ├── loginData.ts            # User credentials & validation sets
│   ├── productData.ts          # Live product catalog handles, prices & search terms
│   └── checkoutData.ts         # Shipping address & contact test fixtures
│
├── utils/
│   └── helpers.ts              # Reusable browser helpers & assertions
│
├── playwright.config.ts        # Playwright Test runner configuration
├── tsconfig.json               # TypeScript strict compiler options
├── package.json                # npm scripts & dependencies
├── TEST_CASES.md               # Detailed test case documentation (100 test cases)
└── README.md                   # Framework overview & execution guide
```

---

## 📊 Test Suite Coverage Overview

| Module | Test File | Test Count | Status | Description |
|---|---|---|---|---|
| **Home Page** | `tests/home.spec.ts` | 14 | ✅ Passed | Header branding, links, search input, cart icon, product grid |
| **Catalog / Collection** | `tests/collection.spec.ts` | 10 | ✅ Passed | Product inventory, stock badges, breadcrumb, detail navigation |
| **Product Detail** | `tests/product.spec.ts` | 12 | ✅ Passed | Dynamic price, Add-to-Cart, cart badge sync, sold-out disabled state |
| **Search Functionality** | `tests/search.spec.ts` | 12 | ✅ Passed | Full/partial queries, non-matching terms, special chars, keyword tag |
| **Shopping Cart** | `tests/cart.spec.ts` | 12 | ✅ Passed | Empty message, continue shopping, line items, totals, checkout CTA |
| **Checkout Flow** | `tests/checkout.spec.ts` | 9 | ✅ Passed | One-page checkout, guest checkout, address fields, order summary |
| **Customer Login** | `tests/login.spec.ts` | 16 | ✅ Passed | Form fields, password masking, recovery toggle, auth endpoint, logout |
| **Account & Security** | `tests/account.spec.ts` | 17 | ✅ Passed | Protected route redirect, registration form, address route security |
| **Navigation & Links** | `tests/navigation.spec.ts` | 8 | ✅ Passed | Logo home link, header nav, cart redirect, footer, 404 status |
| **TOTAL** | **9 spec files** | **100 tests** | **100% Passing** | **Full end-to-end site test coverage** |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ 
- **npm** v8+

### Installation
```bash
# Navigate to the workspace project
cd sauce-demo-automation

# Install dependencies
npm install

# Install Playwright browser binaries
npx playwright install chromium
```

---

## 🧪 Running Tests

### Run all 98 automated tests
```bash
npm test
```

### Run individual module suites
```bash
npm run test:home        # Homepage tests (14)
npm run test:collection  # Catalog & collection tests (10)
npm run test:product     # Product detail tests (12)
npm run test:search      # Search tests (12)
npm run test:cart        # Cart tests (12)
npm run test:checkout    # Checkout flow tests (9)
npm run test:login       # Login tests (14)
npm run test:account     # Account & registration tests (17)
npm run test:nav         # Navigation & global link tests (8)
```

### Run with browser visible (headed mode)
```bash
npm run test:headed
```

### Interactive UI Mode
```bash
npm run test:ui
```

### View HTML Test Execution Report
```bash
npm run report
```

---

## 🛡️ Architecture & Design Decisions

1. **Page Object Model (POM)**:
   All selectors and interaction logic are cleanly encapsulated inside dedicated Page classes under `pages/`. Tests only interact with Page Object methods, ensuring high maintainability and zero selector duplication.

2. **Accurate Live DOM Selectors**:
   Rather than assuming standard Shopify Dawn classes, all locators are tailored to the live theme on `sauce-demo.myshopify.com`:
   - Classic product cards (`section.product-grid a.animated`)
   - Submit buttons with accurate value and state matching (`input#add[value="Add To Cart"]`, disabled for sold out items)
   - Header minicart desktop vs mobile drawer distinction
   - Shopify One-Page Checkout DOM elements and regions

3. **Robust Synchronization & Explicit Playwright Waiting**:
   - Zero arbitrary `page.waitForTimeout()` sleeps
   - Leverages `waitForResponse()` for asynchronous cart additions (`/cart/add`)
   - Uses Playwright's auto-waiting assertions (`toBeVisible()`, `toHaveURL()`, `toHaveValue()`)

4. **Testing Boundaries (External Services)**:
   - **Payments**: Tests verify that checkout transitions cleanly to the payment step and stop at the payment boundary without submitting test card data.
   - **CAPTCHA**: The automated test suite respects Shopify's bot challenge boundary on `/account/login`, validating form configuration, action endpoints, field acceptance, and security redirects.
