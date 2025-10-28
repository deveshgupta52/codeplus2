import React from 'react';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question }) => {
    const difficultyColors = {
        Easy: 'text-green-500 bg-green-500/10',
        Medium: 'text-yellow-500 bg-yellow-500/10',
        Hard: 'text-red-500 bg-red-500/10',
    };

    return (
        <Link
            to={`/questions/${question._id}`}
            className="block p-4 bg-card border border-border rounded-lg shadow-sm hover:border-primary transition-colors duration-200"
        >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <h3 className="font-semibold text-lg text-foreground">{question.title}</h3>
                <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full mt-2 sm:mt-0 ${difficultyColors[question.difficulty] || 'text-muted-foreground'}`}
                >
                    {question.difficulty}
                </span>
            </div>
            <div className="mt-2">
                <span className="text-sm text-muted-foreground">{question.category.name}</span>
            </div>
        </Link>
    );
};

export default QuestionCard;