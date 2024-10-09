import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/SellerLogin.css';

const SellerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5086/api/SellerLogin', {  // Correct API URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // No need for "role: seller"
      });

      if (!response.ok) {
        const message = await response.text();
        console.log("Error:", response.status, message);
        setErrorMessage(message);
      } else {
        navigate('/customer-login');  // Redirect to the seller dashboard after successful login
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Seller Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
      </form>
      {errorMessage && <div id="error-message" style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default SellerLogin;
