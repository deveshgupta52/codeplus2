import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
                Welcome back, {user?.name || 'Admin'}. Here you can manage the platform.
            </p>
        </div>
    );
};

export default AdminDashboard;