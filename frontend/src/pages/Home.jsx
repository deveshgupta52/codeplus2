import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-teal-400">
                Welcome to Code++
            </h1>
            <p className="text-lg text-muted-foreground">
                The ultimate platform for honing your coding skills.
            </p>
            {user ? (
                <div className="mt-8">
                    <p className="text-lg">You are logged in. Let the coding challenges begin!</p>
                    <Link to="/questions" className="mt-4 inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors text-lg">
                        Browse Problems
                    </Link>
                </div>
            ) : (
                <div className="mt-8">
                    <Link to="/login" className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors text-lg">
                        Get Started
                    </Link>
                </div>
            )}
        </div>
    );
};
export default Home;