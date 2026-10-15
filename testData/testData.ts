export const testData = {
  baseUrl: process.env.BASE_URL || "https://sauce-demo.myshopify.com",

  // Credentials (read from environment variables with fallback demo credentials)
  username: process.env.SHOPIFY_USER_EMAIL || process.env.SHOPIFY_USERNAME || "ilovepumpkins999@gmail.com",
  password: process.env.SHOPIFY_USER_PASSWORD || process.env.SHOPIFY_PASSWORD || "Test@1234",
  validEmail: process.env.SHOPIFY_USER_EMAIL || process.env.SHOPIFY_USERNAME || "ilovepumpkins999@gmail.com",
  validPassword: process.env.SHOPIFY_USER_PASSWORD || process.env.SHOPIFY_PASSWORD || "Test@1234",

  // Invalid credentials for negative scenarios
  invalidEmail: process.env.SHOPIFY_INVALID_EMAIL || "invalid@test.com",
  invalidPassword: process.env.SHOPIFY_INVALID_PASSWORD || "WrongPassword123",
  wrongPassword: process.env.SHOPIFY_WRONG_PASSWORD || "IncorrectPassword!99",
  emptyEmail: "",
  emptyPassword: "",

  // Login page routes
  loginUrl: "https://sauce-demo.myshopify.com/account/login",
  accountUrl: "https://sauce-demo.myshopify.com/account",
  addressesUrl: "https://sauce-demo.myshopify.com/account/addresses",
  logoutUrl: "https://sauce-demo.myshopify.com/account/logout",
  registerUrl: "https://sauce-demo.myshopify.com/account/register",
  recoverUrl: "https://sauce-demo.myshopify.com/account/recover",

  // Store/Collection URLs
  collectionsUrl: "https://sauce-demo.myshopify.com/collections",
  allProductsUrl: "https://sauce-demo.myshopify.com/collections/all",
  cartUrl: "https://sauce-demo.myshopify.com/cart",
  searchUrl: "https://sauce-demo.myshopify.com/search",
};
