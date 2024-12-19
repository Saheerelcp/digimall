const express = require('express');
const Expense = require('../model/ExpensesModel');
const router = express.Router();
const { ObjectId } = require('mongodb');


// Add an expense

// Route to add an expense
router.post('/expenses/add', async (req, res) => {
    const { sellerId, category, amount } = req.body;
  
    if (!sellerId || !category || !amount) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    try {
      const newExpense = new Expense({ sellerId, category, amount });
      await newExpense.save();
      
      res.status(201).json({ message: 'Expense added successfully.' });
    } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ error: 'Failed to add expense.' });
    }
  });
  

router.get('/expenses/graph', async (req, res) => {
  const { sellerId, interval } = req.query;
  console.log('Interval:', interval); // Debugging log

  if (!sellerId || !interval) {
    return res.status(400).json({ error: 'Seller ID and interval are required.' });
  }

  try {
    let startDate = new Date();
    console.log('Start Date:', startDate);  // Raw Date for debugging
    console.log('ISO Start Date:', startDate.toISOString()); // ISO formatted Date for debugging

    switch (interval) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'yearly':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid interval.' });
    }

    // Ensure date is in ISO format (UTC) for MongoDB query
    const isoStartDate = startDate.toISOString();

    // Ensure sellerId is an ObjectId using the 'new' keyword
    const sellerIdObjectId = new ObjectId(sellerId);

    const expenses = await Expense.aggregate([
      { 
        $match: {
          sellerId: sellerIdObjectId, // Ensure ObjectId for sellerId
          date: { $gte: new Date(isoStartDate) } // Use the ISO start date for comparison
        }
      },
      { 
        $project: {
          category: 1,
          amount: { $ifNull: ["$amount", 0] }, // Replace null amounts with 0
        }
      },
      {
        $group: {
          _id: "$category",  // Group by category field
          total: { $sum: "$amount" } // Sum amounts for each category
        }
      },
      {
        $sort: { total: -1 } // Sort results by total in descending order
      }
    ]);

    console.log('Expenses:', expenses); // Log the result for debugging

    // If no data is found, respond with an empty array
    if (expenses.length === 0) {
      console.log('No expenses found');
      return res.status(200).json([]);
    }

    // Return the formatted response
    res.status(200).json(
      expenses.map((expense) => ({
        category: expense._id,
        total: expense.total,
      }))
    );
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({ error: 'Failed to fetch graph data.' });
  }
});

  
  module.exports = router;