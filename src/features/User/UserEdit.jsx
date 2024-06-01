import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, TextField, Box, Card, CardContent, CardActions, MenuItem, Select, FormControl, InputLabel, CircularProgress, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import './UserEdit.css';

function EditUser() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ emailAddress: '', departmentId: '', role: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const [userDataRes, deptRes, roleRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/Profiles/${userId}`),
                    axios.get(`${process.env.REACT_APP_API_URL}/Department`),
                    axios.get(`${process.env.REACT_APP_API_URL}/Roles`)
                ]);

                if(userDataRes.data.status && userDataRes.data.data) {
                    setUser(userDataRes.data.data);
                } else {
                    console.error('Unexpected response structure from user data API:', userDataRes.data);
                    setUser({ emailAddress: '', departmentId: '', role: '' }); // Reset user to empty values
                }

                if(deptRes.data.status && deptRes.data.data) {
                    setDepartments(deptRes.data.data);
                } else {
                    console.error('Unexpected response structure from departments API:', deptRes.data);
                    setDepartments([]);
                }

                setRoles(roleRes.data); // Directly set roles as the response is an array of role objects
                setError(''); // Clear any existing errors if the call is successful
            } catch (error) {
                console.error('Error loading user data:', error);
                setError('Failed to load user data. Please check your connection and try again.');
                setUser({ emailAddress: '', departmentId: '', role: '' }); // Reset user to empty values
                setDepartments([]);
                setRoles([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/Profiles/${userId}`, user);
            Swal.fire('Success', 'User successfully updated!', 'success').then(() => {
                navigate('/users');
            });
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire('Error', 'Error updating user. Please try again.', 'error');
            setError('Failed to update user. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/users');
    };

    return (
        <Card className="edit-user-card">
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <CardContent>
                    {error && <Typography color="error">{error}</Typography>}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="emailAddress"
                        label="Email Address"
                        name="emailAddress"
                        autoComplete="email"
                        autoFocus
                        value={user.emailAddress}
                        onChange={e => setUser(prevUser => ({ ...prevUser, emailAddress: e.target.value }))}
                        disabled={isLoading}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="department-label">Department</InputLabel>
                        <Select
                            labelId="department-label"
                            id="department"
                            value={user.departmentId || ''}
                            onChange={e => setUser(prevUser => ({ ...prevUser, departmentId: e.target.value }))}
                            disabled={isLoading}
                        >
                            {departments.map((department) => (
                                <MenuItem key={department.id} value={department.id}>
                                    {department.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            value={user.role || ''}
                            onChange={e => setUser(prevUser => ({ ...prevUser, role: e.target.value }))}
                            disabled={isLoading}
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.value} value={role.value}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
                <CardActions>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                    >
                        Update
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleGoBack}
                        disabled={isLoading}
                    >
                        Go Back
                    </Button>
                </CardActions>
                {isLoading && (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </Card>
    );
}

export default EditUser;
