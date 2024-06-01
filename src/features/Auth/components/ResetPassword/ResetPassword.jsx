import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import './ResetPassword.css'; // Ensure this path is correct for your CSS file
import { useNavigate } from 'react-router-dom';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        if (token) {
            setFormData((prevState) => ({ ...prevState, token }));
        } else {
            Swal.fire('Invalid reset password link', '', 'error');
        }
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleBackToLogin = () => {
        navigate('/login'); // Adjust this if your login route is different
      };

      const handleBackToForgetPassword = () => {
        navigate('/forgot-password'); // Adjust this if your login route is different
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, token } = formData;
    
        if (password !== confirmPassword) {
            Swal.fire('Error', 'Passwords do not match.', 'error');
            return;
        }
    
        try {
            const resetPasswordUrl = getBaseUrl()+`/auths/reset-password`;
    
            const newPassword = password;
    
            const resetPasswordResponse = await axios.put(resetPasswordUrl, {
                token,
                newPassword,
            });
    
            if (resetPasswordResponse.data.status) {
                Swal.fire('Success', resetPasswordResponse.data.message, 'success');
                // Handle redirection or any other actions after successful password reset
                handleBackToLogin();

            } else {
                Swal.fire('Failed to reset password', resetPasswordResponse.data.message || '', 'error');
                handleBackToForgetPassword();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            if (errorMessage.includes('Invalid or expired Reset Token Code')) {
                Swal.fire('Error', 'Invalid or expired reset token.', 'error');
                handleBackToForgetPassword();
            } else {
                Swal.fire('Error', errorMessage, 'error');

                handleBackToForgetPassword();
            }
        }
    };
    

    return (

      

<div className="reset-password-page d-flex justify-content-center align-items-center">
        <Card className="reset-password-card">
            <CardContent >
                <Typography variant="h5" gutterBottom>
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <TextField
                        label="New Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />


                    <Button type="submit" variant="contained" color="primary">
                        Reset Password
                    </Button>
                    
                    <br/>
                    <button onClick={handleBackToLogin} className="btn btn-secondary w-100 mt-3">Back to Login</button> {/* Updated button class for more button-like appearance */}

                   


                </form>
            </CardContent>
        </Card>

        </div>

    );
};

export default ResetPassword;
