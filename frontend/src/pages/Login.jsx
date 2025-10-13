import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
    };

    return (
        <div className="flex justify-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-sm">
                <h1 className="text-3xl font-bold text-center text-card-foreground">Login</h1>
                {error && <p className="text-destructive-foreground bg-destructive/80 rounded-md p-3 text-center text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                               className="w-full px-3 py-2 mt-1 text-foreground bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-muted-foreground">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                               className="w-full px-3 py-2 mt-1 text-foreground bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <button type="submit" className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
                        Login
                    </button>
                </form>
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};
export default Login;