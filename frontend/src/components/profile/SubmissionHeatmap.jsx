import React from 'react';
import { format, eachDayOfInterval, sub, getDay } from 'date-fns';

const SubmissionHeatmap = ({ totalSubmissions, submissionData }) => {
    const today = new Date();
    const startDate = sub(today, { years: 1 });
    const days = eachDayOfInterval({ start: startDate, end: today });

    const months = days.reduce((acc, day) => {
        const month = format(day, 'MMM');
        const year = day.getFullYear();
        const key = `${month}-${year}`;
        if (!acc[key]) {
            acc[key] = { name: month, days: [] };
        }
        acc[key].days.push(day);
        return acc;
    }, {});
    
    const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getIntensityClass = (count) => {
        if (count > 9) return 'bg-primary';
        if (count > 6) return 'bg-primary/70';
        if (count > 3) return 'bg-primary/50';
        if (count > 0) return 'bg-primary/30';
        return 'bg-muted/50';
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">{totalSubmissions.toLocaleString()} submissions in the last year</h2>
            
            <div className="flex gap-4">
                <div className="flex flex-col text-xs text-muted-foreground pt-8 gap-1">
                    {weekDayLabels.map((day, index) => (
                        <div 
                            key={day} 
                            className="h-4 flex items-center" 
                            style={{ marginTop: index === 0 ? '0.25rem' : '0' }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4">
                    {Object.values(months).map(month => {
                        const firstDayIndex = getDay(month.days[0]);
                        return (
                            <div key={month.name} className="flex flex-col">
                                <div className="text-sm text-center text-muted-foreground h-8 flex items-end justify-center">
                                    {month.name}
                                </div>
                                <div className="grid grid-flow-col grid-rows-7 gap-1">
                                    {Array.from({ length: firstDayIndex }).map((_, index) => (
                                        <div key={`empty-${index}`} className="w-4 h-4" />
                                    ))}
                                    {month.days.map((day, index) => {
                                        const dateString = format(day, 'yyyy-MM-dd');
                                        const count = submissionData[dateString] || 0;
                                        return (
                                            <div key={index} className="group relative">
                                                <div className={`w-4 h-4 rounded-sm ${getIntensityClass(count)}`} />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-foreground text-background text-xs rounded-md scale-0 group-hover:scale-100 transition-transform origin-bottom z-10 pointer-events-none">
                                                    {count === 0 ? 'No' : count} submissions on {format(day, 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SubmissionHeatmap;