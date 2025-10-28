import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('accessToken');
                } else {
                    setUser({ id: decoded.id, role: decoded.role });
                }
            } catch (error) {
                localStorage.removeItem('accessToken');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const { data } = await authApi.loginUser(credentials);
        localStorage.setItem('accessToken', data.accessToken);
        const decoded = jwtDecode(data.accessToken);
        setUser({ id: decoded.id, role: decoded.role });
    };

    const logout = async () => {
        try { await authApi.logoutUser(); }
        catch (error) { console.error("Logout API failed.", error); }
        finally {
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAdmin: user && (user.role === 'admin' || user.role === 'superadmin'),
        isSuperAdmin: user && user.role === 'superadmin',
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};