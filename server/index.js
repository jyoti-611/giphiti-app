const resolve = require("path");
const express = require("express");
require("dotenv").config();
const applyAuthMiddleware = require("./middleware/auth.js");
const verifyRequest = require("./middleware/verify-request");
const b = require("bcrypt");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const Shopify = require("./services/shopifyService");
const PORT = parseInt(process.env.PORT || "8082", 10);
const ShopifyProductRoute = require("./routes/ShopifyProductRoute");
const https = require("https");
const fs = require("fs");

// const db = require("./src/models/index");
// const models = require("./src/models/DBSchema");

var key = fs.readFileSync("./server/selfsigned.key");
var cert = fs.readFileSync("./server/selfsigned.crt");

const USE_ONLINE_TOKENS = false;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";
const ACTIVE_SHOPIFY_SHOPS = {};

var options = {
  key: key,
  cert: cert,
};

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

// try {
//   db.sequelize.sync();
// } catch (e) {
//   console.log(e);
// }

const app = express();

async function createServer(root = process.cwd(), isProd = false) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    // @ts-ignore
    // @ts-ignore
    webhookHandler: async (topic, shop, body) => {
      delete ACTIVE_SHOPIFY_SHOPS[shop];
    },
  });

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
  app.use(cors());
  app.use(bodyParser());

  applyAuthMiddleware(app);

  app.use(express.json());

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  app.use("/shopify_product", ShopifyProductRoute);

  app.get("/products-count", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  app.use("/*", (req, res, next) => {
    const { shop } = req.query;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.

    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?${new URLSearchParams(req.query).toString()}`);
    } else {
      next();
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());

    app.use(serveStatic("dist/client"));

    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  // const server = https.createServer(options, app);
  createServer().then(({ app }) => {
    // const server = https.createServer(options, app);
    app.listen(PORT);
  });
}
