import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // For redirecting after successful login

const CustomerLogin = () => {
  const [email, setEmail] = useState('');  // Use email instead of username
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:5113/api/CustomerLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),  // Use email in the request
      });

      if (!response.ok) {
        const message = await response.text();
        console.log("Error:", response.status, message);
        setErrorMessage(message);  // Display error message
      } else {
        // Redirect to the home page or another page after successful login
        navigate('/customer-dashboard');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Customer Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Handle email input change
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

export default CustomerLogin;
