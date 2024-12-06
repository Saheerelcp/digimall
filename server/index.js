const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./router/authRoutes');
const path = require('path');

require('dotenv').config();
// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Update this to match your frontend URL
  methods: ['POST', 'GET','DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Make the uploads folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/giveandtake')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Import routes
const customerRoutes = require('./router/customerRoutes');
const sellerRoutes=require('./router/sellerRoutes');
const productRoutes = require('./router/productRoutes');
const getProductRoutes=require('./router/getProductRoutes');
const uploadRoutes = require('./router/uploadRoutes');
const ratingRoutes=require('./router/ratingRoutes');
const cartRoutes=require('./router/cartRoutes');
const checkoutRoutes=require('./router/checkoutRoutes');
const deliveryRoutes=require('./router/deliveryRoutes');
const billRoutes=require('./router/billRoutes');
// Use routes (ensure the /api prefix is used in frontend and backend consistently)
app.use('/api', customerRoutes);
app.use('/api', sellerRoutes);
app.use('/api', authRoutes);
// Use the product router
app.use('/api/products', productRoutes);
app.use('/api',getProductRoutes);
app.use('/api', uploadRoutes);
app.use('/api', ratingRoutes);
app.use('/api',cartRoutes);
app.use('/api', checkoutRoutes)
app.use('/api',deliveryRoutes);
app.use('/api',billRoutes);
// Start the server

const port = 5129;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});