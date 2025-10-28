import api from './api';

export const getCategories = () => api.get('/api/categories');
export const createCategory = (categoryData) => api.post('/api/categories', categoryData);
export const updateCategory = (id, categoryData) => api.put(`/api/categories/${id}`, categoryData);
export const deleteCategory = (id) => api.delete(`/api/categories/${id}`);