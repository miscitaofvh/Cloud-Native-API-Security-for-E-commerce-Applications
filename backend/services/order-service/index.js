require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes.js');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.ORDER_MONGO_URI, {
  tls: true,
  tlsCAFile: '/certs/ca.pem',
  tlsCertificateKeyFile: '/certs/mongo.pem',
}).then(() => {
  console.log('✅ MongoDB order connected');
  app.listen(process.env.ORDER_PORT || 3003, () => {
  console.log(`🚀 Order service running at http://localhost:${process.env.ORDER_PORT || 3003}`);
});
}).catch(err => console.error('❌ DB order connection error:', err));
