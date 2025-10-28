import React, { useState, useEffect } from 'react';
import { getQuestions } from '../api/questionApi';
import QuestionCard from '../components/QuestionCard';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { data } = await getQuestions();
                setQuestions(data);
            } catch (err) {
                setError('Failed to fetch questions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) {
        return <div className="text-center text-muted-foreground">Loading problems...</div>;
    }

    if (error) {
        return <div className="text-center text-destructive">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-foreground">All Problems</h1>
            {questions.length > 0 ? (
                <div className="space-y-4">
                    {questions.map(q => (
                        <QuestionCard key={q._id} question={q} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground mt-12">
                    <p>No questions have been added yet.</p>
                    <p>An admin needs to add problems to the database.</p>
                </div>
            )}
        </div>
    );
};

export default Questions;