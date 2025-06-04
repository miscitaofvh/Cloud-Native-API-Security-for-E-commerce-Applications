const OrderItem = require("../models/OrderItem");
const axios = require("axios");
const https = require("https");

const PRODUCT_SERVICE_URL = "https://nginx/products";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

exports.getItemList = async (req, res) => {
  try {
    const items = await OrderItem.find({ userId: req.user.id });
    console.log("Items found:", items.length);
    res.json(items);
  } catch (err) {
    console.error("Get item list error:", err.message);
    res.status(500).json({ message: "Failed to retrieve items." });
  }
};

exports.getItemDetail = async (req, res) => {
  try {
    const item = req.orderItem;

    const response = await axios.get(`${PRODUCT_SERVICE_URL}/${item.productId}`, { httpsAgent });

    const product = response.data;
    const total = product.price * item.quantity;

    res.json({
      itemId: item._id,
      orderId: item.orderId,
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
      quantity: item.quantity,
      status: item.status,
      sellerId: item.sellerId,
      userId: item.userId,
      total,
      updatedAt: item.updatedAt,
    });
  } catch (err) {
    console.error("Get item detail error:", err.message);
    res.status(500).json({ message: "Failed to fetch item detail." });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { orderId, productId, quantity, sellerId, userId } = req.body;

    if (!orderId || !productId || !quantity || !sellerId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newItem = await OrderItem.create({
      orderId,
      productId,
      quantity,
      sellerId,
      userId,
      status: "pending",
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Create item error:", err.message);
    res.status(500).json({ message: "Failed to create item" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const item = req.orderItem;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    item.status = status;
    item.updatedAt = new Date();
    await item.save();

    res.json({ message: "Status updated", status: item.status });
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ message: "Failed to update status." });
  }
};

exports.cancelItem = async (req, res) => {
  try {
    const item = req.orderItem; 
    if (item.status === "shipped" || item.status === "delivered") {
      return res.status(400).json({ message: "Cannot cancel item after it has been shipped or delivered." });
    }

    item.status = "cancelled";
    item.updatedAt = new Date();
    await item.save();

    res.json({ message: "Item cancelled", status: item.status });
  } catch (err) {
    console.error("Cancel item error:", err.message);
    res.status(500).json({ message: "Failed to cancel item." });
  }
};
