import React from 'react';
import { FiTrendingUp, FiCircle } from 'react-icons/fi';

const StatsCard = ({ stats }) => {
    const totalSolved = stats.easy.solved + stats.medium.solved + stats.hard.solved;
    const totalQuestions = stats.easy.total + stats.medium.total + stats.hard.total;
    const solvedPercentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

    return (
        <div className="bg-card border border-border rounded-lg p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Problems Solved</h2>
                <FiTrendingUp className="text-muted-foreground" />
            </div>
            <div className="flex items-center gap-6">
                <div className="relative h-28 w-28">
                    <svg className="h-full w-full" viewBox="0 0 36 36">
                        <path
                            className="text-muted/20"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="currentColor" strokeWidth="3"
                        />
                        <path
                            className="text-primary"
                            strokeDasharray={`${solvedPercentage}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{totalSolved}</span>
                        <span className="text-xs text-muted-foreground">Solved</span>
                    </div>
                </div>
                <div className="space-y-3 text-sm flex-1">
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
        </div>
    );
};

export default StatsCard;