const axios = require("axios");
const https = require("https");
const Order = require("../models/Order");

const PRODUCT_SERVICE_URL = "https://nginx/products";
const ORDERITEM_SERVICE_URL = "https://nginx/items";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const response = await axios.get(
        `${PRODUCT_SERVICE_URL}/${item.product}`,
        { httpsAgent }
      );
      const product = response.data;

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${product.name}". Only ${product.quantity} left.`,
        });
      }

      await axios.patch(
        `${PRODUCT_SERVICE_URL}/${item.product}/stock`,
        { quantity: item.quantity },
        {
          httpsAgent,
          headers: {
            "x-internal-secret": process.env.INTERNAL_SECRET,
          },
        }
      );
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      processedItems.push({
        product: item.product,
        quantity: item.quantity,
        sellerId: product.seller_id,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: processedItems.map(i => ({ product: i.product, quantity: i.quantity })),
      totalAmount,
      shippingAddress,
    });

    for (const item of processedItems) {
      await axios.post(
        `${ORDERITEM_SERVICE_URL}`,
        {
          orderId: order._id,
          productId: item.product,
          quantity: item.quantity,
          sellerId: item.sellerId,
          userId: req.user.id,
        },
        {
          httpsAgent,
          headers: {
            "x-internal-secret": process.env.INTERNAL_SECRET,
          },
        }
      );
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err.message);
    res.status(500).json({ message: "Failed to create order." });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err.message);
    res.status(500).json({ message: "Failed to retrieve your orders." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = req.order;
    res.json(order);
  } catch (err) {
    console.error("Get order by ID error:", err.message);
    res.status(500).json({ message: "Failed to retrieve order." });
  }
};