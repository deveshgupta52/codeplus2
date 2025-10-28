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
        // <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        //     <div className="container mx-auto px-4">
        //         <nav className="h-16 flex justify-between items-center">
        //             <div className="flex items-center gap-6">
        //                 {/* --- MODIFIED: Added text-glow class --- */}
        //                 <Link to="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors text-glow">
        //                     Code++
        //                 </Link>
        //                 <NavLink
        //                     to="/questions"
        //                     className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ""}`}
        //                 >
        //                     Problems
        //                 </NavLink>
        //             </div>
        //             <div className="flex items-center space-x-4">
        //                 <div className="relative">
        //                     <select
        //                         value={themeId}
        //                         onChange={(e) => setThemeId(e.target.value)}
        //                         className="appearance-none bg-secondary text-secondary-foreground rounded-md pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        //                         aria-label="Select theme"
        //                     >
        //                         {themes.map(theme => (
        //                             <option key={theme.id} value={theme.id}>{theme.name}</option>
        //                         ))}
        //                     </select>
        //                     <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        //                 </div>
        //                 {user ? (
        //                     <>
        //                         {isAdmin && <Link to="/admin" className={navLinkClasses}>Admin</Link>}
        //                         <button onClick={handleLogout} className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-semibold hover:bg-destructive/90 transition-colors">Logout</button>
        //                     </>
        //                 ) : (
        //                     <>
        //                         <Link to="/login" className={navLinkClasses}>Login</Link>
        //                         <Link to="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors">Sign Up</Link>
        //                     </>
        //                 )}
        //             </div>
        //         </nav>
        //     </div>
        // </header>
        <header className='h-[3.75rem]  flex justify-between align-center backdrop-blur-sm p-2 bg-gradient-to-r to-white/20 from-gray-400/10 rounded'>
              <div className='h-full w-[8rem]  flex items-center justify-center' >
                <h4 className='text-white font-myfont text-xl'>Code++</h4>
              </div>
              <div className='h-full w-[60rem]  rounded '>

              </div>
        </header>
    );
};

export default Navbar;