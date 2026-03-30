import React from "react"
import { ArrowLeft, BookOpen, Clock, CheckCircle, Play, MoreVertical } from "lucide-react"

const TutorialDetail = ({
  tutorialData,
  selectedSubjectFilter,
  setSelectedSubjectFilter,
  onBack,
  darkMode,
  cardBg,
  borderColor,
  t,
  addActivity
}) => {
  const [statusFilter, setStatusFilter] = React.useState("all")
  const subjects = ["all", "physics", "chemistry", "zoology", "botany"]

  const filteredTutorials = (tutorialData || []).filter((item) => {
    const matchesSubject = selectedSubjectFilter === "all" || item.subject?.toLowerCase() === selectedSubjectFilter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "completed" && item.completed) ||
      (statusFilter === "incomplete" && !item.completed)
    return matchesSubject && matchesStatus
  })

  const total = filteredTutorials.length
  const completed = filteredTutorials.filter(t => t.completed).length
  const incomplete = total - completed

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2.5 rounded-xl transition-all ${darkMode
              ? "bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800"
              : "bg-white text-orange-600 hover:bg-orange-50 border border-orange-100"
              } shadow-sm active:scale-95`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>{t("tutorialCompletion")}</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{t("trackProgress")}</p>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className={`flex flex-wrap gap-1.5 p-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-gray-50/50 border-gray-100"} rounded-xl border`}>
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => {
                setSelectedSubjectFilter(subj)
                if (addActivity) addActivity("Filtered Tutorials", `Filtered by ${subj}`)
              }}
              className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${selectedSubjectFilter === subj
                ? (darkMode ? "bg-slate-800 text-orange-400 shadow-lg" : "bg-orange-500 text-white shadow-md")
                : (darkMode ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-orange-500")
                }`}
            >
              {t(subj) || subj}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setStatusFilter("all")}
          className={`${cardBg} p-6 rounded-2xl border transition-all ${statusFilter === "all" ? (darkMode ? "border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/10" : "border-orange-500 ring-2 ring-orange-500/20") : borderColor} shadow-sm flex items-center gap-4 text-left group`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${statusFilter === "all" ? "bg-orange-500 text-white" : (darkMode ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-500")}`}>
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t("totalTutorials")}</p>
            <p className={`text-2xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{tutorialData.filter(item => selectedSubjectFilter === "all" || item.subject.toLowerCase() === selectedSubjectFilter).length}</p>
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("completed")}
          className={`${cardBg} p-6 rounded-2xl border transition-all ${statusFilter === "completed" ? (darkMode ? "border-green-500 bg-green-500/5 shadow-lg shadow-green-500/10" : "border-green-500 ring-2 ring-green-500/20") : borderColor} shadow-sm flex items-center gap-4 text-left group`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${statusFilter === "completed" ? "bg-green-600 text-white" : (darkMode ? "bg-slate-800 text-green-400" : "bg-green-50 text-green-600")}`}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t("completed")}</p>
            <p className={`text-2xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{tutorialData.filter(item => (selectedSubjectFilter === "all" || item.subject.toLowerCase() === selectedSubjectFilter) && item.completed).length}</p>
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("incomplete")}
          className={`${cardBg} p-6 rounded-2xl border transition-all ${statusFilter === "incomplete" ? (darkMode ? "border-orange-400 bg-orange-400/5 shadow-lg shadow-orange-400/10" : "border-orange-400 ring-2 ring-orange-400/20") : borderColor} shadow-sm flex items-center gap-4 text-left group`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${statusFilter === "incomplete" ? "bg-orange-400 text-white" : (darkMode ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-400")}`}>
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t("incomplete")}</p>
            <p className={`text-2xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{tutorialData.filter(item => (selectedSubjectFilter === "all" || item.subject.toLowerCase() === selectedSubjectFilter) && !item.completed).length}</p>
          </div>
        </button>
      </div>

      {/* Tutorial List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial, index) => (
          <div
            key={index}
            className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-lg ${darkMode ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-orange-50 text-orange-600 border border-orange-100"} text-[9px] font-black uppercase tracking-widest`}>
                {t(tutorial.subject.toLowerCase())}
              </span>
              <button className={`transition-colors ${darkMode ? "text-slate-600 hover:text-slate-400" : "text-gray-300 hover:text-gray-400"}`}>
                <MoreVertical size={16} />
              </button>
            </div>

            <h4 className={`text-lg font-black mb-2 leading-tight tracking-tight group-hover:text-orange-500 transition-colors ${darkMode ? "text-slate-50" : "text-gray-900"}`}>
              {tutorial.name}
            </h4>

            <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? "border-slate-800" : "border-gray-50"} mt-auto`}>
              {tutorial.completed ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{t("completed")}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-400 font-black text-[9px] uppercase tracking-widest">
                  <Clock size={14} />
                  <span>{t("incomplete")}</span>
                </div>
              )}

              <button
                onClick={() => addActivity("Started Tutorial", tutorial.name)}
                className={`p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all active:scale-95 shadow-lg ${darkMode ? "shadow-orange-500/20" : "shadow-orange-500/10"}`}
              >
                <Play size={14} fill="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TutorialDetail