// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
// MongoDB connection (without deprecated options)
mongoose.connect('mongodb://localhost:27017/shopDatabase')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


// Import routes
const sellerRoutes = require('./router/sellerRoutes');

// Use routes
app.use('/api', sellerRoutes);

// Start the server
const port = 5003;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
