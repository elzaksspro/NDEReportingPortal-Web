import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import './UserList.css'; // Ensure this is the correct path to your CSS
import axios from 'axios';

function UserList({ users, filter, onPageChange }) {
    const itemsPerPage = 10; // Number of items per page
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    
/** 
    const filteredUsers = users.filter(user => {
        return filter === 'all' ||
               (filter === 'verified' && user.emailVerified) ||
               (filter === 'unverified' && !user.emailVerified);
    }).filter(user =>
        user.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
*/

    const filteredUsers = users.filter(user => {
        // Filter users based on verification status and search term
        return (
            (filter === 'all' || (filter === 'verified' && user.emailVerified) || (filter === 'unverified' && !user.emailVerified)) &&
            user.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
    

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        onPageChange(page);
    };

    const handleDeactivate = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "The User May not be able to log in to the System  Until Reactivated!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, deactivate it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Data to be sent in the request body
                const requestData = {
                    userId: userId
                };
    
                // Call the API to deactivate the user
                axios.post(`${process.env.REACT_APP_API_URL}/auths/deactivate-login`, requestData, {
                    headers: {
                        'Content-Type': 'application/json' // Specify content type as JSON
                    }
                })
                .then(response => {
                    // Handle response if necessary
                    console.log("Deactivating user:", response.data); // Log the deactivation action
                    // Refresh the user list or update UI accordingly
                })
                .catch(error => {
                    console.error("Error deactivating user:", error); // Log any errors
                    // Handle error or show appropriate message to the user
                });
            }
        });
    };

    const handleReactivate = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "The User will be able to log in to the System after reactivation!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reactivate it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Data to be sent in the request body
                const requestData = {
                    userId: userId
                };
    
                // Call the API to reactivate the user
                axios.post(`${process.env.REACT_APP_API_URL}/auths/reactivate-login`, requestData, {
                    headers: {
                        'Content-Type': 'application/json' // Specify content type as JSON
                    }
                })
                .then(response => {
                    // Handle response if necessary
                    console.log("Reactivating user:", response.data); // Log the reactivation action
                    // Refresh the user list or update UI accordingly
                })
                .catch(error => {
                    console.error("Error reactivating user:", error); // Log any errors
                    // Handle error or show appropriate message to the user
                });
            }
        });
    };
    return (
        <div>
            <TextField
                label="Search by Email Address"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-field"
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email Address</TableCell>
                            <TableCell>Role Name</TableCell>
                            <TableCell>Department Name</TableCell>
                            <TableCell>Verified</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentUsers.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.emailAddress}</TableCell>
                                <TableCell>{user.roleName}</TableCell>
                                <TableCell>{user.departmentName}</TableCell>
                                <TableCell>{user.emailVerified ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/users/edit/${user.userId}`} variant="contained" color="primary" size="small">
                                        Edit
                                    </Button>
                                    </TableCell>

                                    <TableCell>

                                    <Button onClick={() => handleDeactivate(user.userId)} variant="contained" color="error" size="small">
                                        Deactivate
                                    </Button>
                                    </TableCell>

                                    <TableCell>
                                    <Button onClick={() => handleReactivate(user.userId)} variant="contained" color="success" size="small">
                                        Reactivate
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</Button>
                ))}
            </div>
        </div>
    );
}

export default UserList;
