import api from './api';

export const loginUser = (credentials) => api.post('/api/auth/login', credentials);
export const signupUser = (userData) => api.post('/api/auth/signup', userData);
export const logoutUser = () => api.post('/api/auth/logout');