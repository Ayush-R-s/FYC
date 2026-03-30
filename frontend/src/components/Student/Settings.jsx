import { User, Globe, Type, History, Save, CheckCircle, Clock, ArrowLeft, School } from "lucide-react"

const Settings = ({
  userProfile,
  editedProfile,
  language,
  setLanguage,
  fontSize,
  applyFontSize,
  activityHistory,
  darkMode,
  cardBg,
  borderColor,
  t,
  setActiveTab
}) => {
  const languages = ["english", "hindi", "tamil", "telugu", "marathi", "gujarati", "bengali", "malayalam"]
  const nativeLanguageNames = {
    english: "English",
    hindi: "हिन्दी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    bengali: "বাংলা",
    malayalam: "മലയാളം"
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`p-2.5 rounded-xl transition-all ${darkMode
              ? "bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800"
              : "bg-white text-orange-600 hover:bg-orange-50 border border-orange-100"
              } shadow-sm active:scale-95`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-3xl font-black tracking-tight ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>{t("profileSettings")}</h2>
            <p className={`${darkMode ? "text-slate-500" : "text-gray-500"} text-xs font-bold uppercase tracking-widest mt-1`}>{t("managePreferences")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings Left */}
        <div className="lg:col-span-2 space-y-8">
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
            <div className="flex items-center gap-3 mb-8">
              <div className={`p-1.5 ${darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"} rounded-lg`}>
                <User size={18} />
              </div>
              <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>{t("profileSettings")}</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t("name")}</label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    readOnly
                    className={`w-full px-4 py-3 rounded-xl border-2 ${borderColor} ${darkMode ? "bg-slate-800/30 text-slate-400" : "bg-gray-50/50 text-gray-400"} outline-none transition-all font-bold text-sm cursor-not-allowed`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t("phone")}</label>
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    readOnly
                    className={`w-full px-4 py-3 rounded-xl border-2 ${borderColor} ${darkMode ? "bg-slate-800/30 text-slate-400" : "bg-gray-50/50 text-gray-400"} outline-none transition-all font-bold text-sm cursor-not-allowed`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t("school")}</label>
                <div className={`w-full px-4 py-3 rounded-xl border-2 ${borderColor} ${darkMode ? "bg-slate-800/30 text-slate-400" : "bg-gray-50/50 text-gray-400"} font-bold flex items-center gap-3 text-sm cursor-not-allowed`}>
                  <School className="text-slate-400" size={16} />
                  {editedProfile.schoolName || "General"}
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Activity History */}
        <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-1.5 ${darkMode ? "bg-blue-500/10 text-blue-400" : "bg-orange-100 text-orange-600"} rounded-lg`}>
              <History size={18} />
            </div>
            <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>{t("activityHistory")}</h3>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {activityHistory.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-xl border ${borderColor} ${darkMode ? "bg-gray-800/50" : "bg-white"} transition-all hover:border-orange-200 group relative`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">{activity.action}</span>
                    <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{activity.title}</p>
                  </div>
                  <span className="text-[8px] font-bold text-gray-400 p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg uppercase">{activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences Right */}
      <div className="space-y-8">
        <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-1.5 ${darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-100 text-orange-600"} rounded-lg`}>
              <Globe size={18} />
            </div>
            <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>{t("preferences")}</h3>
          </div>

          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">{t("selectUILanguage")}</label>
          <div className="grid grid-cols-1 gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex items-center justify-between px-5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${language === lang
                  ? (darkMode ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-orange-600 text-white shadow-md")
                  : (darkMode ? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-slate-800/50" : "text-gray-500 hover:bg-orange-50 hover:text-orange-600 border border-transparent")
                  }`}
              >
                {nativeLanguageNames[lang] || lang}
                {language === lang && <CheckCircle size={14} />}
              </button>
            ))}
          </div>
        </div>

        <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-3 mb-8">
            <div className={`p-1.5 ${darkMode ? "bg-purple-500/10 text-purple-400" : "bg-orange-100 text-orange-600"} rounded-lg`}>
              <Type size={18} />
            </div>
            <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>{t("fontSize")}</h3>
          </div>

          <div className={`flex gap-1 p-1 ${darkMode ? "bg-slate-950/50" : "bg-gray-50"} rounded-xl border ${darkMode ? "border-slate-800" : "border-gray-100"}`}>
            {["small", "medium", "large"].map((size) => (
              <button
                key={size}
                onClick={() => applyFontSize(size)}
                className={`flex-1 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${fontSize === size
                  ? (darkMode ? "bg-slate-800 text-orange-400 shadow-lg" : "bg-white text-orange-600 shadow-sm")
                  : (darkMode ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-orange-500")
                  }`}
              >
                {t(size)}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[9px] font-bold text-gray-500 italic text-center leading-relaxed">
            {t("changingWholeWebsite")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
