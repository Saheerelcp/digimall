import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginOptions.css';

const LoginOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src="https://via.placeholder.com/150" alt="Company Logo" />
      <h2>Login As</h2>

      <div className="option">
        <button onClick={() => navigate('/seller-login')}>Login as Seller</button>
      </div>
      <div className="option">
        <button onClick={() => navigate('/customer-login')}>Login as Customer</button>
      </div>

      <div className="signup">
        <p>Don't have an account? <Link to="/Signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default LoginOptions;
