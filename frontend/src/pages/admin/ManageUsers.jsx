import React, { useState, useEffect } from 'react';
import * as userApi from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import { FiTrash2 } from 'react-icons/fi';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const ManageUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState({ message: '', type: '' });

    // State for confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const { data } = await userApi.getUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        setStatus({ message: '', type: '' });
        try {
            await userApi.updateUserRole(userId, newRole);
            setStatus({ message: 'User role updated successfully!', type: 'success' });
            fetchUsers();
        } catch (err) {
            setStatus({ message: err.response?.data?.message || 'Failed to update role.', type: 'error' });
        }
    };
    
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        setStatus({ message: '', type: '' });
        try {
            await userApi.deleteUser(userToDelete._id);
            setStatus({ message: 'User deleted successfully!', type: 'success' });
            fetchUsers();
        } catch (err) {
            setStatus({ message: err.response?.data?.message || 'Failed to delete user.', type: 'error' });
        } finally {
            setIsModalOpen(false);
            setUserToDelete(null);
        }
    };

    const roleTagColors = {
        user: 'bg-blue-500/10 text-blue-500',
        admin: 'bg-yellow-500/10 text-yellow-500',
        superadmin: 'bg-red-500/10 text-red-500',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            
            {status.message && <div className={`mb-4 p-3 rounded-md text-sm font-medium text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>{status.message}</div>}
            
            <div className="bg-card border border-border rounded-lg">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center p-4 text-muted-foreground">Loading users...</td></tr>
                        ) : users.map(user => (
                            <tr key={user._id} className="border-b last:border-none">
                                <td className="p-4 font-medium">{user.name}</td>
                                <td className="p-4 text-muted-foreground">{user.email}</td>
                                <td className="p-4">
                                    {/* Prevent changing own role or a superadmin's role */}
                                    {currentUser.id === user._id || user.role === 'superadmin' ? (
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleTagColors[user.role]}`}>{user.role}</span>
                                    ) : (
                                        <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {currentUser.id !== user._id && user.role !== 'superadmin' && (
                                        <button onClick={() => openDeleteModal(user)} className="p-2 text-muted-foreground hover:text-destructive"><FiTrash2 /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action is permanent.`}
            />
        </div>
    );
};

export default ManageUsers;