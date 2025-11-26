import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { themeId, setThemeId, themes } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    const navLinkClasses = "font-medium text-muted-foreground hover:text-foreground transition-colors";
    const activeNavLinkClasses = "text-primary font-semibold";

    return (
        <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <nav className="h-16 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors text-glow">
                            Code++
                        </Link>
                        <NavLink
                            to="/questions"
                            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`}
                        >
                            Problems
                        </NavLink>
                    </div>
                    <div className="flex items-center space-x-4">

                        {user ? (
                            <>
                                <NavLink 
                                    to="/profile" 
                                    className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`}
                                >
                                    Profile
                                </NavLink>
                                {isAdmin && <Link to="/admin" className={navLinkClasses}>Admin</Link>}
                                <button onClick={handleLogout} className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-semibold hover:bg-destructive/90 transition-colors">Logout</button>
                            </>
                            
                        ) : (
                            <>
                                <Link to="/login" className={navLinkClasses}>Login</Link>
                                <Link to="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors">Sign Up</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;