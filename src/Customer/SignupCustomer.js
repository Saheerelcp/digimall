import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use navigate instead of history
import '../styles/SignupCustomer.css'; // Assuming you have a separate CSS file for styling

const SignupCustomer = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Sending data:', { username, password });

    try {
      const response = await fetch('http://localhost:5086/api/SignupCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Signup successful:', data);

      // Redirect to login page after successful signup
      navigate('/customer-login'); // Use navigate to redirect to login page

    } catch (error) {
      console.error('Error during signup:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up as Customer</h1>
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

        <button type="submit">Sign Up</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default SignupCustomer;
