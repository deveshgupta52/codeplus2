import React, { useState, useEffect, useRef } from 'react';
import * as questionApi from '../../api/questionApi';
import * as categoryApi from '../../api/categoryApi';
import { FiX, FiLoader } from 'react-icons/fi';

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
    const [starterCode, setStarterCode] = useState({ cpp: '', python: '', java: '', javascript: '' });
    const [driverCode, setDriverCode] = useState({ cpp: '', python: '', java: '', javascript: '' });
    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (question) {
            setTitle(question.title); setDescription(question.description); setDifficulty(question.difficulty);
            setCategory(question.category?._id || '');
            setVisibleTestCases(JSON.stringify(question.visibleTestCases || [], null, 2));
            setHiddenTestCases(JSON.stringify(question.hiddenTestCases || [], null, 2));
            setStarterCode(question.starterCode || { cpp: '', python: '', java: '', javascript: '' });
            setDriverCode(question.driverCode || { cpp: '', python: '', java: '', javascript: '' });
            setCurrentImageUrl(question.image?.url || ''); setImage(null); setStatus({ message: '', type: '' });
        }
    }, [question]);

    useEffect(() => {
        const fetchCategories = async () => {
             try {
                const { data } = await categoryApi.getCategories();
                setCategories(data);
                // Ensure the current category remains selected after fetching
                if (question && question.category) setCategory(question.category._id);
            } catch (error) { console.error("Failed fetch categories", error); }
        };
        if (isOpen) fetchCategories();
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [isOpen]); // Only fetch when modal opens

    const handleSubmit = async (e) => {
        e.preventDefault(); setStatus({ message: '', type: '' }); setIsLoading(true);
        try {
            await questionApi.updateQuestion(question._id, {
                 title, description, difficulty, category,
                 visibleTestCases, hiddenTestCases,
                 starterCode, driverCode, image
            });
            setStatus({ message: 'Updated!', type: 'success' }); onSaved();
            // setTimeout(onClose, 1000);
        } catch (error) { setStatus({ message: error.response?.data?.message || 'Failed.', type: 'error' }); }
        finally { setIsLoading(false); }
    };

    const handleStarterCodeChange = (lang, value) => setStarterCode(prev => ({ ...prev, [lang]: value }));
    const handleDriverCodeChange = (lang, value) => setDriverCode(prev => ({ ...prev, [lang]: value }));

    if (!isOpen || !question) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-lg shadow-lg flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-foreground">Edit Question: {question.title}</h2>
                    <button onClick={onClose} disabled={isLoading} className="p-1 rounded-full hover:bg-muted disabled:opacity-50"><FiX className="h-5 w-5 text-muted-foreground" /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 p-6">
                        {status.message && <div className={`p-3 rounded-md text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>{status.message}</div>}
                        <div><label htmlFor="edit-title" className={formLabelClass}>Title</label><input id="edit-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={formInputClass} disabled={isLoading} /></div>
                        <div><label htmlFor="edit-description" className={formLabelClass}>Description</label><textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="10" className={formInputClass} disabled={isLoading}></textarea></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="edit-difficulty" className={formLabelClass}>Difficulty</label><select id="edit-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={formInputClass} disabled={isLoading}><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
                            <div><label htmlFor="edit-category" className={formLabelClass}>Category</label><select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)} required className={formInputClass} disabled={isLoading}><option value="" disabled>Select</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                        </div>

                        {/* Starter Code */}
                         <div className="space-y-4 border-t border-border pt-4">
                             <h3 className={formLabelClass}>Starter Code Snippets</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div><label htmlFor="edit-starter-python" className="text-xs text-muted-foreground">Python</label><textarea id="edit-starter-python" value={starterCode.python} onChange={(e) => handleStarterCodeChange('python', e.target.value)} rows="5" className={`${formInputClass} font-mono text-xs`} disabled={isLoading}></textarea></div>
                                 <div><label htmlFor="edit-starter-javascript" className="text-xs text-muted-foreground">JavaScript</label><textarea id="edit-starter-javascript" value={starterCode.javascript} onChange={(e) => handleStarterCodeChange('javascript', e.target.value)} rows="5" className={`${formInputClass} font-mono text-xs`} disabled={isLoading}></textarea></div>
                                 <div><label htmlFor="edit-starter-cpp" className="text-xs text-muted-foreground">C++</label><textarea id="edit-starter-cpp" value={starterCode.cpp} onChange={(e) => handleStarterCodeChange('cpp', e.target.value)} rows="5" className={`${formInputClass} font-mono text-xs`} disabled={isLoading}></textarea></div>
                                 <div><label htmlFor="edit-starter-java" className="text-xs text-muted-foreground">Java</label><textarea id="edit-starter-java" value={starterCode.java} onChange={(e) => handleStarterCodeChange('java', e.target.value)} rows="5" className={`${formInputClass} font-mono text-xs`} disabled={isLoading}></textarea></div>
                             </div>
                        </div>

                         {/* Driver Code */}
                        <div className="space-y-4 border-t border-border pt-4">
                             <h3 className={formLabelClass}>Driver Code (Testing Harness)</h3>
                             <p className="text-xs text-muted-foreground">Use placeholders like <code># USER_CODE_HERE</code>.</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div><label htmlFor="edit-driver-python" className="text-xs text-muted-foreground">Python</label><textarea id="edit-driver-python" value={driverCode.python} onChange={(e) => handleDriverCodeChange('python', e.target.value)} rows="8" className={`${formInputClass} font-mono text-xs`} disabled={isLoading}></textarea></div>
                                 <div><label htmlFor="edit-driver-javascript" className="text-xs text-muted-foreground">JavaScript</label><textarea id="edit-driver-javascript" value={driverCode.javascript} onChange={(e) => handleDriverCodeChange('javascript', e.target.value)} rows="8" className={`${formInputClass} font-mono text-xs`} disabled={isLoading}></textarea></div>
                                 <div><label htmlFor="edit-driver-cpp" className="text-xs text-muted-foreground">C++</label><textarea id="edit-driver-cpp" value={driverCode.cpp} onChange={(e) => handleDriverCodeChange('cpp', e.target.value)} rows="8" className={`${formInputClass} font-mono text-xs`} disabled={isLoading}></textarea></div>
                                 <div><label htmlFor="edit-driver-java" className="text-xs text-muted-foreground">Java</label><textarea id="edit-driver-java" value={driverCode.java} onChange={(e) => handleDriverCodeChange('java', e.target.value)} rows="8" className={`${formInputClass} font-mono text-xs`} disabled={isLoading}></textarea></div>
                             </div>
                        </div>

                        <div><label htmlFor="edit-image" className={formLabelClass}>New Image?</label><input id="edit-image" type="file" onChange={(e) => setImage(e.target.files[0])} className={`${formInputClass} file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20`} disabled={isLoading} /> {currentImageUrl && !image && <img src={currentImageUrl} alt="Current" className="mt-2 h-24 w-auto rounded border p-1" />} <p className="mt-1 text-xs text-muted-foreground">Upload replaces current.</p></div>
                        <div><label htmlFor="edit-visibleTestCases" className={formLabelClass}>Visible JSON</label><textarea id="edit-visibleTestCases" value={visibleTestCases} onChange={(e) => setVisibleTestCases(e.target.value)} required rows="6" className={`${formInputClass} font-mono text-sm`} disabled={isLoading}></textarea></div>
                        <div><label htmlFor="edit-hiddenTestCases" className={formLabelClass}>Hidden JSON</label><textarea id="edit-hiddenTestCases" value={hiddenTestCases} onChange={(e) => setHiddenTestCases(e.target.value)} required rows="6" className={`${formInputClass} font-mono text-sm`} disabled={isLoading}></textarea></div>

                        <div className="flex justify-end pt-4 border-t gap-2">
                             <button type="button" onClick={onClose} disabled={isLoading} className="py-2 px-4 bg-secondary text-secondary-foreground rounded-md font-semibold hover:bg-secondary/80 transition-colors disabled:opacity-50">Cancel</button>
                             <button type="submit" className="py-2.5 px-6 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2" disabled={isLoading}>
                                 {isLoading ? <FiLoader className="animate-spin h-5 w-5" /> : null}
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