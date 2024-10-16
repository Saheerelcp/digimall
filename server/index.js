const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./router/authRoutes');
require('dotenv').config();
// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Update this to match your frontend URL
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/giveandtake')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Import routes
const customerRoutes = require('./router/customerRoutes');
const sellerRoutes=require('./router/sellerRoutes');
// Use routes (ensure the /api prefix is used in frontend and backend consistently)
app.use('/api', customerRoutes);
app.use('/api', sellerRoutes);
app.use('/api', authRoutes);
// Start the server
const port = 5112;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
