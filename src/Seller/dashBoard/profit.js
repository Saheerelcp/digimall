import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../styles/profit.css';

const ProfitGraph = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [profit, setProfit] = useState(0);
  const [timePeriod, setTimePeriod] = useState('daily'); // Default view: daily
  const [selectedDate, setSelectedDate] = useState('');  // For daily view
  const [selectedMonth, setSelectedMonth] = useState(''); // For monthly view
  const [selectedYear, setSelectedYear] = useState(''); // For yearly view
  const sellerId = localStorage.getItem('sellerId');

  useEffect(() => {
    const fetchData = async () => {
      if (!sellerId) {
        console.error('Seller ID is missing. Please ensure the user is logged in.');
        return;
      }
      
      let queryParams = `sellerId=${sellerId}&period=${timePeriod}`;
      
      // Add specific date/month/year based on selected period
      if (timePeriod === 'daily' && selectedDate) {
        queryParams += `&date=${selectedDate}`;
      } else if (timePeriod === 'monthly' && selectedMonth) {
        queryParams += `&date=${selectedMonth}-01`; // Use first day of the month for monthly view
      } else if (timePeriod === 'yearly' && selectedYear) {
        queryParams += `&date=${selectedYear}`;  // Just send the year (e.g., 2024) instead of a full date
      }
      

      try {
        const res = await fetch(`http://localhost:5129/api/profit?${queryParams}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch profit data: ${res.statusText}`);
        }
        const data = await res.json();
        console.log(data);

        // Set expenses, income, and calculate profit
        const expenseData = data.totalExpenses || [];
        const incomeData = data.totalIncome || [];
        setExpenses([expenseData]);
        setIncome([incomeData]);
        setProfit(incomeData - expenseData); // Calculate profit for the selected period
      } catch (error) {
        console.error('Error fetching profit data:', error);
      }
    };

    fetchData();
  }, [sellerId, timePeriod, selectedDate, selectedMonth, selectedYear]);

  // Prepare the chart data
  const chartData = {
    labels: expenses.length > 0 ? [timePeriod] : [], // Single label for the selected time period
    datasets: [
      {
        label: 'Expenses',
        data: expenses,
        backgroundColor: 'red',
        borderColor: 'red',
        borderWidth: 1,
        fill: true,
        barThickness: 30,
      },
      {
        label: 'Income',
        data: income,
        backgroundColor: 'green',
        borderColor: 'green',
        borderWidth: 1,
        fill: true,
        barThickness: 30,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profit Analysis</h2>
      {!sellerId ? (
        <p style={{ color: 'red' }}>Seller ID is missing. Please log in to view your profit analysis.</p>
      ) : (
        <>
          <div>
            <label>View: </label>
            <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Conditional Inputs Based on Selected Period */}
          {timePeriod === 'daily' && (
            <div>
              <label>Select a day: </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}

          {timePeriod === 'monthly' && (
            <div>
              <label>Select a month: </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          )}

          {timePeriod === 'yearly' && (
            <div>
              <label>Select a year: </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>
          )}

          <div>
            <Bar data={chartData} options={{ responsive: true }} />
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3  className={profit >= 0 ? 'profit-amount' : 'loss-amount'}>
              {profit >= 0 ? 'Profit' : 'Loss'}: {Math.abs(profit).toFixed(2)}
            </h3>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfitGraph;
