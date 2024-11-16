import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SellerLogin.css';

const SellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:5113/api/SellerLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Login failed. Please try again.');
      } else {
        // Store sellerId in local storage (optional)
        localStorage.setItem('sellerId', data.sellerId);
        // Redirect to seller dashboard
        console.log(localStorage.getItem('sellerId'));

        navigate('/seller-dashboard');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Clear error when inputs change
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
    if (errorMessage) setErrorMessage('');
  };

  return (
    <div className="container">
      <h1>Seller Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange(setEmail)}
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
            onChange={handleInputChange(setPassword)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <a href="/forgot-password" className="forgot-password">
          Forgot Password?
        </a>
      </form>
      {errorMessage && (
        <div id="error-message" style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default SellerLogin;
