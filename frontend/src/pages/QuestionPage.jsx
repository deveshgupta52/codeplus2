import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor from "@monaco-editor/react";
import { getQuestionById } from '../api/questionApi';
import { useTheme } from '../context/ThemeContext';
import { FiBarChart2, FiTag } from 'react-icons/fi';
import axios from 'axios';

const QuestionPage = () => {
    const { id } = useParams();
    const { themeId } = useTheme();

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [code, setCode] = useState(`function solve(nums, target) {\n  \n}`);
    const [language,setLanguage]= useState("71");
    const [output,setOutput]= useState("");

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true);
                const { data } = await getQuestionById(id);
                setQuestion(data);
            } catch (err) {
                setError('Failed to load the question. It might not exist or there was a server error.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();
    }, [id]);

    const difficultyColors = {
        Easy: 'text-green-500',
        Medium: 'text-yellow-500',
        Hard: 'text-red-500',
    };

    if (loading) {
        return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><p className="text-muted-foreground">Loading Question...</p></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><p className="text-destructive">{error}</p></div>;
    }

    if (!question) {
        return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><p>Question not found.</p></div>;
    }

    const handleRunCode = async () => {
       try{const response= await axios.post("http://localhost:5000/api/run",{
        code,
        language,

       });   // ye code aur language code backend ko send krta h 
       setOutput(response.data.output);  // ye output dikhana h frontend pr anbhi frontend nhi bna
       }catch(err){
        console.error(err);
        setOutput("error running code");
       }
    
    };


    return (
        <div className="h-[calc(100vh-4rem)] border-t border-border">
            <PanelGroup direction="horizontal" className="h-full w-full">

                <Panel defaultSize={50} minSize={30}>
                    <div className="h-full overflow-y-auto p-6">
                        <h1 className="text-2xl font-bold text-foreground mb-4">{question.title}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className={`flex items-center gap-2 text-sm font-medium ${difficultyColors[question.difficulty]}`}>
                                <FiBarChart2 className="h-4 w-4" />
                                <span>{question.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FiTag className="h-4 w-4" />
                                <span>{question.category.name}</span>
                            </div>
                        </div>

                        <div
                            className="prose prose-sm dark:prose-invert max-w-none text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-1 prose-code:rounded"
                            dangerouslySetInnerHTML={{ __html: question.description }}
                        />

                        {question.image && question.image.url && (
                            <div className="mt-6">
                                <h3 className="font-semibold mb-2">Example Image:</h3>
                                <img src={question.image.url} alt="Question example" className="rounded-lg border border-border max-w-full h-auto" />
                            </div>
                        )}
                    </div>
                </Panel>

                <PanelResizeHandle className="w-2 bg-transparent data-[resize-handle-state=hover]:bg-muted data-[resize-handle-state=drag]:bg-muted transition-colors" />

                <Panel defaultSize={50} minSize={30}>
                    <PanelGroup direction="vertical">
                        <Panel defaultSize={70} minSize={25}>
                            <div className="h-full w-full bg-background">

                                <div className="flex justify-end p-2 border-b border-border bg-muted/30">
                               <label for="languageSelector" className="text-white p-2">Select Language:</label>
<select onChange={(e)=>{setLanguage(e.target.value)}} id="languageSelector" className="bg-black text-white p-2 mx-2 rounded-md">
  <option value="54">C++</option>
  <option value="71">Python</option>
  <option value="62">Java</option>
  <option value="63">JavaScript</option>
</select>     
{/* //ye language k liye dropdown h  */}

                                    <button
                                        onClick={handleRunCode}
                                        className="px-3 py-1 bg-red-600 hover:bg-blue-700 text-white rounded"
                                    >
                                        Run Code
                                    </button>  
                                    {/* ye run ka button */}
                                </div>

                                <Editor
                                    height="100%"
                                    theme={themeId}
                                    
                                    language={language}
                                    value={code}
                                    options={{
                                        fontSize: 14,
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        wordWrap: 'on'
                                    }}
                                    onChange={(value)=>{setCode(value)}}
                                />
                            </div>
                        </Panel>

                        <PanelResizeHandle className="h-2 bg-transparent data-[resize-handle-state=hover]:bg-muted data-[resize-handle-state=drag]:bg-muted transition-colors" />

                        <Panel defaultSize={30} minSize={15}>
                            <div className="h-full overflow-y-auto p-4">
                                <h2 className="text-lg font-semibold mb-3 text-foreground">Test Cases</h2>
                                <div className="space-y-3">
                                    {question.visibleTestCases.map((testCase, index) => (
                                        <div key={index} className="bg-muted/50 p-3 rounded-md border border-border">
                                            <p className="text-sm font-medium text-muted-foreground">Case {index + 1}</p>
                                            <pre className="mt-1 text-xs font-mono bg-background p-2 rounded whitespace-pre-wrap">
                                                <code>
                                                    {`Input: ${testCase.input}\nOutput: ${testCase.output}`}
                                                </code>
                                            </pre>
                                        </div>
                                    ))}
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