// src/customer/SignupCustomer.js
import React, { useState } from 'react';
import '../styles/SignupCustomer.css'; // Import the CSS for styling

const SignupCustomer = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle your signup logic here
    // For now, let's just log the data
    console.log('Signing up:', { username, password });

    // Simulate a check for existing username
    if (username === 'takenUser') {
      setErrorMessage('Username is already taken. Please choose another one.');
    } else {
      // Proceed with your signup logic (e.g., API call)
      setErrorMessage(''); // Clear error if signup is successful
      // Redirect or show success message
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
