// src/components/Signup.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import logo from '../logo-images/Preview (1).png';

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src={logo} alt="Company Logo" className="logo" />
      <h1>Sign Up</h1>
      <div className="button-group">
        <button onClick={() => navigate('/signup-seller')}>
          Sign Up as Seller
        </button>
        <button onClick={() => navigate('/signup-customer')}>
          Sign Up as Customer
        </button>
      </div>
    </div>
  );
};

export default Signup;
