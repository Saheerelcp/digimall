import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupSeller.css'; // Assuming you have a separate CSS file for styling sellers

const SignupSeller = () => {
  const [step, setStep] = useState(1); // Tracks the step in the signup process
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmitInitial = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error messages
    setStep(2); // Move to the business details section
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5121/api/SignupSeller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          sellerName,
          shopName,
          contactNumber,
          shopAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Unknown error');
        throw new Error(errorData.error || 'Unknown error');
      }

      const data = await response.json();
      console.log('Signup successful:', data);

      // Store sellerId in localStorage (optional)
      localStorage.setItem('sellerId', data.sellerId);

      // Set a success message
      setSuccessMessage(`Congratulations, welcome to ${shopName}!`);

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/seller-dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error during signup:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up as Seller</h1>

      {step === 1 && (
        <form onSubmit={handleSubmitInitial}>
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

          <button type="submit">Continue</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmitFinal}>
          <label htmlFor="sellerName">Seller Name:</label>
          <input
            type="text"
            id="sellerName"
            name="sellerName"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            required
          />

          <label htmlFor="shopName">Shop Name:</label>
          <input
            type="text"
            id="shopName"
            name="shopName"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />

          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />

          <label htmlFor="shopAddress">Shop Address:</label>
          <textarea
            id="shopAddress"
            name="shopAddress"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            required
          />

          <button type="submit">Sign Up</button>

          {errorMessage && (
            <div className="error-message" style={{ color: 'red' }}>
              {errorMessage}
            </div>
          )}
        </form>
      )}

      {successMessage && (
        <div className="success-message" style={{ color: 'green', marginTop: '20px' }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default SignupSeller;
