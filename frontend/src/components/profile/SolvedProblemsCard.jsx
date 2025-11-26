import React from 'react';
import { FiTrendingUp, FiCircle } from 'react-icons/fi';

const SolvedProblemsCard = ({ stats }) => {
    const totalSolved = stats.easy.solved + stats.medium.solved + stats.hard.solved;

    return (
        <div className="group relative bg-card border border-border rounded-lg p-6 h-full transition-all duration-300">
            {/* Visible Content */}
            <div className="transition-opacity duration-300 group-hover:opacity-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Problems Solved</h2>
                    <FiTrendingUp className="text-muted-foreground" />
                </div>
                <div className="text-center">
                    <p className="text-5xl font-bold text-foreground">{totalSolved}</p>
                    <p className="text-sm text-muted-foreground">Total Questions Solved</p>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><FiCircle className="text-green-500 h-3 w-3" /> Easy</span>
                        <span className="font-medium text-foreground">{stats.easy.solved} <span className="text-muted-foreground">/ {stats.easy.total}</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><FiCircle className="text-yellow-500 h-3 w-3" /> Medium</span>
                        <span className="font-medium text-foreground">{stats.medium.solved} <span className="text-muted-foreground">/ {stats.medium.total}</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><FiCircle className="text-red-500 h-3 w-3" /> Hard</span>
                        <span className="font-medium text-foreground">{stats.hard.solved} <span className="text-muted-foreground">/ {stats.hard.total}</span></span>
                    </div>
                </div>
            </div>

            {/* Hidden Content (Visible on Hover) */}
            <div className="absolute inset-0 p-6 flex flex-col justify-center bg-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold text-center mb-4">Solved by Category</h3>
                <div className="space-y-2 text-sm">
                    {Object.entries(stats.solvedByCategory).map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{category}</span>
                            <span className="font-semibold text-foreground">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SolvedProblemsCard;