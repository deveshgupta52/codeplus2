import React, { useState, useEffect, useRef } from 'react';
import * as questionApi from '../../api/questionApi';
import * as categoryApi from '../../api/categoryApi';
import { FiX } from 'react-icons/fi';

const formInputClass = "w-full px-3 py-2 mt-1 text-foreground bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const formLabelClass = "block text-sm font-medium text-muted-foreground";

const EditQuestionModal = ({ isOpen, onClose, question, onSaved }) => {
    const formRef = useRef(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [category, setCategory] = useState('');
    const [visibleTestCases, setVisibleTestCases] = useState('');
    const [hiddenTestCases, setHiddenTestCases] = useState('');
    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (question) {
            setTitle(question.title);
            setDescription(question.description);
            setDifficulty(question.difficulty);
            setCategory(question.category._id);
            setVisibleTestCases(JSON.stringify(question.visibleTestCases, null, 2));
            setHiddenTestCases(JSON.stringify(question.hiddenTestCases, null, 2));
            setCurrentImageUrl(question.image?.url || '');
        }
    }, [question]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await categoryApi.getCategories();
                setCategories(data);
            } catch (error) { console.error("Failed to fetch categories", error); }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });
        setIsLoading(true);
        try {
            await questionApi.updateQuestion(question._id, { title, description, difficulty, category, visibleTestCases, hiddenTestCases, image });
            setStatus({ message: 'Question updated successfully!', type: 'success' });
            onSaved();
            setTimeout(onClose, 1000);
        } catch (error) {
            setStatus({ message: error.response?.data?.message || 'Failed to update question.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-lg shadow-lg flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-foreground">Edit Question: {question.title}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-muted"><FiX className="h-5 w-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        {status.message && <div className={`p-3 rounded-md text-sm font-medium text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>{status.message}</div>}
                        
                        <div>
                            <label htmlFor="edit-title" className={formLabelClass}>Title</label>
                            <input id="edit-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={formInputClass} disabled={isLoading} />
                        </div>
                        
                        <div>
                            <label htmlFor="edit-description" className={formLabelClass}>Description</label>
                            <textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="10" className={formInputClass} disabled={isLoading}></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="edit-difficulty" className={formLabelClass}>Difficulty</label><select id="edit-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={formInputClass} disabled={isLoading}><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
                            <div><label htmlFor="edit-category" className={formLabelClass}>Category</label><select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)} required className={formInputClass} disabled={isLoading}><option value="" disabled>Select category</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                        </div>
                        
                        <div>
                            <label htmlFor="edit-image" className={formLabelClass}>New Example Image (Optional)</label>
                            <input id="edit-image" type="file" onChange={(e) => setImage(e.target.files[0])} className={`${formInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20`} disabled={isLoading} />
                            {currentImageUrl && !image && <img src={currentImageUrl} alt="Current" className="mt-2 h-24 w-auto rounded border p-1" />}
                            <p className="mt-2 text-xs text-muted-foreground">Uploading a new image will replace the current one.</p>
                        </div>
                        
                        <div><label htmlFor="edit-visibleTestCases" className={formLabelClass}>Visible Test Cases (JSON)</label><textarea id="edit-visibleTestCases" value={visibleTestCases} onChange={(e) => setVisibleTestCases(e.target.value)} required rows="6" className={`${formInputClass} font-mono text-sm`} disabled={isLoading}></textarea></div>
                        <div><label htmlFor="edit-hiddenTestCases" className={formLabelClass}>Hidden Test Cases (JSON)</label><textarea id="edit-hiddenTestCases" value={hiddenTestCases} onChange={(e) => setHiddenTestCases(e.target.value)} required rows="6" className={`${formInputClass} font-mono text-sm`} disabled={isLoading}></textarea></div>
                        
                        <div className="flex justify-end pt-4 border-t">
                             <button type="submit" className="w-full sm:w-auto py-2.5 px-6 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditQuestionModal;