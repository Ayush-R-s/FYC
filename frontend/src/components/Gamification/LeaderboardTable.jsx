import React from 'react';
import { Trophy, Medal, Search, Globe, School } from 'lucide-react';

export default function LeaderboardTable({ students, currentUserEmail, scope, onScopeChange, darkMode, cardBg, borderColor, t }) {
    return (
        <div className={`${cardBg} border ${borderColor} rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500`}>
            <div className={`p-8 border-b ${darkMode ? "border-slate-800/60" : "border-gray-100"} flex flex-col md:flex-row justify-between items-center gap-6`}>
                <div>
                    <h3 className={`font-black text-2xl flex items-center gap-3 ${darkMode ? "text-slate-50" : "text-gray-900"} tracking-tight`}>
                        <Trophy className="text-orange-500" size={28} />
                        {t("hallOfFame") || "Hall of Fame"}
                    </h3>
                    <p className={`${darkMode ? "text-slate-400" : "text-gray-500"} text-sm font-medium mt-1`}>
                        {t("realTimeRankings") || "Real-time rankings based on performance."}
                    </p>
                </div>

                <div className={`flex ${darkMode ? "bg-slate-900/60" : "bg-gray-50"} p-1.5 rounded-2xl border ${darkMode ? "border-slate-800" : "border-gray-200"}`}>
                    <button
                        onClick={() => onScopeChange('global')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${scope === 'global' ? 'bg-orange-500 text-white shadow-lg' : (darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600')
                            }`}
                    >
                        <Globe size={14} /> {t("global") || "Global"}
                    </button>
                    <button
                        onClick={() => onScopeChange('school')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${scope === 'school' ? 'bg-orange-500 text-white shadow-lg' : (darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600')
                            }`}
                    >
                        <School size={14} /> {t("mySchool") || "My School"}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className={`${darkMode ? "bg-slate-900/20" : "bg-gray-50/50"} ${darkMode ? "text-slate-500" : "text-gray-400"} text-[10px] uppercase font-black tracking-[0.2em]`}>
                            <th className="px-8 py-5">Rank</th>
                            <th className="px-8 py-5">Student</th>
                            <th className="px-8 py-5">School</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Avg Score</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? "divide-slate-800/40" : "divide-gray-100"}`}>
                        {students.map((student, idx) => {
                            const isCurrentUser = student.email === currentUserEmail;
                            const rank = idx + 1;

                            return (
                                <tr
                                    key={student.id}
                                    className={`
                                        transition-all duration-300 group
                                        ${isCurrentUser ? (darkMode ? 'bg-orange-500/10' : 'bg-orange-50/50') : (darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50/50')}
                                    `}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-transform group-hover:scale-110
                                                ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]' :
                                                    rank === 2 ? 'bg-slate-300/20 text-slate-400 border border-slate-300/20' :
                                                        rank === 3 ? 'bg-orange-700/20 text-orange-700 border border-orange-700/20' :
                                                            `${darkMode ? "text-slate-600 bg-slate-800/40" : "text-gray-400 bg-gray-50"}`}
                                            `}>
                                                {rank === 1 ? <Medal size={20} className="drop-shadow-sm" /> :
                                                    rank === 2 ? <Medal size={20} /> :
                                                        rank === 3 ? <Medal size={20} /> : rank}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl ${darkMode ? "bg-slate-800" : "bg-gray-100"} border-2 ${isCurrentUser ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-transparent'} flex items-center justify-center text-xl font-black ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className={`font-black tracking-tight flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                                                    {student.name}
                                                    {isCurrentUser && (
                                                        <span className="bg-orange-500 text-white text-[8px] px-2 py-0.5 rounded-lg uppercase tracking-widest font-black">You</span>
                                                    )}
                                                </div>
                                                <div className={`${darkMode ? "text-slate-500" : "text-gray-400"} text-[10px] uppercase font-black tracking-widest mt-1`}>ID: {student.studentId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-gray-600"}`}>{student.schoolName || 'General'}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            {(student.earnedBadges || []).slice(0, 3).map((badgeId, bIdx) => (
                                                <div key={bIdx} className={`w-8 h-8 rounded-xl ${darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-gray-100"} border flex items-center justify-center text-sm shadow-sm hover:scale-110 transition-transform`} title={badgeId}>
                                                    {badgeId === 'ACCURACY_90' ? '🎯' : badgeId === 'STREAK_7' ? '🔥' : '🏆'}
                                                </div>
                                            ))}
                                            {(student.earnedBadges || []).length > 3 && (
                                                <div className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-gray-400"} self-center ml-2`}>+{student.earnedBadges.length - 3} more</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`text-2xl font-black ${rank <= 3 ? 'text-orange-500' : (darkMode ? 'text-white' : 'text-gray-900')}`}>
                                            {student.avgScore != null ? student.avgScore.toFixed(1) : '0.0'}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {students.length === 0 && (
                <div className="p-32 text-center">
                    <div className={`w-24 h-24 ${darkMode ? "bg-slate-800" : "bg-gray-50"} rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
                        <Search className={darkMode ? "text-slate-600" : "text-gray-300"} size={40} />
                    </div>
                    <h4 className={`text-xl font-black mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{t("noWarriorsFound") || "No warriors found"}</h4>
                    <p className={`${darkMode ? "text-slate-500" : "text-gray-500"} text-sm font-medium`}>The arena is empty. Be the first to join!</p>
                </div>
            )}
        </div>
    );
}
