import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useAuth } from '../../../Common/context/AuthContext'; // Adjust this path if necessary
import { AppBar, Toolbar, button, Button, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import the icon component

import './TopNavBar.css';

function TopNavBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const navigate = useNavigate();
    const { userId, logout } = useAuth(); // Destructure to get userId and logout from auth context

  

  

    const handleProfileClick = () => {
        navigate(`/profile/update/${userId}`); // Use template literal for userId
    };

  

    return (
        <AppBar position="fixed" color="inherit" elevation={1}>
            <Toolbar>
            <div className="topnav-right">

            <IconButton
            className="topnav-element" // Add the class name here
            aria-label="profile"
            onClick={handleProfileClick}
        >
            <AccountCircleIcon /> {/* Icon component */}
            Profile
        </IconButton>
            </div>

            
            </Toolbar>
        </AppBar>
    );
}

export default TopNavBar;
