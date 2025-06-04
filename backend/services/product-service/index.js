require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const productRoutes = require('./routes/productRoutes.js');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/products', productRoutes);

mongoose.connect(process.env.PRODUCT_MONGO_URI, {
  tls: true,
  tlsCAFile: '/certs/ca.pem',
  tlsCertificateKeyFile: '/certs/mongo.pem',
}).then(() => {
  console.log('✅ MongoDB product connected');
  app.listen(process.env.PRODUCT_PORT || 3002, () => {
  console.log(`🚀 Product service running at http://localhost:${process.env.PRODUCT_PORT || 3002}`);
});
}).catch(err => console.error('❌ DB product connection error:', err));
