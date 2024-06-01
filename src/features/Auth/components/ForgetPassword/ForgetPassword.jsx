import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgetPassword.css'; // Ensure you have the CSS for styling
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

const ForgetPassword = () => {
  const [emailAddress, setemailAddress] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(getBaseUrl()+`/auths/reset-password-initiate`, { emailAddress });
      if (response.data.status) {
        setMessage('Check your email for the reset link.');
        // Optionally redirect after successful request
        // navigate('/login');
      } else {
        setMessage('Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('Error sending reset email, please try again later.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login'); // Adjust this if your login route is different
  };

  return (
    <div className="forget-password-page d-flex justify-content-center align-items-center">
      <div className="card forget-password-card">
        <div className="card-body">
          <h4 className="card-title">Reset Your Password</h4>
          <form className="forget-password-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                type="emailAddress" 
                className="form-control" 
                placeholder="Enter your email address" 
                value={emailAddress}
                onChange={(e) => setemailAddress(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Send Reset Link</button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
          <button onClick={handleBackToLogin} className="btn btn-secondary w-100 mt-3">Back to Login</button> {/* Updated button class for more button-like appearance */}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
