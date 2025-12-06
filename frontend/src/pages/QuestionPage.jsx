import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import { getQuestionById } from '../api/questionApi';
import { runCode, submitCode } from '../api/codeApi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiBarChart2, FiTag, FiPlay, FiLoader, FiTerminal, FiAlertTriangle, FiCheckCircle, FiChevronDown, FiUploadCloud } from 'react-icons/fi';
import ProblemDiscussion from '../components/ProblemDiscussion';

// Language Definitions
const LANGUAGES = [
    { id: 71, name: 'Python', monaco: 'python', key: 'python' },
    { id: 63, name: 'JavaScript', monaco: 'javascript', key: 'javascript' },
    { id: 54, name: 'C++', monaco: 'cpp', key: 'cpp' },
    { id: 62, name: 'Java', monaco: 'java', key: 'java' },
];

const QuestionPage = () => {
    const { id } = useParams();
    const { themeId } = useTheme();
    const { user } = useAuth(); // Get user from AuthContext
    const editorRef = useRef(null);

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
    const [editorCode, setEditorCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [runResults, setRunResults] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);
    const [activeTab, setActiveTab] = useState('testcases');

    // Fetch question data
    useEffect(() => {
        const fetchQuestion = async () => {
             try {
                setLoading(true);
                const { data } = await getQuestionById(id);
                setQuestion(data);
                
                const initialLang = LANGUAGES[0];
                const initialCode = data.starterCode?.[initialLang.key] || `// Starter code for ${initialLang.name} not available\n`;
                setEditorCode(initialCode);
                
            } catch (err) { setError('Failed to load the question.'); }
            finally { setLoading(false); }
        };
        fetchQuestion();
    }, [id]);

    // Update editor when language changes
    useEffect(() => {
        if (question?.starterCode) {
            const newCode = question.starterCode[selectedLanguage.key] || `// Starter code for ${selectedLanguage.name} not available\n`;
            setEditorCode(newCode);
        }
    }, [selectedLanguage, question]);

    const handleRunCode = async () => {
        if (!editorRef.current || !question) return;
        const source_code = editorRef.current.getValue();
        setIsRunning(true); setRunResults([]); setActiveTab('run');
        
        try {
            const { data } = await runCode(source_code, selectedLanguage.id, question._id);
            setRunResults(data.results || []);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to connect to the execution service.';
            setRunResults([{ status: { description: 'API Error' }, stderr: errorMsg, input: 'N/A', expected: 'N/A' }]);
        } finally { setIsRunning(false); }
    };

    const handleSubmitCode = async () => {
        if (!editorRef.current || !question) return;
        const source_code = editorRef.current.getValue();
        setIsSubmitting(true); setSubmitResult(null); setActiveTab('submit');
        
        try {
            const { data } = await submitCode(source_code, selectedLanguage.id, question._id);
            setSubmitResult(data);
        } catch (err) {
            setSubmitResult({ finalVerdict: 'API Error', failedCase: { result: { stderr: err.response?.data?.error || 'Failed to connect.' } } });
        } finally { setIsSubmitting(false); }
    };

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    const difficultyColors = { Easy: 'text-green-500', Medium: 'text-yellow-500', Hard: 'text-red-500' };

    if (loading) { return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><p className="text-muted-foreground">Loading...</p></div>; }
    if (error) { return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><p className="text-destructive">{error}</p></div>; }
    if (!question) { return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><p>Question not found.</p></div>; }

    const renderRunResults = () => {
        if (isRunning) return <div className="p-4 text-muted-foreground"><FiLoader className="animate-spin h-5 w-5 mr-2 inline" /> Running visible test cases...</div>;
        if (!runResults || runResults.length === 0) return <div className="p-4 text-muted-foreground italic">Click "Run" to test your code against the visible test cases.</div>;
        
        return (
            <div className="p-4 space-y-3">
                {runResults.map((result, index) => {
                    const isAccepted = result.status.id === 3 && result.stdout === result.expected;
                    const isWrongAnswer = result.status.id === 3 && result.stdout !== result.expected;
                    
                    let title = result.status.description;
                    let titleColor = 'text-foreground';
                    let icon = <FiTerminal className="h-5 w-5 mr-2" />;

                    if (isAccepted) {
                        title = 'Accepted'; titleColor = 'text-green-500'; icon = <FiCheckCircle className="h-5 w-5 mr-2" />;
                    } else if (isWrongAnswer) {
                        title = 'Wrong Answer'; titleColor = 'text-red-500'; icon = <FiAlertTriangle className="h-5 w-5 mr-2" />;
                    } else if (result.status.id > 3) { // Any kind of error
                        titleColor = 'text-red-500'; icon = <FiAlertTriangle className="h-5 w-5 mr-2" />;
                    }

                    return (
                        <details key={index} className="bg-muted/50 border border-border rounded-lg" open>
                            <summary className={`flex items-center cursor-pointer p-3 font-semibold ${titleColor}`}>
                                {icon} Case {index + 1}: {title}
                            </summary>
                            <div className="p-3 border-t border-border">
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground mb-1">Input:</h4>
                                    <pre className="text-xs font-mono bg-background p-2 rounded whitespace-pre-wrap"><code>{result.input}</code></pre>
                                </div>
                                <div className="mt-2">
                                    <h4 className="text-xs font-semibold text-muted-foreground mb-1">Expected Output:</h4>
                                    <pre className="text-xs font-mono bg-background p-2 rounded whitespace-pre-wrap"><code>{result.expected}</code></pre>
                                </div>
                                <div className="mt-2">
                                    <h4 className="text-xs font-semibold text-muted-foreground mb-1">Your Output:</h4>
                                    {result.stdout !== null && result.stdout !== undefined ? (
                                        <pre className={`text-xs font-mono bg-background p-2 rounded whitespace-pre-wrap ${isWrongAnswer ? 'text-red-500' : 'text-foreground'}`}><code>{result.stdout}</code></pre>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">No output (stdout).</p>
                                    )}
                                </div>
                                {result.stderr && (
                                    <div className="mt-2">
                                        <h4 className="text-xs font-semibold text-red-500 mb-1">Error (stderr):</h4>
                                        <pre className="text-xs font-mono bg-background text-red-500 p-2 rounded whitespace-pre-wrap"><code>{result.stderr}</code></pre>
                                    </div>
                                )}
                                <div className="flex gap-4 text-xs mt-2 text-muted-foreground">
                                    <span>Time: {result.time}s</span>
                                    <span>Memory: {result.memory ? (result.memory / 1024).toFixed(2) : 'N/A'} MB</span>
                                </div>
                            </div>
                        </details>
                    );
                })}
            </div>
        );
     };
     const renderSubmitResult = () => {
         if (isSubmitting) return <div className="p-4 text-muted-foreground"><FiLoader className="animate-spin h-5 w-5 mr-2 inline" /> Submitting & running all test cases...</div>;
         if (!submitResult) return <div className="p-4 text-muted-foreground italic">Click "Submit" to run your code against all hidden test cases.</div>;

         if (submitResult.finalVerdict === "Accepted") {
             return (
                 <div className="p-4">
                     <div className="flex items-center text-2xl font-semibold mb-2 text-green-500">
                         <FiCheckCircle className="h-7 w-7 mr-2" /> Accepted
                     </div>
                     <p className="text-muted-foreground">Congratulations! Your solution passed all test cases.</p>
                 </div>
             );
         }
         
         let title = submitResult.finalVerdict || "Error";
         let colorClass = "text-red-500";
         let content = (submitResult.failedCase?.result?.stderr) ||
                       (submitResult.failedCase?.result?.compile_output) ||
                       "An unknown error occurred.";

         if (title === "Wrong Answer") {
             content = `Input:\n${submitResult.failedCase.input}\n\nExpected:\n${submitResult.failedCase.expected}\n\nReceived:\n${submitResult.failedCase.received}`;
         } else if (title === "Time Limit Exceeded") {
              content = `Your solution took too long to run on test case ${submitResult.failedCase.case}.`;
         } else if (title === "Compilation Error") {
             colorClass = "text-yellow-500";
         } else if (title === "API Error") {
             content = submitResult.failedCase?.result?.stderr || "An API error occurred.";
         } else if (title === "Internal Server Error") {
             content = submitResult.failedCase?.result?.stderr || "An internal server error occurred.";
         }

         return (
             <div className="p-4">
                 <div className={`flex items-center text-2xl font-semibold mb-3 ${colorClass}`}>
                     <FiAlertTriangle className="h-7 w-7 mr-2" /> {title}
                 </div>
                 {submitResult.failedCase && submitResult.failedCase.case && <p className="text-sm font-semibold text-foreground mb-2">Failed on Test Case {submitResult.failedCase.case}</p>}
                 <pre className={`text-xs font-mono bg-muted/50 p-3 rounded whitespace-pre-wrap ${colorClass}`}>
                     <code>{content}</code>
                 </pre>
             </div>
         );
     };

    return (
        <div className="h-[calc(100vh-4rem)] border-t border-border">
            <PanelGroup direction="horizontal" className="h-full w-full">
                {/* Panel 1: Problem Description */}
                <Panel defaultSize={50} minSize={30}>
                    <div className="h-full overflow-y-auto p-6">
                        <h1 className="text-2xl font-bold text-foreground mb-4">{question.title}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`flex items-center gap-2 text-sm font-medium ${difficultyColors[question.difficulty]}`}><FiBarChart2 className="h-4 w-4" /><span>{question.difficulty}</span></div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><FiTag className="h-4 w-4" /><span>{question.category.name}</span></div>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:rounded" dangerouslySetInnerHTML={{ __html: question.description }} />
                        {question.image && question.image.url && ( <div className="mt-6"><h3 className="font-semibold mb-2">Example Image:</h3><img src={question.image.url} alt="Question example" className="rounded-lg border border-border max-w-full h-auto" /></div> )}
                        <section className="mt-8">
                          {user && <ProblemDiscussion problemId={id} />}
                        </section>
                    </div>
                </Panel>
                
                <PanelResizeHandle className="w-2 bg-transparent data-[resize-handle-state=hover]:bg-muted data-[resize-handle-state=drag]:bg-muted transition-colors" />
                
                {/* Panel 2: Editor, Input, Test Cases, Output */}
                <Panel defaultSize={50} minSize={30}>
                    <PanelGroup direction="vertical">
                        <Panel defaultSize={60} minSize={25}>
                            <div className="h-full w-full bg-background flex flex-col">
                                {/* Editor Controls Header */}
                                <div className="flex justify-between items-center px-4 py-2 border-b border-border">
                                    <div className="relative">
                                        <select
                                            value={selectedLanguage.id}
                                            onChange={(e) => { const lang = LANGUAGES.find(l => l.id === parseInt(e.target.value)); if (lang) setSelectedLanguage(lang); }}
                                            className="appearance-none bg-secondary text-secondary-foreground rounded-md pl-3 pr-8 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                                        >
                                            {LANGUAGES.map(lang => (<option key={lang.id} value={lang.id}>{lang.name}</option>))}
                                        </select>
                                        <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={handleRunCode} disabled={isRunning || isSubmitting} className="flex items-center gap-2 px-4 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50"> 
                                        {/* <button disabled={isRunning || isSubmitting} className="flex items-center gap-2 px-4 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50">  */}
                                            {isRunning ? <FiLoader className="animate-spin h-4 w-4" /> : <FiPlay className="h-4 w-4" />} {isRunning ? 'Running...' : 'Run'}
                                        </button>
                                        <button onClick={handleSubmitCode} disabled={isRunning || isSubmitting} className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50">
                                        {/* <button disabled={isRunning || isSubmitting} className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"> */}
                                            {isSubmitting ? <FiLoader className="animate-spin h-4 w-4" /> : <FiUploadCloud className="h-4 w-4" />} {isSubmitting ? 'Submitting...' : 'Submit'}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Editor
                                        key={selectedLanguage.id} 
                                        height="100%"
                                        theme={themeId}
                                        language={selectedLanguage.monaco}
                                        value={editorCode}
                                        options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, wordWrap: 'on' }}
                                        onMount={handleEditorDidMount}
                                        onChange={(value) => setEditorCode(value)}
                                    />
                                </div>
                            </div>
                        </Panel>
                        <PanelResizeHandle className="h-2 bg-transparent data-[resize-handle-state=hover]:bg-muted data-[resize-handle-state=drag]:bg-muted transition-colors" />
                        <Panel defaultSize={40} minSize={15}>
                            <div className="h-full flex flex-col">
                                <div className="flex border-b border-border">
                                    <button onClick={() => setActiveTab('testcases')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'testcases' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>Test Cases</button>
                                    <button onClick={() => setActiveTab('run')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'run' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>Run Result</button>
                                    <button onClick={() => setActiveTab('submit')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'submit' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>Submit Result</button>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {activeTab === 'testcases' && (
                                        <div className="p-4 space-y-4">
                                            <div className="space-y-3">
                                                {question.visibleTestCases.map((testCase, index) => (
                                                    <div key={index} className="bg-muted/50 p-3 rounded-md border border-border">
                                                        <p className="text-sm font-medium text-muted-foreground mb-1">Case {index + 1}</p>
                                                        <pre className="mt-1 text-xs font-mono bg-background p-2 rounded whitespace-pre-wrap"><code>{`Input:\n${testCase.input}\n\nExpected Output:\n${testCase.output}`}</code></pre>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'run' && renderRunResults()}
                                    {activeTab === 'submit' && renderSubmitResult()}
                                </div>
                            </div>
                        </Panel>
                    </PanelGroup>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default QuestionPage;