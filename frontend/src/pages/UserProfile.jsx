import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SolvedProblemsCard from '../components/profile/SolvedProblemsCard';
import AccuracyCard from '../components/profile/AccuracyCard';
import SubmissionHeatmap from '../components/profile/SubmissionHeatmap';
import RecentSubmissions from '../components/profile/RecentSubmissions';
import ProfileHeader from '../components/profile/ProfileHeader';
import { eachDayOfInterval, sub, format } from 'date-fns';
import { FiPlus } from 'react-icons/fi';

const generateDummyCycleData = (cycleId) => {
    const today = new Date();
    const startDate = sub(today, { years: 1 });
    const days = eachDayOfInterval({ start: startDate, end: today });
    const submissionData = {};
    let totalSubmissions = 0;
    days.forEach(day => {
        if (Math.random() > 0.4) { 
            const submissionCount = Math.floor(Math.random() * (10 + cycleId)) + 1;
            submissionData[format(day, 'yyyy-MM-dd')] = submissionCount;
            totalSubmissions += submissionCount;
        }
    });

    return {
        id: cycleId,
        name: `Cycle #${cycleId} (2023-24)`,
        stats: {
            easy: { solved: Math.floor(Math.random() * 50) + (cycleId * 10), total: 250 },
            medium: { solved: Math.floor(Math.random() * 100) + (cycleId * 20), total: 500 },
            hard: { solved: Math.floor(Math.random() * 20) + (cycleId * 5), total: 250 },
            solvedByCategory: {
                "Array": Math.floor(Math.random() * 30) + 20, "String": Math.floor(Math.random() * 30) + 15,
                "Math": Math.floor(Math.random() * 20) + 10, "Dynamic Programming": Math.floor(Math.random() * 15),
            },
            accuracy: Math.floor(Math.random() * 20) + 75,
        },
        totalSubmissions,
        submissionData,
        recentSubmissions: [
            { title: "Valid Anagram", status: "Accepted", time: `${cycleId}h ago` },
            { title: "Reverse String", status: "Accepted", time: `yesterday` },
            { title: "Two Sum", status: "Wrong Answer", time: `${cycleId + 1}d ago` },
        ]
    };
};

const generateEmptyCycleData = (cycleId) => {
    return {
        id: cycleId,
        name: `Cycle #${cycleId} (New)`,
        stats: {
            easy: { solved: 0, total: 250 },
            medium: { solved: 0, total: 500 },
            hard: { solved: 0, total: 250 },
            solvedByCategory: { "Array": 0, "String": 0, "Math": 0, "Dynamic Programming": 0 },
            accuracy: 0,
        },
        totalSubmissions: 0,
        submissionData: {}, // Empty heatmap
        recentSubmissions: [], // No recent submissions
    };
};


const UserProfile = () => {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [cycles, setCycles] = useState([]);
    const [selectedCycleId, setSelectedCycleId] = useState(3);

    useEffect(() => {
        const loadInitialData = () => {
            const initialCycles = [
                generateDummyCycleData(1),
                generateDummyCycleData(2),
                generateDummyCycleData(3),
            ];
            setCycles(initialCycles);
            setSelectedCycleId(3);
            setLoading(false);
        };

        if (authUser) {
             loadInitialData();
        }
    }, [authUser]);

    const handleAddNewCycle = () => {
        const newId = cycles.length + 1;
        const newCycle = generateEmptyCycleData(newId);
        setCycles(prevCycles => [...prevCycles, newCycle]);
        setSelectedCycleId(newId);
    };

    const activeCycle = cycles.find(c => c.id === selectedCycleId);

    if (loading) {
        return <div className="text-center py-20 text-muted-foreground">Loading Profile...</div>;
    }

    if (!activeCycle) {
        return <div className="text-center py-20 text-destructive">Could not load submission cycle.</div>;
    }

    const { stats, totalSubmissions, submissionData, recentSubmissions } = activeCycle;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <ProfileHeader />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-2">
                    <label htmlFor="cycle-select" className="text-sm font-medium text-muted-foreground">Viewing:</label>
                    <select
                        id="cycle-select"
                        value={selectedCycleId}
                        onChange={(e) => setSelectedCycleId(Number(e.target.value))}
                        className="appearance-none bg-secondary text-secondary-foreground rounded-md pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {cycles.map(cycle => (
                            <option key={cycle.id} value={cycle.id}>{cycle.name}</option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={handleAddNewCycle}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
                >
                    <FiPlus />
                    Start New Cycle
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <SolvedProblemsCard stats={stats} />
                </div>
                <div className="lg:col-span-2">
                    <AccuracyCard accuracy={stats.accuracy} />
                </div>
            </div>
            <SubmissionHeatmap totalSubmissions={totalSubmissions} submissionData={submissionData} />
            <RecentSubmissions submissions={recentSubmissions} />
        </div>
    );
};
export default UserProfile;