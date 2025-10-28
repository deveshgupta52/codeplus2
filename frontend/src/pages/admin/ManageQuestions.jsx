import React, { useState, useEffect } from 'react';
import CreateQuestionForm from '../../components/admin/CreateQuestionForm';
import * as questionApi from '../../api/questionApi';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import EditQuestionModal from '../../components/admin/EditQuestionModal';

const ManageQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState({ message: '', type: '' });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState(null);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const { data } = await questionApi.getQuestions();
            setQuestions(data);
        } catch (err) {
            setError('Failed to fetch questions.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);
    
    const openDeleteModal = (question) => {
        setQuestionToDelete(question);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!questionToDelete) return;
        setStatus({ message: '', type: '' });
        try {
            await questionApi.deleteQuestion(questionToDelete._id);
            setStatus({ message: 'Question deleted successfully!', type: 'success' });
            fetchQuestions();
        } catch (err) {
            setStatus({ message: err.response?.data?.message || 'Failed to delete question.', type: 'error' });
        } finally {
            setIsDeleteModalOpen(false);
            setQuestionToDelete(null);
        }
    };
    
    const openEditModal = (question) => {
        setQuestionToEdit(question);
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Manage Questions</h1>
                <p className="text-muted-foreground mt-2">
                    Create, view, edit, and delete all coding problems.
                </p>
            </div>

            {status.message && <div className={`p-3 rounded-md text-sm font-medium text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>{status.message}</div>}

            <div className="bg-card border border-border rounded-lg">
                 <table className="w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="p-4 font-semibold">Title</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Difficulty</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="4" className="text-center p-4 text-muted-foreground">Loading questions...</td></tr>
                        ) : questions.map(q => (
                            <tr key={q._id} className="border-b last:border-none">
                                <td className="p-4 font-medium">{q.title}</td>
                                <td className="p-4 text-muted-foreground">{q.category?.name || 'N/A'}</td>
                                <td className="p-4 text-muted-foreground">{q.difficulty}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => openEditModal(q)} className="p-2 text-muted-foreground hover:text-primary" title="Edit">
                                        <FiEdit />
                                    </button>
                                    <button onClick={() => openDeleteModal(q)} className="p-2 text-muted-foreground hover:text-destructive" title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                 <h2 className="text-2xl font-semibold mb-4">Create New Question</h2>
                 <CreateQuestionForm />
            </div>

            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Question"
                message={`Are you sure you want to delete the question "${questionToDelete?.title}"? This is permanent.`}
            />
            <EditQuestionModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                question={questionToEdit}
                onSaved={() => {
                    fetchQuestions();
                    setIsEditModalOpen(false);
                }}
            />
        </div>
    );
};

export default ManageQuestions;