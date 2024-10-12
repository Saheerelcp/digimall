import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupSeller.css'; // Assuming you have a separate CSS file for styling sellers

const SignupSeller = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Sending data:', { email, password });

    try {
      const response = await fetch('http://localhost:5112/api/SignupSeller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
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

      // Redirect to seller login page after successful signup
      navigate('/seller-login');

    } catch (error) {
      console.error('Error during signup:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up as Seller</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

export default SignupSeller;
