const OrderItem = require("../models/OrderItem");
const axios = require("axios");
const https = require("https");

const PRODUCT_SERVICE_URL = "https://nginx/products";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const authorizeOrderItemAccess = async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const item = await OrderItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }

    if (userRole === "ADMIN") {
      req.orderItem = item;
      return next();
    }

    if (item.userId.toString() === userId) {
      req.orderItem = item;
      return next();
    }

    if (userRole === "SELLER") {
      const response = await axios.post(
        `${PRODUCT_SERVICE_URL}/ownership-check`,
        { productId: item.productId },
        {
          httpsAgent,
          headers: {
            "x-internal-secret": process.env.INTERNAL_SECRET,
            "user-id": userId
          }
        }
      );

      if (response.data && response.data.owned === true) {
        req.orderItem = item;
        return next();
      }
    }

    return res.status(403).json({
      message: "Access denied. You are not authorized to access this order item."
    });

  } catch (err) {
    console.error("Authorization error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authorizeOrderItemAccess;