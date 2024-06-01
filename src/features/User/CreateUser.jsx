import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, TextField, Box, Card, CardContent, CardActions, MenuItem, Select, FormControl, InputLabel, CircularProgress, Typography } from '@mui/material';
import './CreateUser.css';
import { useNavigate } from 'react-router-dom';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

function CreateUser() {
    const [emailAddress, setEmailAddress] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(''); // Add state to store error message

    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch both departments and roles concurrently
                const [deptRes, roleRes] = await Promise.all([
                    axios.get(getBaseUrl()+`/Department`),
                    axios.get(getBaseUrl()+`/Roles`)
                ]);
    
                // Assuming the departments API wraps the actual data in a 'data' field
                if(deptRes.data.status && deptRes.data.data) {
                    setDepartments(deptRes.data.data.$values);
                } else {
                    console.error('Unexpected response structure from departments API:', deptRes.data);
                    setDepartments([]); // Fallback to empty array
                }
    
                // Directly set roles as the response is an array of role objects
                setRoles(roleRes.data.$values);
    
                setError(''); // Clear any existing errors if the call is successful
            } catch (error) {
                console.error('Error loading form data:', error);
                setError('Failed to load form data. Please check your connection and try again.'); // Set error message
                setDepartments([]); // Ensure departments is an empty array upon error
                setRoles([]); // Ensure roles is an empty array upon error
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchInitialData();
    }, []);
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(''); // Clear previous errors
        try {

     

            await axios.post(`${getBaseUrl()}/Profiles/registration`, {
                emailAddress,
                departmentId: selectedDepartment,
                role: selectedRole
            });
            Swal.fire('Success', 'User successfully created!', 'success').then(() => {
                navigate('/users'); // Use navigate instead of history.push
            });
        } catch (error) {
            console.error('Error creating user:', error);
            Swal.fire('Error', 'Error creating user. Please try again.', 'error');
            setError('Failed to create user. Please check your connection and try again.'); // Set error message
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/users'); // Navigate to the parent component path
    };

    return (
        <Card className="create-user-card">
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <CardContent>
                    {error && <Typography color="error">{error}</Typography>} {/* Display error message if any */}
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
                        value={emailAddress}
                        onChange={e => setEmailAddress(e.target.value)}
                        disabled={isLoading}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="department-label">Department</InputLabel>
                        <Select
                            labelId="department-label"
                            id="department"
                            value={selectedDepartment || ''}
                            onChange={e => setSelectedDepartment(e.target.value)}
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
                            value={selectedRole || ''}
                            onChange={e => setSelectedRole(e.target.value)}
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
                        className="createButton"
                    >
                        Create
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

export default CreateUser;
