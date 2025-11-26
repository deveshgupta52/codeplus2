import React, { useState, useEffect, useRef } from 'react';
import * as questionApi from '../../api/questionApi';
import * as categoryApi from '../../api/categoryApi';
import { FiLoader } from 'react-icons/fi';

const formInputClass = "w-full px-3 py-2 mt-1 text-foreground bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
const formLabelClass = "block text-sm font-medium text-muted-foreground";

const CreateQuestionForm = ({ onSuccess }) => {
    const formRef = useRef(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [category, setCategory] = useState('');
    const [visibleTestCases, setVisibleTestCases] = useState('[\n  {\n    "input": "",\n    "output": ""\n  }\n]');
    const [hiddenTestCases, setHiddenTestCases] = useState('[\n  {\n    "input": "",\n    "output": ""\n  }\n]');
    const [starterCode, setStarterCode] = useState({ cpp: '', python: '', java: '', javascript: '' });
    const [driverCode, setDriverCode] = useState({ cpp: '', python: '', java: '', javascript: '' });
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
            } catch (error) { console.error("Failed fetch categories", error); }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); setStatus({ message: '', type: '' });
        if (!category) { setStatus({ message: 'Select category.', type: 'error' }); return; }
        setIsLoading(true);
        try {
            await questionApi.createQuestion({
                title, description, difficulty, category,
                visibleTestCases, hiddenTestCases,
                starterCode, driverCode, image
            });
            // Reset form
            setTitle(''); setDescription(''); setDifficulty('Easy');
            setVisibleTestCases('[\n  {\n    "input": "",\n    "output": ""\n  }\n]');
            setHiddenTestCases('[\n  {\n    "input": "",\n    "output": ""\n  }\n]');
            setStarterCode({ cpp: '', python: '', java: '', javascript: '' });
            setDriverCode({ cpp: '', python: '', java: '', javascript: '' });
            setImage(null); if (formRef.current) formRef.current.reset();
            if (onSuccess) onSuccess();
        } catch (error) { setStatus({ message: error.response?.data?.message || 'Failed.', type: 'error' }); }
        finally { setIsLoading(false); }
    };

    const handleStarterCodeChange = (lang, value) => setStarterCode(prev => ({ ...prev, [lang]: value }));
    const handleDriverCodeChange = (lang, value) => setDriverCode(prev => ({ ...prev, [lang]: value }));

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-6 rounded-lg">
            {status.message && <div className={`p-3 rounded-md text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>{status.message}</div>}
            <div><label htmlFor="title" className={formLabelClass}>Title</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={formInputClass} disabled={isLoading} /></div>
            <div><label htmlFor="description" className={formLabelClass}>Description (HTML allowed)</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="10" className={formInputClass} disabled={isLoading}></textarea><p className="mt-1 text-xs text-muted-foreground">Use tags like <code>&lt;strong&gt;</code>, <code>&lt;code&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;br&gt;</code>.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="difficulty" className={formLabelClass}>Difficulty</label><select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={formInputClass} disabled={isLoading}><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
                <div><label htmlFor="category" className={formLabelClass}>Category</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className={formInputClass} disabled={isLoading}><option value="" disabled>Select</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            </div>

            {/* Starter Code */}
            <div className="space-y-4 border-t border-border pt-4">
                 <h3 className={formLabelClass}>Starter Code Snippets</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label htmlFor="starter-python" className="text-xs text-muted-foreground">Python</label><textarea id="starter-python" value={starterCode.python} onChange={(e) => handleStarterCodeChange('python', e.target.value)} rows="5" className={`${formInputClass} font-mono text-xs`} disabled={isLoading} placeholder="def solve():&#10;  # USER_CODE_HERE"></textarea></div>
                     <div><label htmlFor="starter-javascript" className="text-xs text-muted-foreground">JavaScript</label><textarea id="starter-javascript" value={starterCode.javascript} onChange={(e) => handleStarterCodeChange('javascript', e.target.value)} rows="5" className={`${formInputClass} font-mono text-xs`} disabled={isLoading} placeholder="function solve() {&#10;  // USER_CODE_HERE&#10;}"></textarea></div>
                     <div><label htmlFor="starter-cpp" className="text-xs text-muted-foreground">C++</label><textarea id="starter-cpp" value={starterCode.cpp} onChange={(e) => handleStarterCodeChange('cpp', e.target.value)} rows="5" className={`${formInputClass} font-mono text-xs`} disabled={isLoading} placeholder="// USER_CODE_HERE"></textarea></div>
                     <div><label htmlFor="starter-java" className="text-xs text-muted-foreground">Java</label><textarea id="starter-java" value={starterCode.java} onChange={(e) => handleStarterCodeChange('java', e.target.value)} rows="5" className={`${formInputClass} font-mono text-xs`} disabled={isLoading} placeholder="// USER_CODE_HERE"></textarea></div>
                 </div>
            </div>

            {/* Driver Code */}
            <div className="space-y-4 border-t border-border pt-4">
                 <h3 className={formLabelClass}>Driver Code (Testing Harness)</h3>
                  <p className="text-xs text-muted-foreground">Wraps user code. Use placeholder: <code># USER_CODE_HERE</code> or <code>// USER_CODE_HERE</code>.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label htmlFor="driver-python" className="text-xs text-muted-foreground">Python</label><textarea id="driver-python" value={driverCode.python} onChange={(e) => handleDriverCodeChange('python', e.target.value)} rows="8" className={`${formInputClass} font-mono text-xs`} disabled={isLoading} placeholder="import sys&#10;# USER_CODE_HERE&#10;print(solve(...))"></textarea></div>
                     <div><label htmlFor="driver-javascript" className="text-xs text-muted-foreground">JavaScript</label><textarea id="driver-javascript" value={driverCode.javascript} onChange={(e) => handleDriverCodeChange('javascript', e.target.value)} rows="8" className={`${formInputClass} font-mono text-xs`} disabled={isLoading} placeholder="// Read stdin&#10;// USER_CODE_HERE&#10;console.log(solve(...))"></textarea></div>
                     <div><label htmlFor="driver-cpp" className="text-xs text-muted-foreground">C++</label><textarea id="driver-cpp" value={driverCode.cpp} onChange={(e) => handleDriverCodeChange('cpp', e.target.value)} rows="8" className={`${formInputClass} font-mono text-xs`} disabled={isLoading} placeholder="#include <iostream>&#10;// USER_CODE_HERE&#10;int main() { ... }"></textarea></div>
                     <div><label htmlFor="driver-java" className="text-xs text-muted-foreground">Java</label><textarea id="driver-java" value={driverCode.java} onChange={(e) => handleDriverCodeChange('java', e.target.value)} rows="8" className={`${formInputClass} font-mono text-xs`} disabled={isLoading} placeholder="class Main {&#10;  // USER_CODE_HERE ...&#10;}"></textarea></div>
                 </div>
            </div>

            <div><label htmlFor="image" className={formLabelClass}>Example Image (Optional)</label><input id="image" type="file" onChange={(e) => setImage(e.target.files[0])} className={`${formInputClass} file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20`} disabled={isLoading} /></div>
            <div><label htmlFor="visibleTestCases" className={formLabelClass}>Visible Test Cases (JSON)</label><textarea id="visibleTestCases" value={visibleTestCases} onChange={(e) => setVisibleTestCases(e.target.value)} required rows="6" className={`${formInputClass} font-mono text-sm`} disabled={isLoading}></textarea></div>
            <div><label htmlFor="hiddenTestCases" className={formLabelClass}>Hidden Test Cases (JSON)</label><textarea id="hiddenTestCases" value={hiddenTestCases} onChange={(e) => setHiddenTestCases(e.target.value)} required rows="6" className={`${formInputClass} font-mono text-sm`} disabled={isLoading}></textarea></div>
            <button type="submit" className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2" disabled={isLoading}>
                 {isLoading ? <FiLoader className="animate-spin h-5 w-5" /> : null}
                {isLoading ? 'Creating...' : 'Create Question'}
            </button>
        </form>
    );
};
export default CreateQuestionForm;