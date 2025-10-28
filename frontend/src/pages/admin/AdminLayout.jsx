import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="grid min-h-[calc(100vh-4rem)] md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <AdminSidebar />
            <div className="flex flex-col">
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;