import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { fetchBadges } from '../../utils/api';
import BadgeGrid from '../../components/Gamification/BadgeGrid';
import { Award, Zap, Info } from 'lucide-react';

export default function BadgesPage() {
    const {
        darkMode,
        userProfile,
        t
    } = useAppContext();

    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBadges = async () => {
            if (userProfile?.email) {
                const data = await fetchBadges(userProfile.email);
                setBadges(data);
            }
            setLoading(false);
        };
        loadBadges();
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
                        <Award size={24} />
                    </div>
                    <div>
                        <h1 className={`text-3xl font-black tracking-tight ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>
                            {t("badges") || "Achievements"}
                        </h1>
                        <p className={`${darkMode ? "text-slate-500" : "text-gray-500"} text-xs font-bold uppercase tracking-widest mt-1`}>
                            {t("unlockYourPotential") || "Unlock your potential milestones"}
                        </p>
                    </div>
                </div>

                <div className={`${cardBg} border ${borderColor} rounded-xl px-4 py-2 flex items-center gap-3 text-[10px] uppercase tracking-widest font-black shadow-sm`}>
                    <Zap className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className={darkMode ? "text-slate-500" : "text-gray-400"}>Multiplier:</span>
                    <span className={darkMode ? "text-orange-400" : "text-orange-600"}>1.0x</span>
                </div>
            </header>

            <BadgeGrid
                badges={badges}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
            />

            <div className={`${cardBg} border ${borderColor} border-dashed border-2 rounded-2xl p-12 text-center group transition-all duration-300 hover:border-orange-500/30`}>
                <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Award size={32} className="opacity-50" />
                </div>
                <h4 className={`text-lg font-black mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{t("moreBadgesComing") || "More Badges Coming Soon!"}</h4>
                <p className={`${darkMode ? "text-slate-400" : "text-gray-500"} text-sm max-w-sm mx-auto font-medium`}>
                    We're constantly designing new achievements to celebrate your hard work.
                    Keep testing and staying consistent!
                </p>
            </div>
        </div>
    );
}
