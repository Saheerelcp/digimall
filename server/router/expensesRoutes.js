const express = require('express');
const Expense = require('../model/ExpensesModel');
const CustomerBill = require('../model/customerBill');
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
   

  if (!sellerId || !interval) {
    return res.status(400).json({ error: 'Seller ID and interval are required.' });
  }

  try {
    let startDate = new Date();


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

// Helper to calculate time range
// Helper to calculate time range
const calculateTimeRange = (period, selectedDate) => {
  const today = new Date();
  let startDate, endDate;

  if (period === 'daily' && selectedDate) {
    startDate = new Date(selectedDate);
    endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);  // End of the day
  } else if (period === 'monthly' && selectedDate) {
    const [year, month] = selectedDate.split('-');
    startDate = new Date(year, month - 1, 1);  // Start of the month
    endDate = new Date(year, month, 0);  // End of the month
    endDate.setHours(23, 59, 59, 999);  // End of the month
  } else if (period === 'yearly' && selectedDate) {
    const year = selectedDate;  // Assuming selectedDate is the year as string
    startDate = new Date(year, 0, 1);  // Start of the year
    endDate = new Date(year, 12, 0);  // End of the year
    endDate.setHours(23, 59, 59, 999);  // End of the year
  } else {
    // Handle default case for today, this month, or this year
    switch (period) {
      case 'weekly':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of this week
        startDate = new Date(startOfWeek.setHours(0, 0, 0, 0));
        endDate = new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));  // End of the week
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);  // Start of the current month
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);  // End of the current month
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        startDate = new Date(today.getFullYear(), 0, 1);  // Start of the current year
        endDate = new Date(today.getFullYear(), 12, 0);  // End of the current year
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = new Date(today.setHours(0, 0, 0, 0));  // Default to today
        endDate = new Date(today.setHours(23, 59, 59, 999));  // Default to today
    }
  }

  return { startDate, endDate };
};
// Get profit data
router.get('/profit', async (req, res) => {
  try {
    const { sellerId, period, date } = req.query;

    // Validate inputs
    if (!sellerId || !period) {
      return res.status(400).json({ error: 'Seller ID and period are required.' });
    }

    // Validate sellerId format
    if (!ObjectId.isValid(sellerId)) {
      return res.status(400).json({ error: 'Invalid seller ID format.' });
    }

    const { startDate, endDate } = calculateTimeRange(period, date);

    const sellerIdObjectId = new ObjectId(sellerId); // Ensure ObjectId

    // Fetch total expenses
    const expensesData = await Expense.aggregate([
      {
        $match: {
          sellerId: sellerIdObjectId,
          date: { $gte: startDate, $lte: endDate },  // Use the corrected start and end dates
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: { $ifNull: ["$amount", 0] } },
        },
      },
    ]);

    const totalExpenses = expensesData.length > 0 ? expensesData[0].totalExpenses : 0;

    // Fetch total income
    const incomeData = await CustomerBill.aggregate([
      {
        $match: {
          sellerId: sellerIdObjectId,
          orderDate: { $gte: startDate, $lte: endDate },  // Use the corrected start and end dates
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $ifNull: ["$totalAmount", 0] } },
        },
      },
    ]);

    const totalIncome = incomeData.length > 0 ? incomeData[0].totalIncome : 0;

    // Calculate profit
    const profit = totalIncome - totalExpenses;

    res.status(200).json({ totalExpenses, totalIncome, profit });
  } catch (error) {
    console.error('Error fetching profit data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



  module.exports = router;