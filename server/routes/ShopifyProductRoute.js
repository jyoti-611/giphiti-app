const { Router } = require("express");
const ShopifyProductController = require("../controllers/ShopifyProductController");

const router = Router();

router.get("/readProducts/:shop", ShopifyProductController.readProducts);
router.post("/checkout", ShopifyProductController.checkoutWebhook);
router.get(
  "/readProductsById/:shop/:productId",
  ShopifyProductController.readProductsById
);
module.exports = router;
