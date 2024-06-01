import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../features/Common/context/AuthContext';
import './Login.css';
import logoImage from '@/logo.jpg';

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(''); // State to hold error messages

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value; // Use named fields for easier reference
    const password = event.target.password.value;

    try {
      const response = await auth.login(username, password);

        // Assuming your API returns some data upon successful authentication
      if (response) {
        navigate('/');
      } else {
        setError(" Username or Password Incorrect  ");
      }
    } catch (error) {
      // Handle error from Axios request
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data || 'An error occurred while logging in.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response received from the server.');
      } else {
        // Something happened in setting up the request that triggered an error
        setError('An error occurred while processing the request.');
      }
    }
  };


  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Replace '/forgot-password' with your path
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center">
      <div className="card login-card">
        <img src={logoImage} alt="Logo" className="card-img-top login-logo" />
        <div className="card-body">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" name="username" className="form-control" placeholder="Email Address" required />
            </div>
            <div className="mb-3">
              <input type="password" name="password" className="form-control" placeholder="Password" required />
            </div>
            <button type="submit" className="btn btn-success w-100">Login</button>
          </form>
          <div className="mt-3">
            <button className="btn btn-link" onClick={handleForgotPassword}>Forgot Password?</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
