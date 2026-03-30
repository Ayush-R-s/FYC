import React, { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ArrowLeft, Zap, Filter, Activity, LayoutGrid, Calendar, ClipboardCheck, BookOpen } from "lucide-react"

const AccuracyDetail = ({
  accuracySpeedDrilldown,
  selectedSubjectFilter,
  setSelectedSubjectFilter,
  onBack,
  darkMode,
  cardBg,
  borderColor,
  t,
  addActivity
}) => {
  const [activeView, setActiveView] = useState("subject")

  const subjects = ["all", "physics", "chemistry", "zoology", "botany"]

  const getFilteredData = () => {
    if (!accuracySpeedDrilldown) return []

    switch (activeView) {
      case "mock":
        return (accuracySpeedDrilldown.byDate || []).map(d => ({ ...d, label: d.exam, id: d.date || d.exam }))
      case "weekly":
        return (accuracySpeedDrilldown.byWeekly || []).map(d => ({ ...d, label: d.week, id: d.week }))
      case "topic":
        return (accuracySpeedDrilldown.byTopic || []).map(d => ({ ...d, label: d.topic, id: d.topic }))
      default:
        const bySubject = accuracySpeedDrilldown.bySubject || []
        return selectedSubjectFilter === "all"
          ? bySubject.map(d => ({ ...d, label: d.subject, id: d.subject }))
          : bySubject.filter(d => d.subject.toLowerCase() === selectedSubjectFilter).map(d => ({ ...d, label: d.subject, id: d.subject }))
    }
  }

  const filteredData = getFilteredData()

  const views = [
    { id: "subject", icon: LayoutGrid, label: t("bySubject") },
    { id: "mock", icon: ClipboardCheck, label: t("mockTests") },
    { id: "weekly", icon: Calendar, label: t("weeklyTests") },
    { id: "topic", icon: BookOpen, label: t("topicWise") },
  ]

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
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>{t("accuracy")} & {t("speed")}</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{t("trackProgress")}</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className={`flex flex-wrap gap-1.5 p-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-gray-50/50 border-gray-100"} rounded-xl border`}>
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => {
                setActiveView(view.id)
                if (addActivity) addActivity("Changed View", `Switched to ${view.label} view`)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${activeView === view.id
                ? (darkMode ? "bg-slate-800 text-orange-400 shadow-lg border border-orange-500/20" : "bg-orange-500 text-white shadow-md")
                : (darkMode ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-orange-500")
                }`}
            >
              <view.icon size={14} />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {activeView === "subject" && (
        <div className="flex justify-start mb-4">
          <div className={`flex flex-wrap gap-1.5 p-1 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-gray-50/50 border-gray-100"} rounded-xl border`}>
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => {
                  setSelectedSubjectFilter(subj)
                  if (addActivity) addActivity("Filtered Accuracy", `Filtered by ${subj}`)
                }}
                className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${selectedSubjectFilter === subj
                  ? (darkMode ? "bg-slate-800 text-orange-400 shadow-lg" : "bg-orange-500 text-white shadow-md")
                  : (darkMode ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-orange-500")
                  }`}
              >
                {t(subj) || subj}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Card */}
        <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 ${darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"} rounded-lg`}>
                <Activity size={18} />
              </div>
              <h3 className={`text-base font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
                {views.find(v => v.id === activeView)?.label} {t("comparison")}
              </h3>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#f1f5f9"} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dx={-10} />
                <Tooltip
                  cursor={{ fill: darkMode ? 'rgba(30, 41, 59, 0.5)' : '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#f8fafc' : '#000' }}
                />
                <Bar dataKey="accuracy" fill={darkMode ? "#fb923c" : "#f97316"} radius={[4, 4, 4, 4]} barSize={24} name={`${t("accuracy")} %`} />
                <Bar dataKey="speed" fill={darkMode ? "rgba(251, 146, 60, 0.4)" : "#fed7aa"} radius={[4, 4, 4, 4]} barSize={24} name={`${t("speed")} %`} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2 custom-scrollbar">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{t("subjectProgress")}</h3>
          {filteredData.map((data, index) => (
            <div
              key={index}
              className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm transition-all hover:border-orange-200 group relative overflow-hidden`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h4 className={`text-lg font-black tracking-tight ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{data.label}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    {data.date && <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{data.date}</span>}
                    {data.exams && <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">{data.exams} {t("examsAttempted")}</span>}
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="text-right">
                    <div className={`text-xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{data.accuracy}%</div>
                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{t("accuracy")}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{data.speed}%</div>
                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{t("speed")}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-1.5">
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${data.accuracy}%` }}></div>
                </div>
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="bg-orange-300 h-full rounded-full transition-all duration-1000" style={{ width: `${data.speed}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AccuracyDetail