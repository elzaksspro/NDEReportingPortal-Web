import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import { Link } from 'react-router-dom';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

import './UserManagement.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const get_users_url = getBaseUrl() + `/Profiles`;



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(get_users_url);
                if (response.data && response.data.status) {
                    setUsers(response.data.data.items.$values); // Adjust based on actual API response
                }

            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div id='UserManagement'> 
            <Button  
                id="createUserButton"
                variant="contained"
                component={Link} 
                to="/users/create"
                startIcon={<AddCircleOutlineIcon />}
            >
                Create
            </Button>
            <FormControl variant="outlined" className="userListFilter">
                <InputLabel id="filter-select-label">Verification Status</InputLabel>
                <Select
                    labelId="filter-select-label"
                    id="verification-filter"
                    value={filter}
                    onChange={handleFilterChange}
                    label="Verification Status"
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="verified">Verified</MenuItem>
                    <MenuItem value="unverified">Unverified</MenuItem>
                </Select>
            </FormControl>
            <UserList
                users={users}
                filter={filter}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default UserManagement;
