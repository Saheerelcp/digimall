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
import ShopPage from './Customer/dashboard/shopPage';
import CartPage from './Customer/dashboard/cartPage';
import Checkout from './Customer/dashboard/checkOut';
import CustomerDeliveryUpdates from './Customer/dashboard/customerDelivery';
import SellerBills from './Seller/dashBoard/sellerBill';
import './styles/LoginOptions.css';
import './styles/Signup.css';
import './styles/SignupSeller.css';
import './styles/SignupCustomer.css';
import './styles/SellerLogin.css';
import './styles/sellerDashboard.css';
import './styles/addProduct.css';
import './styles/customerDashboard.css';
import './styles/shopPage.css';
import './styles/cartPage.css';
import './styles/checkout.css';
import './styles/deliveryUpdates.css';
import './styles/sellerBills.css';
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
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/shop/:sellerId" element={<ShopPage />} />
          <Route path="/cart/:customerId/:sellerId" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/delivery-updates/:customerId" element={<CustomerDeliveryUpdates/>} />
          <Route path="/seller-bill/:sellerId" element={<SellerBills/>} />
          
          


        </Routes>
      </div>
    </Router>
  );
}

export default App;
