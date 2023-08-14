const { Shopify, LATEST_API_VERSION } = require("@shopify/shopify-api");

Shopify.Context.initialize({
  // @ts-ignore
  API_KEY: process.env.SHOPIFY_API_KEY,
  // @ts-ignore
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  // @ts-ignore
  SCOPES: process.env.SCOPES.split(","),
  // @ts-ignore
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

module.exports = Shopify;