import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { fetchLeaderboard } from '../../utils/api';
import LeaderboardTable from '../../components/Gamification/LeaderboardTable';
import { Trophy, Star, TrendingUp, Info } from 'lucide-react';

export default function LeaderboardPage() {
    const {
        darkMode,
        userProfile,
        t
    } = useAppContext();

    const [students, setStudents] = useState([]);
    const [scope, setScope] = useState('global'); // 'global' or 'school'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLeaderboard = async () => {
            setLoading(true);
            // If scope is school, we pass the user's school name
            const schoolName = scope === 'school' ? (userProfile?.schoolName || 'General') : null;
            const data = await fetchLeaderboard(schoolName);
            setStudents(data);
            setLoading(false);
        };
        loadLeaderboard();
    }, [userProfile, scope]);

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 pt-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                        <Star className="fill-white" size={24} />
                    </div>
                    <div>
                        <h1 className={`text-3xl font-black tracking-tight ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>
                            {t("leaderboard") || "Leaderboard"}
                        </h1>
                        <p className={`${darkMode ? "text-slate-500" : "text-gray-500"} text-xs font-bold uppercase tracking-widest mt-1`}>
                            {t("climbToTheTop") || "Compete with the best and climb your way to the top"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className={`${cardBg} border ${borderColor} rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm`}>
                        <div className={`w-12 h-12 ${darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"} rounded-xl flex items-center justify-center`}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className={`${darkMode ? "text-slate-500" : "text-gray-400"} text-[10px] uppercase font-black tracking-widest`}>{t("yourRank") || "Your Rank"}</p>
                            <p className={`${darkMode ? "text-white" : "text-gray-900"} font-black text-2xl`}>
                                #{students.findIndex(s => s.email === userProfile?.email) + 1 || '--'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className={`${cardBg} border ${borderColor} rounded-2xl h-[500px] flex items-center justify-center`}>
                    <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                </div>
            ) : (
                <LeaderboardTable
                    students={students}
                    currentUserEmail={userProfile?.email}
                    scope={scope}
                    onScopeChange={setScope}
                    darkMode={darkMode}
                    cardBg={cardBg}
                    borderColor={borderColor}
                    t={t}
                />
            )}

            <div className={`${cardBg} border ${borderColor} rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm group`}>
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Info size={32} />
                </div>
                <div>
                    <h4 className={`text-lg font-black mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{t("howIsScoreCalculated") || "How is the score calculated?"}</h4>
                    <p className={`${darkMode ? "text-slate-400" : "text-gray-500"} text-sm leading-relaxed font-medium`}>
                        Rankings are based on your <span className="text-orange-500 font-bold">combined average score</span> across all mocks and weekly tests.
                        If scores are tied, the student with more completed tests takes the lead!
                    </p>
                </div>
            </div>
        </div>
    );
}
