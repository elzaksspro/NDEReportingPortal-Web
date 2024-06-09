import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getBaseUrl } from '@/features/Common/Utils/apiutils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false); // Set loading to false once initial check is done
    }, []);

    const login = async (username, password) => {
        try {
            localStorage.clear();
            const authUrl = getBaseUrl() + `/auths/login`;
            const response = await axios.post(authUrl, { username, password });

            if (response.data.status && response.data.data.accessToken) {
                const { profileInfo, accessToken, refreshToken } = response.data.data;
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userId', profileInfo.userId);
                localStorage.setItem('role', profileInfo.roleName);
                localStorage.setItem('isAuthenticated', 'true');
                setUserId(profileInfo.userId);
                setRole(profileInfo.roleName);
                setIsAuthenticated(true);
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
            const response = await axios.post(getBaseUrl() + `/auths/refresh-token`, {
                refreshToken: localStorage.getItem('refreshToken'),
                token: localStorage.getItem('token'),
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
        setIsAuthenticated(false);
        setUserId('');
        setRole('');
        localStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
    };

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, role, login, logout, refreshToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
