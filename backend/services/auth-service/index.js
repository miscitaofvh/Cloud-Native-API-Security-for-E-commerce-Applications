require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.AUTH_PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.AUTH_MONGO_URI, {
  tls: true,
  tlsCAFile: '/certs/ca.pem',
  tlsCertificateKeyFile: '/certs/mongo.pem',
}).then(() => {
  console.log('✅ MongoDB auth connected');
  app.listen(PORT, () => {
    console.log(`🚀 Auth service running at http://localhost:${PORT}`);
  });
}).catch(err => console.error('❌ DB auth connection error:', err));
