import api from './api';

export const getUsers = () => api.get('/api/users');
export const updateUserRole = (userId, role) => api.put(`/api/users/${userId}/role`, { role });
export const deleteUser = (userId) => api.delete(`/api/users/${userId}`);