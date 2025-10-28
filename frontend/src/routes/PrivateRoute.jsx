import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    const isAuthorized = user && allowedRoles?.includes(user.role);

    return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;