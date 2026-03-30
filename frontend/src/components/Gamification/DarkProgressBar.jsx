import React from 'react';

export default function DarkProgressBar({ value, max, label, darkMode }) {
    const percentage = Math.min(Math.round((value / max) * 100), 100);

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{label}</span>
                <span className={`text-xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{percentage}%</span>
            </div>
            <div className={`h-1.5 w-full ${darkMode ? "bg-slate-800" : "bg-gray-100"} rounded-full overflow-hidden`}>
                <div
                    className={`${darkMode ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]" : "bg-orange-500"} h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                <span className={darkMode ? "text-slate-600" : "text-gray-400"}>{value} Completed</span>
                <span className={darkMode ? "text-slate-600" : "text-gray-400"}>{max} Goal</span>
            </div>
        </div>
    );
}
