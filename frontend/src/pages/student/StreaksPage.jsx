import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { fetchStreak } from '../../utils/api';
import StreakCard from '../../components/Gamification/StreakCard';
import { Flame, Info, Calendar, Zap } from 'lucide-react';

export default function StreaksPage() {
    const {
        darkMode,
        userProfile,
        t
    } = useAppContext();

    const [streakData, setStreakData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStreak = async () => {
            if (userProfile?.email) {
                const data = await fetchStreak(userProfile.email);
                setStreakData(data);
            }
            setLoading(false);
        };
        loadStreak();
    }, [userProfile]);

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 pt-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                        <Flame size={24} className="fill-white" />
                    </div>
                    <div>
                        <h1 className={`text-3xl font-black tracking-tight ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>
                            {t("streaks") || "Streaks"}
                        </h1>
                        <p className={`${darkMode ? "text-slate-500" : "text-gray-500"} text-xs font-bold uppercase tracking-widest mt-1`}>
                            {t("consistencyIsKey") || "Consistency is the key to mastery"}
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <StreakCard
                        streak={streakData}
                        darkMode={darkMode}
                        cardBg={cardBg}
                        borderColor={borderColor}
                    />
                </div>

                <div className="space-y-6">
                    <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`p-1.5 ${darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"} rounded-lg`}>
                                <Zap size={18} className="fill-current" />
                            </div>
                            <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>{t("streakRules") || "Streak Rules"}</h3>
                        </div>

                        <ul className="space-y-6">
                            {[
                                { num: 1, text: "Take at least one test every day to keep your streak alive." },
                                { num: 2, text: "If you miss a day, the streak resets to zero." },
                                { num: 3, text: "Reach milestones like 7, 30, and 100 days to unlock exclusive badges." }
                            ].map((rule) => (
                                <li key={rule.num} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 font-black text-[10px]">
                                        {rule.num}
                                    </div>
                                    <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-gray-600"} leading-relaxed`}>
                                        {rule.text}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 shadow-xl shadow-orange-500/20 text-white group overflow-hidden relative">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-xl font-black mb-3 tracking-tight">
                                {t("upcomingGoal") || "Upcoming Goal"}
                            </h3>
                            <p className="text-orange-100 text-sm font-medium mb-8 leading-relaxed">
                                You are just {7 - (streakData?.current % 7 || 0)} days away from your next milestone badge!
                            </p>
                            <button className="w-full bg-slate-950 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-orange-600 transition-all duration-300 shadow-xl active:scale-95">
                                {t("takeATestNow") || "Take a Test Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
