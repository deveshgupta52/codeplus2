import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const AccuracyCard = ({ accuracy }) => {
    return (
        <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Submission Accuracy</h2>
                    <FiCheckCircle className="text-muted-foreground" />
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="relative h-32 w-32">
                    <svg className="h-full w-full" viewBox="0 0 36 36">
                        <path
                            className="text-muted/20"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="currentColor" strokeWidth="3"
                        />
                        <path
                            className="text-green-500"
                            strokeDasharray={`${accuracy}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-foreground">{accuracy}%</span>
                    </div>
                </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">Based on your recent submissions.</p>
        </div>
    );
};

export default AccuracyCard;