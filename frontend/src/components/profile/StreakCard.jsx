import React from 'react';
import { FiFlame } from 'react-icons';

const StreakCard = ({ streaks }) => {
    return (
        <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Daily Streaks</h2>
                    <FiFlame className="text-muted-foreground" />
                </div>
            </div>

            <div className="flex items-center justify-around text-center">
                {/* Current Streak */}
                <div>
                    <div className="flex items-center justify-center gap-2">
                        <FiFlame className="h-8 w-8 text-orange-500" />
                        <p className="text-5xl font-bold text-foreground">{streaks.current}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Current Streak</p>
                </div>

                {/* Longest Streak */}
                <div>
                    <p className="text-3xl font-bold text-foreground">{streaks.longest}</p>
                    <p className="text-sm text-muted-foreground mt-1">Longest Streak</p>
                </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">Solve a problem every day to build your streak!</p>
        </div>
    );
};

export default StreakCard;