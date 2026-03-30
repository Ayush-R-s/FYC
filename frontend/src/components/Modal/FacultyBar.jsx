import React, { useState } from 'react';

const FacultyBar = ({ faculty, color, isDarkMode }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-center mb-2">
                <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{faculty.name}</p>
                <span className="text-sm font-bold" style={{ color }}>{faculty.avg}/5</span>
            </div>
            <div className={`w-full rounded-full h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                <div
                    className="h-3 rounded-full relative"
                    style={{
                        width: `${(faculty.avg / 5) * 100}%`,
                        backgroundColor: color,
                        transition: 'all 0.3s ease'
                    }}
                >
                </div>
            </div>
        </div>
    );
};

export default FacultyBar;
