// Import useState, useEffect, and useContext from React
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || ''); // Initialize role from localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const login = async (username, password) => {
        try {

             // Clear existing local storage
            localStorage.clear();
            const authUrl = getBaseUrl()+`/auths/login`;
            const response = await axios.post(authUrl, { username, password });

            if (response.data.status && response.data.data.accessToken) {
                const { profileInfo, accessToken, refreshToken } = response.data.data;
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userId', profileInfo.userId);
                localStorage.setItem('role', profileInfo.roleName); // Store role in localStorage
                localStorage.setItem('isAuthenticated', 'true'); // Set isAuthenticated to true in localStorage
                setUserId(profileInfo.userId);
                setRole(profileInfo.roleName); // Set role in state
                setIsAuthenticated(true); // Set isAuthenticated to true in state
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return true;
            } else {
                console.error('Login failed:', response.data.message);
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post(getBaseUrl()+`/auths/refresh-token`, {
                refreshToken: localStorage.getItem('refreshToken'),
                token:localStorage.getItem('token'),
            });
            if (response.data.status && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refreshToken();
        }, 82800000); 
    
        return () => clearInterval(interval);
    }, []);

    const logout = () => {
        setIsAuthenticated(false); // Set isAuthenticated to false in state
        setUserId('');
        setRole(''); // Clear role from state
        localStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
    };

      // Function to update isAuthenticated based on localStorage
      const updateAuthStatus = () => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
    };

     // Ensure isAuthenticated always reflects the correct status on component mount
     useEffect(() => {
        updateAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, role, login, logout, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
