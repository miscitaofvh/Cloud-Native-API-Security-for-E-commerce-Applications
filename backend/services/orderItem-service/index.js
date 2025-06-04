require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const orderItemRoutes = require("./routes/orderItemRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();
const PORT = process.env.ORDERITEM_PORT || 3004;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/items", orderItemRoutes);

mongoose.connect(process.env.ORDERITEM_MONGO_URI, {
  tls: true,
  tlsCAFile: '/certs/ca.pem',
  tlsCertificateKeyFile: '/certs/mongo.pem',
})
.then(() => {
  console.log("✅ MongoDB connected (OrderItem Service)");
  app.listen(PORT, () => {
    console.log(`🚀 OrderItem service running at http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB connection failed:", err.message);
});
