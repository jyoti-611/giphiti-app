const Util = require("../Utils");
const db = require("../src/models/index");
const util = new Util();
const axios = require("axios");
const BaseJoi = require("joi");
const Shopify = require("../services/shopifyService");

class ShopifyProductController {
  static async readProducts(req, res) {
    try {
      const gettoken = await db.sequelize.models.Session.findOne({
        raw: true,
        where: { ShopName: req.params.shop },
      });

      const client = new Shopify.Clients.Graphql(
        req.params.shop,
        gettoken.AccessToken
      );

      const products = await client.query({
        data: `
          {
            products(first: 142, query: "-product_type:dc_clone") {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
          `,
      });

      util.setSuccess(200, "loaded products successfully", products.body.data);
      return util.send(res);
    } catch (e) {
      console.log(e);
      util.setError(404, "Failed to proccess");
      return util.send(res);
    }
  }

  static async readProductsById(req, res) {
    try {
      const token = await db.sequelize.models.Session.findOne({
        where: { ShopName: req.params.shop },
      });
      const gettoken = await db.sequelize.models.Session.findOne({
        raw: true,
        where: { ShopName: req.params.shop },
      });
      let accessToken = gettoken.AccessToken;
      console.log("------------ ", accessToken);
      let axiosConfig = {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      };
      const result = await axios.get(
        `https://${req.params.shop}/admin/api/2022-07/products/${req.params.productId}.json`,
        axiosConfig
      );
      util.setSuccess(200, "loaded products successfully", result.data);
      return util.send(res);
    } catch (e) {
      util.setError(404, "Failed to proccess");
      return util.send(res);
    }
  }

  static async checkoutWebhook(req, res) {
    try {
      console.log("CALLED***********", req.body)
      util.setSuccess(200, "loaded products successfully", '');
      return util.send(res);
    } catch (e) {
      util.setError(404, "Failed to proccess");
      return util.send(res);
    }
  }
}

module.exports = ShopifyProductController;
