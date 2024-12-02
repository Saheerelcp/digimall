import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupCustomer.css'; // Assuming you have a separate CSS file for styling

const SignupCustomer = () => {
  const [email, setEmail] = useState('');  // Email state
  const [password, setPassword] = useState(''); // Password state
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Sending data:', { email, password });  // Log email and password data

    try {
      const response = await fetch('http://localhost:5129/api/SignupCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,  // Send email to the backend
          password, // Send password to the backend
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      console.log(`data and customerId:${data}`);
      console.log(`what is in data:${data.customerId}`);

      // Store customerId in localStorage (or any other state management approach)
      localStorage.setItem('customerId', data.customerId);

      // Redirect to login page after successful signup
      navigate('/customer-login');

    } catch (error) {
      console.error('Error during signup:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up as Customer</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>  {/* Email input field */}
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}  // Handle email input
          required
        />

        <label htmlFor="password">Password:</label> {/* Password input field */}
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Handle password input
          required
        />

        <button type="submit">Sign Up</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default SignupCustomer;
