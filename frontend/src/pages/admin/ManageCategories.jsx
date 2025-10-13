import React, { useState, useEffect } from 'react';
import * as categoryApi from '../../api/categoryApi';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState({ message: '', type: '' });
    
    // State for creating/editing
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    // State for confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const { data } = await categoryApi.getCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch categories.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });
        try {
            await categoryApi.createCategory({ name: newCategoryName });
            setNewCategoryName('');
            setStatus({ message: 'Category created successfully!', type: 'success' });
            fetchCategories();
        } catch (err) {
            setStatus({ message: err.response?.data?.message || 'Failed to create category.', type: 'error' });
        }
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });
        try {
            await categoryApi.updateCategory(editingCategory._id, { name: editingCategory.name });
            setEditingCategory(null);
            setStatus({ message: 'Category updated successfully!', type: 'success' });
            fetchCategories();
        } catch (err) {
            setStatus({ message: err.response?.data?.message || 'Failed to update category.', type: 'error' });
        }
    };
    
    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        setStatus({ message: '', type: '' });
        try {
            await categoryApi.deleteCategory(categoryToDelete._id);
            setStatus({ message: 'Category deleted successfully!', type: 'success' });
            fetchCategories();
        } catch (err) {
            setStatus({ message: err.response?.data?.message || 'Failed to delete category.', type: 'error' });
        } finally {
            setIsModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
            
            {status.message && <div className={`mb-4 p-3 rounded-md text-sm font-medium text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>{status.message}</div>}
            <form onSubmit={handleCreate} className="mb-8 p-4 bg-card border border-border rounded-lg flex gap-4 items-end">
                <div className="flex-grow">
                    <label htmlFor="newCategory" className="block text-sm font-medium text-muted-foreground">New Category Name</label>
                    <input id="newCategory" type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required className="w-full mt-1 px-3 py-2 text-foreground bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <button type="submit" className="flex items-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"><FiPlus /> Create</button>
            </form>

            {/* Categories List */}
            <div className="bg-card border border-border rounded-lg">
                <table className="w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="2" className="text-center p-4 text-muted-foreground">Loading...</td></tr>
                        ) : categories.map(cat => (
                            <tr key={cat._id} className="border-b last:border-none">
                                <td className="p-4">
                                    {editingCategory?._id === cat._id ? (
                                        <form onSubmit={handleUpdate} className="flex gap-2">
                                            <input type="text" value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} className="w-full px-2 py-1 text-foreground bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
                                            <button type="submit" className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">Save</button>
                                            <button type="button" onClick={() => setEditingCategory(null)} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">Cancel</button>
                                        </form>
                                    ) : cat.name}
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setEditingCategory({...cat})} className="p-2 text-muted-foreground hover:text-primary"><FiEdit /></button>
                                    <button onClick={() => openDeleteModal(cat)} className="p-2 text-muted-foreground hover:text-destructive"><FiTrash2 /></button>
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
                title="Delete Category"
                message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default ManageCategories;