import React, { useState, useEffect, useRef } from 'react';
import * as questionApi from '../../api/questionApi';
import * as categoryApi from '../../api/categoryApi';

const formInputClass = "w-full px-3 py-2 mt-1 text-foreground bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const formLabelClass = "block text-sm font-medium text-muted-foreground";

const CreateQuestionForm = () => {
    const formRef = useRef(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [category, setCategory] = useState('');
    const [visibleTestCases, setVisibleTestCases] = useState('[\n  {\n    "input": "",\n    "output": ""\n  }\n]');
    const [hiddenTestCases, setHiddenTestCases] = useState('[\n  {\n    "input": "",\n    "output": ""\n  }\n]');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await categoryApi.getCategories();
                setCategories(data);
                if (data.length > 0) setCategory(data[0]._id);
            } catch (error) { console.error("Failed to fetch categories", error); }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });
        if (!category) { setStatus({ message: 'Please select a category.', type: 'error' }); return; }

        setIsLoading(true);

        try {
            await questionApi.createQuestion({ title, description, difficulty, category, visibleTestCases, hiddenTestCases, image });
            setStatus({ message: 'Question created successfully!', type: 'success' });
            
            setTitle('');
            setDescription('');
            setDifficulty('Easy');
            setVisibleTestCases('[\n  {\n    "input": "",\n    "output": ""\n  }\n]');
            setHiddenTestCases('[\n  {\n    "input": "",\n    "output": ""\n  }\n]');
            setImage(null);
            if (formRef.current) {
                formRef.current.reset();
            }

        } catch (error) { 
            setStatus({ message: error.response?.data?.message || 'Failed to create question.', type: 'error' }); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6 rounded-lg">
            {status.message && <div className={`p-3 rounded-md text-sm font-medium text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>{status.message}</div>}
            
            <div>
                <label htmlFor="title" className={formLabelClass}>Title</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={formInputClass} disabled={isLoading} />
            </div>
            
            <div>
                <label htmlFor="description" className={formLabelClass}>Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="10" className={formInputClass} disabled={isLoading}></textarea>
                <p className="mt-2 text-xs text-muted-foreground">
                    You can use HTML tags like <code>&lt;strong&gt;</code>, <code>&lt;code&gt;</code>, <code>&lt;ul&gt;</code>, and <code>&lt;br&gt;</code> for formatting.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="difficulty" className={formLabelClass}>Difficulty</label><select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={formInputClass} disabled={isLoading}><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
                <div><label htmlFor="category" className={formLabelClass}>Category</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className={formInputClass} disabled={isLoading}><option value="" disabled>Select category</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            </div>
            
            <div><label htmlFor="image" className={formLabelClass}>Example Image (Optional)</label><input id="image" type="file" onChange={(e) => setImage(e.target.files[0])} className={`${formInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20`} disabled={isLoading} /></div>
            
            <div><label htmlFor="visibleTestCases" className={formLabelClass}>Visible Test Cases (JSON)</label><textarea id="visibleTestCases" value={visibleTestCases} onChange={(e) => setVisibleTestCases(e.target.value)} required rows="6" className={`${formInputClass} font-mono text-sm`} disabled={isLoading}></textarea></div>
            
            <div><label htmlFor="hiddenTestCases" className={formLabelClass}>Hidden Test Cases (JSON)</label><textarea id="hiddenTestCases" value={hiddenTestCases} onChange={(e) => setHiddenTestCases(e.target.value)} required rows="6" className={`${formInputClass} font-mono text-sm`} disabled={isLoading}></textarea></div>
        
            <button type="submit" className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Question'}
            </button>
        </form>
    );
};

export default CreateQuestionForm;