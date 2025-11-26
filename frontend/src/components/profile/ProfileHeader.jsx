import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfileHeader = () => {
    const { user } = useAuth();
    
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

    return (
        <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{userInitial}</span>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name || 'User'}!</h1>
                <p className="text-sm text-muted-foreground">Here's a summary of your progress. Keep it up!</p>
            </div>
        </div>
    );
};

export default ProfileHeader;