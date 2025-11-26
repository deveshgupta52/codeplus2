import React from 'react';
import { Link } from 'react-router-dom';

const RecentSubmissions = ({ submissions }) => {
    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h2>
            <div className="space-y-3">
                {submissions.map((sub, index) => (
                    <Link to="#" key={index} className="group block">
                        <div className="flex justify-between items-center p-3 bg-muted/30 group-hover:bg-muted rounded-md transition-colors">
                            <div>
                                <p className="font-medium text-foreground">{sub.title}</p>
                                <p className={`text-sm ${sub.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>{sub.status}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{sub.time}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecentSubmissions;