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
import Dashboard from './Seller/sellerDashboard';
import AddProduct from './Seller/dashBoard/addProduct';
import ProductCategories from './Seller/dashBoard/productCategories';
import CustomerDashboard from './Customer/dashboard/customerDashboard';
import './styles/LoginOptions.css';  
import './styles/Signup.css';
import './styles/SignupSeller.css';
import './styles/SignupCustomer.css';
import './styles/SellerLogin.css'; 
import './styles/sellerDashboard.css';
import './styles/addProduct.css';
import './styles/customerDashboard.css';

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
          <Route path="/seller-dashboard" element={<Dashboard />} />
          <Route path="/add-product/:category" element={<AddProduct />} />
          <Route path="/product-categories" element={<ProductCategories />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
