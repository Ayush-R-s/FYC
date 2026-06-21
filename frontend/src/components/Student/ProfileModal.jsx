import React from "react"
import { User, X, Calendar, Hash, Zap, Book } from "lucide-react"

const ProfileModal = ({ isOpen, onClose, userProfile, currentStudent, darkMode, t }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={`${darkMode ? "bg-slate-950 border-slate-900 text-slate-100" : "bg-white border-orange-100 text-gray-900"} 
        w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative`}
            >
                {darkMode && <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>}

                <div className="relative p-6">
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-900 text-slate-500 hover:text-slate-200" : "hover:bg-gray-100 text-gray-400"}`}
                    >
                        <X size={18} />
                    </button>

                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md shadow-orange-500/10">
                            <User size={40} />
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <h3 className="text-xl font-black tracking-tight">{userProfile.name}</h3>
                            {userProfile.role === 'AMBASSADOR' && (
                                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Ambassador
                                </span>
                            )}
                        </div>
                        <p className="text-orange-500 font-bold uppercase text-[9px] tracking-widest mt-2">{t("studentId")}: #STU-{userProfile.id || "2024"}</p>
                    </div>

                    <div className="space-y-4">
                        <div className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-orange-50/50 border-orange-100"} flex items-center gap-4`}>
                            <div className={`p-2 ${darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"} rounded-lg`}>
                                <Hash size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t("phone")}</p>
                                <p className={`font-bold ${darkMode ? "text-slate-200" : "text-gray-900"}`}>{userProfile.phone}</p>
                            </div>
                        </div>

                        <div className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-orange-50/50 border-orange-100"} flex items-center gap-4`}>
                            <div className={`p-2 ${darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"} rounded-lg`}>
                                <Calendar size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t("enrolledSince")}</p>
                                <p className={`font-bold ${darkMode ? "text-slate-200" : "text-gray-900"}`}>{userProfile.enrolledDate}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-orange-50/50 border-orange-100"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap size={14} className={`${darkMode ? "text-orange-400" : "text-orange-500"}`} />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("accuracy")}</span>
                                </div>
                                <p className={`text-xl font-black ${darkMode ? "text-slate-100" : "text-gray-900"}`}>{currentStudent.accuracy}%</p>
                            </div>
                            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-orange-50/50 border-orange-100"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Book size={14} className={`${darkMode ? "text-orange-400" : "text-orange-500"}`} />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("studyHours")}</span>
                                </div>
                                <p className={`text-xl font-black ${darkMode ? "text-slate-100" : "text-gray-900"}`}>{userProfile.totalStudyHours}h</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-8 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-600/20"
                    >
                        {t("close")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal
