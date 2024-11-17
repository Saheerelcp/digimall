const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router(); // Use Router for routing

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create uploads folder if it doesn't exist
    }

    cb(null, uploadDir); // Save files to uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set a unique filename
  },
});

const upload = multer({ storage: storage });

// Handle file upload API route
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Respond with the file URL or path
  res.status(200).json({ fileUrl: `http://localhost:5129/uploads/${req.file.filename}` });
});

module.exports = router;
