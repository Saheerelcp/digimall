import React from 'react';
import '../../styles/budgetSection.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaChartLine } from 'react-icons/fa'; // Icons from react-icons

const BudgetSection = ({ onSelectBlock }) => {
  const navigate = useNavigate(); // Correct placement of useNavigate

  const handleExpenses = () => {
    navigate('/expenses-details'); // Correct usage of navigate with a path
  };

  return (
    <div className="budget-container">
      <h2>Budget Section</h2>
      <div className="budget-blocks">
        <div className="budget-block" onClick={handleExpenses}>
          <FaMoneyBillWave className="budget-icon" />
          <p className="budget-label">Expenses</p>
        </div>
        <div
          className="budget-block"
          onClick={() => onSelectBlock('profit')}
        >
          <FaChartLine className="budget-icon" />
          <p className="budget-label">Profit</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetSection;
