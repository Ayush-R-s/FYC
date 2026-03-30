import React from 'react';
import BadgeCard from './BadgeCard';
import DarkProgressBar from './DarkProgressBar';

export default function BadgeGrid({ badges, darkMode, cardBg, borderColor }) {
    const earnedCount = badges.filter(b => b.earned).length;

    return (
        <div className="space-y-12">
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-10 shadow-sm relative overflow-hidden group`}>
                <div className={`absolute -right-10 -top-10 w-64 h-64 ${darkMode ? "bg-orange-500/5" : "bg-orange-500/2"} rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-all duration-700`}></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 relative z-10">
                    <div className="text-center md:text-left">
                        <h3 className={`text-2xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"} tracking-tight mb-2`}>Badge Collection</h3>
                        <p className={`${darkMode ? "text-slate-400" : "text-gray-500"} text-sm font-medium`}>Earn badges by completing tests and maintaining streaks.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-orange-500/10 px-6 py-4 rounded-2xl border border-orange-500/20 shadow-inner">
                        <div className="text-center">
                            <span className="text-orange-500 font-black text-4xl block leading-none">{earnedCount}</span>
                            <span className="text-[10px] text-orange-500/60 font-black uppercase tracking-widest mt-1 block">Earned</span>
                        </div>
                        <div className="w-px h-10 bg-orange-500/20 mx-2"></div>
                        <div className="text-center">
                            <span className={`font-black text-4xl block leading-none ${darkMode ? "text-slate-700" : "text-gray-300"}`}>{badges.length}</span>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 block">Total</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <DarkProgressBar
                        value={earnedCount}
                        max={badges.length}
                        label="Overall Collection Progress"
                        darkMode={darkMode}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {badges.map(badge => (
                    <BadgeCard
                        key={badge.id}
                        badge={badge}
                        darkMode={darkMode}
                        cardBg={cardBg}
                        borderColor={borderColor}
                    />
                ))}
            </div>
        </div>
    );
}
