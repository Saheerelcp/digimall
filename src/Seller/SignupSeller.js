import React, { useState } from 'react';
import '../styles/SignupSeller.css'; // Assuming you have a separate CSS file for styling

const SignupSeller = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    
   try {
    const response = await fetch('http://localhost:5019/signup-seller', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            shopAddress,
        })
    });

    // If the response is not OK (not in the range 200-299)
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Signup successful:', data);

} catch (error) {
    console.error('Error during signup:', error);
    setErrorMessage('An error occurred. Please try again.');
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
