import React from 'react';
import { Lock } from 'lucide-react';

export default function BadgeCard({ badge, darkMode, cardBg, borderColor }) {
    return (
        <div className={`
            relative p-8 rounded-2xl border transition-all duration-500 overflow-hidden group shadow-sm
            ${badge.earned
                ? `${cardBg} ${borderColor} hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10`
                : `${darkMode ? "bg-slate-900/20 border-slate-800/40" : "bg-gray-50/50 border-gray-100"} opacity-40 grayscale`}
        `}>
            {/* Background Icon Watermark */}
            <div className={`absolute -right-6 -bottom-6 text-7xl opacity-5 group-hover:scale-125 transition-transform duration-700 select-none ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                {badge.emoji}
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`
                    w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6 transition-all duration-500 relative
                    ${badge.earned
                        ? `${darkMode ? "bg-orange-500/10" : "bg-orange-50"} shadow-[0_10px_25px_rgba(249,115,22,0.1)] group-hover:scale-110 group-hover:rotate-6`
                        : `${darkMode ? "bg-slate-800" : "bg-gray-200"}`}
                `}>
                    {badge.earned ? (
                        <>
                            <span className="relative z-10">{badge.emoji}</span>
                            <div className="absolute inset-0 bg-orange-400/20 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </>
                    ) : (
                        <Lock className={darkMode ? "text-slate-600" : "text-gray-400"} size={32} />
                    )}
                </div>

                <h4 className={`font-black uppercase tracking-widest text-[11px] mb-2 ${badge.earned ? (darkMode ? 'text-white' : 'text-gray-900') : (darkMode ? 'text-slate-500' : 'text-gray-400')}`}>
                    {badge.name}
                </h4>
                <p className={`${darkMode ? "text-slate-400" : "text-gray-500"} text-xs leading-relaxed font-medium mb-6 px-2`}>
                    {badge.desc}
                </p>

                <div className={`
                    text-[9px] uppercase font-black tracking-[0.2em] px-4 py-2 rounded-xl border
                    ${badge.earned
                        ? `${darkMode ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-orange-50 text-orange-600 border-orange-100"}`
                        : `${darkMode ? "bg-slate-800 text-slate-600 border-slate-700" : "bg-gray-50 text-gray-400 border-gray-100"}`}
                `}>
                    {badge.category}
                </div>
            </div>

            {!badge.earned && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/10 shadow-2xl">
                        Locked
                    </span>
                </div>
            )}
        </div>
    );
}
