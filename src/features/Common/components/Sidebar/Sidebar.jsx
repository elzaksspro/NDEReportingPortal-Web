// Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useAuth } from '../../../Common/context/AuthContext'; // Adjust this path if necessary
import { AppBar, Toolbar, button, Button, MenuItem } from '@mui/material';


import menuConfig from './menuConfig.json';

import logo from './../../../../logo.jpg';
import './Sidebar.css'; // Importing CSS

const iconMapping = {
  DashboardIcon: <DashboardIcon />,
  AssignmentIcon: <AssignmentIcon />,
  PersonIcon: <PersonIcon />,
  GroupIcon: <GroupIcon />,
  BusinessIcon: <BusinessIcon />,
  SecurityIcon: <SecurityIcon/>
};


function Sidebar() {
  const location = useLocation();

  const navigate = useNavigate();
  const { currentUserId, role, logout } = useAuth(); // Destructure to get userId, role, and logout from auth context



  const handleLogoutClick = async () => {
    await logout(); // Await the logout operation
    navigate('/login'); // Navigate to login after logout
  };

  // Filter menu items based on user's role
  const filteredMenuConfig = menuConfig.filter(menuItem => {
    if (menuItem.allowedRoles) {
      return menuItem.allowedRoles.includes(role);
    } else {
      return true; // If no roles are specified, show the menu item to all users
    }
  });
  
  return (
    <Drawer
      className="drawer"
      variant="permanent"
      anchor="left"
    >
      <Box className="logo-box">
        <img src={logo} alt="logo" className="logo-img" />
        <h6>National Directorate <br/>of Employement</h6>
      </Box>
      <List>
        {filteredMenuConfig.map((menuItem, index) => (
          <Link to={menuItem.href} style={{ textDecoration: 'none', color: 'inherit' }} key={index}>
            <ListItem 
              className={`list-item ${location.pathname === menuItem.href ? 'active' : ''}`}
            >
              <ListItemIcon className={`list-item-icon ${location.pathname === menuItem.href ? 'active' : ''}`}>
                {iconMapping[menuItem.icon]}
              </ListItemIcon>
              <ListItemText primary={menuItem.text} />
            </ListItem>
          </Link>
        ))}

          {/* Logout Button */}
          <ListItem  >
            <button onClick={handleLogoutClick}>
            <ListItemIcon id='logoutButton'><SecurityIcon />
            <ListItemText primary="Logout" />
            </ListItemIcon>
        
            </button>

       
        </ListItem>

      </List>
    </Drawer>
  );
}

export default Sidebar;
