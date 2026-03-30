import React, { useState } from 'react';

const RecentFeedbackItem = ({ fb, isDarkMode }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} pb-4 last:border-0 cursor-pointer`}
            style={{
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{fb.studentName || "Anonymous Student"}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{fb.facultyName || fb.faculty || "Unknown Faculty"} • {fb.subject}</p>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <span
                            key={i}
                            className={i <= fb.rating ? 'text-orange-500' : 'text-gray-300'}
                            style={{
                                fontSize: '24px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentFeedbackItem;
