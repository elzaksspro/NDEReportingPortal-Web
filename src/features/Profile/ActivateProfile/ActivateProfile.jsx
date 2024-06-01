import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate hook

import axios from 'axios';
import Swal from 'sweetalert2';
import './ActivateProfile.css'; // Ensure this path is correct for your CSS file

const ActivateProfile = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        activationStatus: 'Activating...',
        error: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        designation: '',
        mobileNumber: '',
        userId: '', // Ensure you are correctly capturing userId from the response
    });
    const { search } = useLocation();

    const parseActivationCode = useCallback(() => {
        const query = new URLSearchParams(search);
        return query.get('ActivationCode');
    }, [search]);

    useEffect(() => {
        const activationCode = parseActivationCode();
        if (activationCode) {
            const activateUrl = `${process.env.REACT_APP_API_URL}/Profiles/check-activate-code`;
            axios.put(activateUrl, { activationCode })
                .then(response => {
                    if (response.data.status) {
                        setFormData(prevState => ({
                            ...prevState,
                            activationStatus: 'Profile Activation',
                            userId: response.data.data.userId // Assuming 'userId' is the correct field returned
                        }));
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Activation failed',
                            text: response.data.message || 'Unknown error occurred.',
                        });
                        setFormData(prevState => ({
                            ...prevState,
                            activationStatus: 'Activation failed.',
                            error: response.data.message || 'Unknown error occurred.'
                        }));
                    }
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.response?.data?.message || err.message,
                    });
                    setFormData(prevState => ({
                        ...prevState,
                        activationStatus: 'Activation failed.',
                        error: err.response?.data?.message || err.message
                    }));
                });
        } else {
            Swal.fire('Invalid activation link', '', 'error');
            setFormData(prevState => ({ ...prevState, activationStatus: 'Invalid activation link.' }));
        }
    }, [parseActivationCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, firstName, lastName, middleName, gender, designation, mobileNumber, userId } = formData;
        
        if (password !== confirmPassword) {
            Swal.fire('Error', 'Passwords do not match.', 'error');
            return;
        }

        const activationCode = parseActivationCode();
        if (!activationCode) {
            Swal.fire('Invalid activation link', '', 'error');
            return;
        }

        try {
            const profileUrl = `${process.env.REACT_APP_API_URL}/Profiles`;
            const profileResponse = await axios.post(profileUrl, {
                userId,
                activationCode,
                firstName,
                lastName,
                middleName,
                gender: parseInt(gender, 10), // Convert gender to integer
                designation,
                mobileNumber,
                password,
            });

            if (profileResponse.data.status) {
                Swal.fire('Success', profileResponse.data.message, 'success');
                setFormData(prevState => ({
                    ...prevState,
                    activationStatus: 'Profile successfully activated'
                }));
                // Navigate to login after showing the success message
                navigate('/login');
            } else {
                Swal.fire('Failed to set up user profile', profileResponse.data.message || '', 'error');
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || err.message, 'error');
        }
    };

    return (
        <div className="activation-card">
            <div className="activation-content">
                <h2>{formData.activationStatus}</h2>
                {formData.error && <p className="error-message">{formData.error}</p>}
                {formData.activationStatus === 'Profile Activation' && (
                    <form onSubmit={handleSubmit} className="activation-form">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middleName">Middle Name:</label>
                            <input id="middleName" name="middleName" type="text" value={formData.middleName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Gender:</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="0">Male</option>
                                <option value="1">Female</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="designation">Designation:</label>
                            <input id="designation" name="designation" type="text" value={formData.designation} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobileNumber">Mobile Number:</label>
                            <input id="mobileNumber" name="mobileNumber" type="text" value={formData.mobileNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="submit-button">Activate Profile</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ActivateProfile;
