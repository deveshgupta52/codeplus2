import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiPlusSquare, FiTag, FiUsers, FiArrowRight } from 'react-icons/fi';

const DashboardCard = ({ to, icon, title, description }) => {
    return (
        <Link 
            to={to} 
            className="group bg-card p-6 rounded-lg border border-border shadow-sm hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
            <div>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all duration-200">
                Go to page <FiArrowRight className="ml-1 h-4 w-4" />
            </div>
        </Link>
    );
};


const AdminDashboard = () => {
    const { user, isSuperAdmin } = useAuth();
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back, {user?.name || 'Admin'}. Here you can manage the platform.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard 
                    to="/admin/questions"
                    icon={<FiPlusSquare className="h-6 w-6" />}
                    title="Manage Questions"
                    description="Create, view, edit, and delete all coding problems."
                />
                <DashboardCard 
                    to="/admin/categories"
                    icon={<FiTag className="h-6 w-6" />}
                    title="Manage Categories"
                    description="Add, rename, and remove problem categories."
                />
                {isSuperAdmin && (
                    <DashboardCard 
                        to="/admin/users"
                        icon={<FiUsers className="h-6 w-6" />}
                        title="Manage Users"
                        description="View all users, manage roles, and administrate accounts."
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;