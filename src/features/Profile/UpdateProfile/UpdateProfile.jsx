import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Box, TextField, Button, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './UpdateProfile.css'; // Ensure this path is correct for your CSS file

const UpdateProfile = () => {
    const [profileFormData, setProfileFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        designation: '',
        mobileNumber: '',
    });

    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [tabValue, setTabValue] = useState(0);
    const { userId } = useParams();


    useEffect(() => {
        if (userId) {
            const fetchUrl = `${process.env.REACT_APP_API_URL}/Profiles/${userId}`;
            axios.get(fetchUrl)
                .then(response => {
                    if (response.data.status) {
                        const { firstName, lastName, middleName, gender, designation, mobileNumber } = response.data.data;
                        setProfileFormData({ firstName, lastName, middleName, gender: mapGenderToString(gender), designation, mobileNumber });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed to fetch user details',
                            text: response.data.message || 'Unknown error occurred.',
                        });
                    }
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.response?.data?.message || err.message,
                    });
                });
        }
    }, [userId]);

    const mapGenderToString = (gender) => {
        return gender === 0 ? 'Male' : 'Female';
    };

    const mapStringToGender = (gender) => {
        return gender === 'Male' ? 0 : 1;
    };

  

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
    
   
    
        setProfileFormData(prevState => ({ ...prevState, [name]: value }));

        
    };

    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateUrl = `${process.env.REACT_APP_API_URL}/Profiles/${userId}`;
            const response = await axios.put(updateUrl, {
                
                ...profileFormData,
                
                gender: parseInt(mapStringToGender(profileFormData.gender), 10),
            });

            if (response.data.status) {
                Swal.fire('Success', 'Profile successfully updated!', 'success');
            } else {
                Swal.fire('Error', response.data.message || 'Failed to update profile.', 'error');
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || err.message, 'error');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateUrl = `${process.env.REACT_APP_API_URL}/auths/update-password/${userId}`;
            const response = await axios.put(updateUrl, {

                oldpassword: passwordFormData.currentPassword,
                password: passwordFormData.newPassword,
                userId:userId

            });

            if (response.data.status) {
                Swal.fire('Success', 'Password successfully updated!', 'success');
            } else {
                Swal.fire('Error', response.data.message || 'Failed to update password.', 'error');
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || err.message, 'error');
        }
    };

    return (
        <div className="update-profile-card">
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile and password tabs">
                <Tab label="Profile" />
                <Tab label="Password" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                <Card className="update-profile-form-card">
                    <CardContent>
                        <form onSubmit={handleProfileSubmit} className="update-profile-form">
                            <div className="form-group">
                                <TextField id="firstName" name="firstName" type="text" value={profileFormData.firstName} onChange={handleProfileChange} label="First Name" required />
                            </div>
                            <div className="form-group">
                                <TextField id="lastName" name="lastName" type="text" value={profileFormData.lastName} onChange={handleProfileChange} label="Last Name" required />
                            </div>
                            <div className="form-group">
                                <TextField id="middleName" name="middleName" type="text" value={profileFormData.middleName} onChange={handleProfileChange} label="Middle Name" />
                            </div>
                            <div className="form-group">
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        id="gender"
                                        name="gender"
                                        value={profileFormData.gender}
                                        onChange={handleProfileChange}
                                        required
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="form-group">
                                <TextField id="designation" name="designation" type="text" value={profileFormData.designation} onChange={handleProfileChange} label="Designation" required />
                           
                                </div>
                            <div className="form-group">
                                <TextField id="mobileNumber" name="mobileNumber" type="text" value={profileFormData.mobileNumber} onChange={handleProfileChange} label="Mobile Number" required />
                            </div>
                            <Button type="submit" variant="contained" className="submit-button">Update Profile</Button>
                        </form>
                    </CardContent>
                </Card>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Card className="update-password-form-card">
                    <CardContent>
                        <form onSubmit={handlePasswordSubmit} className="update-password-form">
                            <div className="form-group">
                                <TextField id="currentPassword" name="currentPassword" type="password" value={passwordFormData.currentPassword} onChange={handlePasswordChange} label="Current Password" required />
                            </div>
                            <div className="form-group">
                                <TextField id="newPassword" name="newPassword" type="password" value={passwordFormData.newPassword} onChange={handlePasswordChange} label="New Password" required />
                            </div>
                            <div className="form-group">
                                <TextField id="confirmPassword" name="confirmPassword" type="password" value={passwordFormData.confirmPassword} onChange={handlePasswordChange} label="Confirm Password" required />
                            </div>
                            <Button type="submit" variant="contained" className="submit-button">Change Password</Button>
                        </form>
                    </CardContent>
                </Card>
            </TabPanel>
        </div>
    );
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index &&
             (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
             )}
        </div>
    );
}

export default UpdateProfile;
