const Order = require("../models/Order");
const axios = require("axios");
const https = require("https");

const PRODUCT_SERVICE_URL = "https://nginx/products";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const authorizeOrderOwner = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.user.toString() === userId || userRole === "ADMIN") {
      req.order = order;
      return next();
    }

    if (userRole === "SELLER") {
      for (const item of order.items) {
        const response = await axios.post(
          `${PRODUCT_SERVICE_URL}/ownership-check`,
          { productId: item.product },
          {
            httpsAgent,
            headers: {
              "x-internal-secret": process.env.INTERNAL_SECRET,
              "user-id": userId,
            },
          }
        );

        if (!response.data || response.data.owned !== true) {
          return res.status(403).json({
            message: "Access denied. You are not the owner of product in this order.",
          });
        }
      }

      req.order = order;
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You do not have permission to access this order.",
    });
  } catch (err) {
    console.error("Authorization error:", err.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = authorizeOrderOwner;
