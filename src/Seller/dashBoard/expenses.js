import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaHome, FaBolt, FaUniversity, FaWallet, FaPlusCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/expenses.css';
import { PointElement } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement // Add PointElement for the 'point' element support
);

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Expenses = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [graphData, setGraphData] = useState({
    labels: [], // Initialize as empty array
    datasets: [] // Initialize as empty array
  });
  const [interval, setInterval] = useState('daily'); // daily, weekly, monthly, yearly
  const [showGraph, setShowGraph] = useState(false); // Toggle for displaying the graph

  const sellerId = localStorage.getItem('sellerId'); // Fetch sellerId from local storage

  const categories = [
    { name: 'Product Purchase', icon: <FaShoppingCart /> },
    { name: 'Rent', icon: <FaHome /> },
    { name: 'Electricity Bill', icon: <FaBolt /> },
    { name: 'Loan', icon: <FaUniversity /> },
    { name: 'EMI', icon: <FaWallet /> },
    { name: 'Additional', icon: <FaPlusCircle /> },
  ];

  const handleAddExpense = async () => {
    if (!sellerId || !category || !amount) {
      alert('Please select a category and enter the amount.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5129/api/expenses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId, category, amount: Number(amount) }),
      });

      if (!response.ok) throw new Error('Failed to add expense.');

      alert('Expense added successfully!');
      setCategory('');
      setAmount('');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const fetchGraphData = async () => {
    try {
      const response = await fetch(`http://localhost:5129/api/expenses/graph?sellerId=${sellerId}&interval=${interval}`);
      if (!response.ok) throw new Error('Failed to fetch graph data.');

      const data = await response.json();

      // Check if the data is an array and is not empty
      if (Array.isArray(data) && data.length > 0) {
        setGraphData({
          labels: data.map((item) => item.category), // Use category as label
          datasets: [
            {
              label: 'Expenses',
              data: data.map((item) => item.total), // Map total for the data
              backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
              borderWidth: 1,
            },
          ],
        });
      } else {
        console.warn('No data available for the graph');
        setGraphData({
          labels: [],
          datasets: [],
        });
      }
    } catch (error) {
      console.error('Error fetching graph data:', error);
      setGraphData({
        labels: [],
        datasets: [],
      });
    }
  };

  const handleDisplayGraph = () => {
    if (!sellerId) {
      alert('Seller ID is missing from local storage.');
      return;
    }
    fetchGraphData();
    setShowGraph(true);
  };

  return (
    <div className="expenses-container">
      <h2>Track Your Expenses</h2>

      {/* Category Selection */}
      <div className="categories">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`category ${category === cat.name ? 'selected' : ''}`}
            onClick={() => setCategory(cat.name)}
          >
            {cat.icon}
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      {/* Expense Input */}
      <div className="expense-input">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>

      {/* Display Graph Button */}
      <div className="graph-controls">
        <button onClick={handleDisplayGraph}>Display Graph</button>
      </div>

      {/* Graph Section */}
      {showGraph && (
        <div className="expenses-graph">
          <div className="graph-controls">
            <label>
              View By:
              <select value={interval} onChange={(e) => setInterval(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
          </div>
          <Line data={graphData} />
        </div>
      )}
    </div>
  );
};

export default Expenses;
