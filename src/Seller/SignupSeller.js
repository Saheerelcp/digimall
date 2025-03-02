import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupSeller.css';

const SignupSeller = () => {
  const [step, setStep] = useState(1);
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
    setErrorMessage('');
    
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    
    setStep(2);
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (contactNumber.length !== 10 || !/^[0-9]+$/.test(contactNumber)) {
      setErrorMessage('Phone number must be exactly 10 digits.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5129/api/SignupSeller', {
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
      localStorage.setItem('sellerId', data.sellerId);

      setSuccessMessage(`Congratulations, welcome to ${shopName}!`);
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
        </form>
      )}

      {errorMessage && (
        <div className="error-message" >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="success-message" >
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default SignupSeller;
