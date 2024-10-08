import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import '../styles/SignupSeller.css';

const SignupSeller = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();  // Define navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Sending data:', { username, password, shopAddress });

    try {
      const response = await fetch('http://localhost:5052/api/SignupSeller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          shopAddress,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      navigate('/seller-login');  // Redirect to login page after successful signup

    } catch (error) {
      console.error('Error during signup:', error.message);
      setErrorMessage('An error occurred during signup. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Sign Up as Seller</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="shopAddress">Shop Address:</label>
        <input
          type="text"
          id="shopAddress"
          name="shopAddress"
          value={shopAddress}
          onChange={(e) => setShopAddress(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default SignupSeller;
