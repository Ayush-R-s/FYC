import React from 'react';
import { Flame, Info } from 'lucide-react';
import DarkProgressBar from './DarkProgressBar';

export default function StreakCard({ streak, darkMode, cardBg, borderColor }) {
    if (!streak) return null;

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Reorder days to start from 6 days ago
    const displayDays = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        displayDays.push({
            label: days[d.getDay()],
            active: streak.weekDays ? streak.weekDays[6 - i] : false,
            isToday: i === 0
        });
    }

    return (
        <div className={`${cardBg} border ${borderColor} rounded-2xl p-8 shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-md`}>
            {/* Background Glow */}
            <div className={`absolute -right-10 -top-10 w-64 h-64 ${darkMode ? "bg-orange-500/5" : "bg-orange-500/2"} rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-all duration-700`}></div>

            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <Flame className="text-white fill-white" size={32} />
                        </div>
                        <div className="absolute -inset-1 bg-orange-400/20 rounded-2xl blur-sm animate-pulse"></div>
                    </div>
                    <div>
                        <h3 className={`text-2xl md:text-3xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"} tracking-tight`}>
                            {streak.current} Day Streak!
                        </h3>
                        <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                            You're on fire! Keep it up.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-10 px-2 relative z-10">
                {displayDays.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-4">
                        <div className={`
                            w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all duration-500 border-2
                            ${day.active
                                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110'
                                : day.isToday
                                    ? `border-orange-500 text-orange-500 ${darkMode ? "bg-orange-500/5" : "bg-orange-50"}`
                                    : `${darkMode ? "bg-slate-800/40 border-slate-700/50 text-slate-500" : "bg-gray-50 border-gray-100 text-gray-400"}`}
                        `}>
                            {day.label}
                        </div>
                        {day.isToday && (
                            <span className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] animate-pulse">
                                Today
                            </span>
                        )}
                        {!day.isToday && <span className="h-4" />}
                    </div>
                ))}
            </div>

            <div className="relative z-10 mb-8">
                <DarkProgressBar
                    value={streak.current % 7}
                    max={7}
                    label={`Next Milestone: 7 Day Badge`}
                    darkMode={darkMode}
                />
            </div>

            <div className={`mt-8 pt-8 border-t ${darkMode ? "border-slate-800/60" : "border-gray-100"} flex justify-between items-center relative z-10`}>
                <div className="text-center flex-1 border-r border-transparent relative">
                    <div className={`absolute right-0 top-0 bottom-0 w-px ${darkMode ? "bg-slate-800/60" : "bg-gray-100"}`}></div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>Best Streak</p>
                    <p className={`font-black text-xl ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{streak.best} Days</p>
                </div>
                <div className="text-center flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>Total Tests</p>
                    <p className={`font-black text-xl ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{streak.total}</p>
                </div>
            </div>
        </div>
    );
}
