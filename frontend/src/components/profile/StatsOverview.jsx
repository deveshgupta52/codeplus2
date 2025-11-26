import React from 'react';
import { FiCheckCircle, FiStar, FiTrendingUp } from 'react-icons/fi';

// A reusable sub-component for each stat item
const StatItem = ({ icon, value, label, colorClass }) => (
    <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${colorClass}/10 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    </div>
);


const StatsOverview = ({ stats }) => {
    return (
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <StatItem 
                icon={<FiTrendingUp className="h-6 w-6" />}
                value={stats.totalSolved}
                label="Problems Solved"
                colorClass="text-primary"
            />
            <StatItem 
                icon={<FiCheckCircle className="h-6 w-6" />}
                value={`${stats.accuracy}%`}
                label="Submission Accuracy"
                colorClass="text-green-500"
            />
            <StatItem 
                icon={<FiStar className="h-6 w-6" />}
                value={stats.starred}
                label="Starred Problems"
                colorClass="text-yellow-500"
            />
        </div>
    );
};

export default StatsOverview;