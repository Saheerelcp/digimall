// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginOptions from './components/LoginOptions';
import Signup from './components/Signup';
import SignupSeller from './Seller/SignupSeller'; // Ensure this path is correct
import SignupCustomer from './Customer/SignupCustomer'; // Update this path
import SellerLogin from './Seller/SellerLogin';
import CustomerLogin from './Customer/CustomerLogin';
import ForgotPassword from './components/forgotPassword';
import OtpVerification from './components/otpVerification';
import ResetPassword from './components/resetPassword';
import './styles/LoginOptions.css';  
import './styles/Signup.css';
import './styles/SignupSeller.css';
import './styles/SignupCustomer.css';
import './styles/SellerLogin.css'; 


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginOptions />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-seller" element={<SignupSeller />} />
          <Route path="/signup-customer" element={<SignupCustomer />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
