import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiPlusSquare, FiTag, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { isSuperAdmin } = useAuth();
    const linkClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
    const activeLinkClasses = "bg-muted text-primary";

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-6">
                    <NavLink to="/admin" className="flex items-center gap-2 font-semibold">
                        <span className="">Admin Panel</span>
                    </NavLink>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <NavLink to="/admin" end className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
                            <FiGrid className="h-4 w-4" />
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/questions" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
                            <FiPlusSquare className="h-4 w-4" />
                            Questions
                        </NavLink>
                        <NavLink to="/admin/categories" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
                            <FiTag className="h-4 w-4" />
                            Categories
                        </NavLink>
                        {/* Only Super Admins can see the Users link */}
                        {isSuperAdmin && (
                            <NavLink to="/admin/users" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ""}`}>
                                <FiUsers className="h-4 w-4" />
                                Users
                            </NavLink>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;