import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to your backend to request an OTP
      const response = await fetch('http://localhost:5092/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error occurred');
      }

      const data = await response.json();
      setSuccessMessage('OTP sent to your email. Please check.');

      // Use EmailJS to send the email with OTP
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: email,
        otp: data.otp, // Assuming backend returns OTP
      }, 'YOUR_USER_ID')
      .then(() => {
        setSuccessMessage('OTP sent successfully to your email');
        navigate('/otp-verification', { state: { email } });
      })
      .catch(err => {
        console.error('Error sending OTP:', err);
        setErrorMessage('Failed to send OTP. Please try again.');
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </div>
  );
};

export default ForgotPassword;
