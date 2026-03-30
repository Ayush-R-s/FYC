import React, { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Zap, BookOpen, ChevronRight, Award, Target, FileText, LayoutGrid, Calendar, ClipboardCheck, PlayCircle } from "lucide-react"
import TopicAnalytics from "./TopicAnalytics"

const Dashboard = ({
  mockDashboardData,
  accuracySpeedDrilldown,
  currentStudent,
  getStudentCategory,
  setShowAccuracyDetail,
  setShowTutorialDetail,
  setShowLearningProgress,
  darkMode,
  cardBg,
  borderColor,
  t,
  addActivity,
  testHistory
}) => {
  const [accuracyView, setAccuracyView] = useState("overall")
  const category = getStudentCategory(currentStudent?.overallProgress || 0)

  const handleDrilldown = (type, setter) => {
    setter(true)
    if (addActivity) {
      addActivity("Viewed Analytics", `Drilled down into ${type}`)
    }
  }

  const getAccuracyData = () => {
    const calculateAverage = (data, key) => {
      if (!data || data.length === 0) return 0
      const sum = data.reduce((acc, curr) => acc + (curr[key] || 0), 0)
      return Math.round(sum / data.length)
    }

    switch (accuracyView) {
      case "mock":
        return {
          accuracy: calculateAverage(accuracySpeedDrilldown?.byDate, "accuracy"),
          speed: calculateAverage(accuracySpeedDrilldown?.byDate, "speed")
        }
      case "weekly":
        return {
          accuracy: calculateAverage(accuracySpeedDrilldown?.byWeekly, "accuracy"),
          speed: calculateAverage(accuracySpeedDrilldown?.byWeekly, "speed")
        }
      case "topic":
        return {
          accuracy: calculateAverage(accuracySpeedDrilldown?.byTopic, "accuracy"),
          speed: calculateAverage(accuracySpeedDrilldown?.byTopic, "speed")
        }
      default:
        return {
          accuracy: mockDashboardData?.accuracy || 0,
          speed: mockDashboardData?.speed || 0
        }
    }
  }

  const currentStats = getAccuracyData()

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overall Progress & Master Stats */}
      <div className={`${cardBg} p-4 sm:p-8 rounded-2xl border ${borderColor} shadow-sm relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <TrendingUp size={14} className="sm:size-[16px]" />
              </div>
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t("overallProgress")}</h2>
            </div>
            <h1 className={`text-3xl md:text-5xl font-black mb-4 tracking-tighter ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>
              {currentStudent.overallProgress}% <span className="text-sm sm:text-lg md:text-xl text-orange-500 italic font-bold">{t("successRate")}</span>
            </h1>
            <div className={`w-full ${darkMode ? "bg-slate-800/50" : "bg-orange-100/30"} h-4 rounded-full overflow-hidden mb-4 p-0.5 border ${darkMode ? "border-slate-700/50" : "border-orange-100"}`}>
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${currentStudent.overallProgress}%` }}
              ></div>
            </div>
            <p className={`text-[10px] sm:text-sm font-medium ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
              {t("currentStanding")}: <span className={`${darkMode ? "text-orange-400" : "text-orange-600"} font-bold`}>{t(category.label.charAt(0).toLowerCase() + category.label.slice(1).replace(/\s+/g, ""))}</span>.
            </p>
          </div>

          <button
            onClick={() => handleDrilldown("Learning Progress", setShowLearningProgress)}
            className={`w-full lg:w-auto group/btn flex items-center justify-center gap-3 px-6 py-4 sm:py-3 ${darkMode ? "bg-slate-50 text-slate-950 hover:bg-orange-400" : "bg-gray-900 text-white hover:bg-orange-600"} rounded-xl transition-all duration-300 shadow-md active:scale-95`}
          >
            <span className="text-sm font-bold tracking-tight">{t("drilldown")}</span>
            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Triple Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Performance Card */}
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group`}>
          <div className={`w-20 h-20 ${darkMode ? "bg-orange-500/10" : "bg-orange-50"} rounded-xl flex items-center justify-center mb-4 relative`}>
            <Target size={32} className={`${darkMode ? "text-orange-400" : "text-orange-500"} relative z-10`} />
            <div className={`absolute inset-0 ${darkMode ? "bg-orange-400/10" : "bg-orange-500/5"} rounded-xl animate-pulse`}></div>
          </div>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t("totalPerformance")}</h3>
          <p className={`text-[10px] mb-4 font-bold ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{currentStudent.name}</p>
          <div className={`text-2xl md:text-3xl font-black mb-6 ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{currentStudent.overallProgress}%</div>
          <span className={`px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest ${category.color} ${darkMode ? "bg-slate-800/50" : category.bgColor} border border-white/10`}>
            {t(category.label.charAt(0).toLowerCase() + category.label.slice(1).replace(/\s+/g, ""))}
          </span>
        </div>

        {/* Accuracy & Speed Card */}
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 relative group`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className={`${darkMode ? "text-orange-400" : "text-orange-500"}`} />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("accuracy")} & {t("speed")}</h3>
            </div>
            <button
              onClick={() => handleDrilldown("Accuracy & Speed", setShowAccuracyDetail)}
              className={`p-1.5 ${darkMode ? "bg-slate-900 text-slate-100 border border-slate-700 shadow-lg" : "bg-gray-200 text-gray-700 border border-gray-300"} rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm active:scale-90`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* View Selector for Card */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "overall", icon: LayoutGrid, label: t("overall") },
              { id: "mock", icon: ClipboardCheck, label: t("mockTests") },
              { id: "weekly", icon: Calendar, label: t("weeklyTests") },
              { id: "topic", icon: BookOpen, label: t("topicWise") },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setAccuracyView(view.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${accuracyView === view.id
                  ? (darkMode ? "bg-slate-800 text-orange-400 border border-orange-500/30" : "bg-orange-50 text-orange-600 border border-orange-200")
                  : (darkMode ? "text-slate-500 hover:text-slate-300 border border-transparent" : "text-gray-400 hover:text-orange-500 border border-transparent")
                  } border`}
              >
                <view.icon size={12} />
                <span className="text-[9px] font-black uppercase tracking-tight">{view.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-black text-gray-400 uppercase">{t("accuracy")}</span>
                <span className={`text-xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{currentStats.accuracy}%</span>
              </div>
              <div className={`w-full ${darkMode ? "bg-slate-800" : "bg-gray-100"} h-1.5 rounded-full overflow-hidden`}>
                <div className={`${darkMode ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]" : "bg-orange-500"} h-full rounded-full transition-all duration-500`} style={{ width: `${currentStats.accuracy}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-black text-gray-400 uppercase">{t("speed")}</span>
                <span className={`text-xl font-black ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{currentStats.speed}%</span>
              </div>
              <div className={`w-full ${darkMode ? "bg-slate-800" : "bg-gray-100"} h-1.5 rounded-full overflow-hidden`}>
                <div className={`${darkMode ? "bg-orange-400/80 shadow-[0_0_8px_rgba(251,146,60,0.2)]" : "bg-orange-400"} h-full rounded-full transition-all duration-500`} style={{ width: `${currentStats.speed}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Card */}
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md transition-all duration-300 relative group`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PlayCircle size={18} className="text-orange-500" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("videoTutorials")} {t("completionRate")}</h3>
            </div>
            <button
              onClick={() => handleDrilldown("Tutorials", setShowTutorialDetail)}
              className={`p-1.5 ${darkMode ? "bg-slate-900 text-slate-100 border border-slate-700 shadow-lg" : "bg-gray-200 text-gray-700 border border-gray-300"} rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm active:scale-90`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-between flex-1 py-4">
            <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke={darkMode ? "rgba(30, 41, 59, 0.4)" : "#fff7ed"} strokeWidth="10" />
                <circle cx="64" cy="64" r="58" fill="transparent" stroke={darkMode ? "#fb923c" : "#f97316"} strokeWidth="10" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * mockDashboardData.tutorialCompletion.percentage) / 100} strokeLinecap="round" className="transition-all duration-1000 shadow-[0_0_10px_rgba(251,146,60,0.4)]" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-3xl md:text-4xl font-black tracking-tighter ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{mockDashboardData.tutorialCompletion.percentage}%</span>
                <span className={`text-[8px] md:text-[10px] font-black ${darkMode ? "text-slate-500" : "text-gray-400"} uppercase tracking-[0.2em] -mt-1`}>/ 100%</span>
              </div>
            </div>

            <div className="w-full flex justify-center mt-auto pt-4">
              <span className={`inline-flex items-center justify-center px-6 py-3 rounded-2xl text-[13px] md:text-sm font-black uppercase tracking-[0.2em] shadow-lg transition-all duration-300 ${darkMode
                ? "bg-slate-900/80 text-orange-400 border border-orange-500/30 shadow-orange-500/10"
                : "bg-orange-50 text-orange-600 border border-orange-200 shadow-orange-100"
                }`}>
                {mockDashboardData.tutorialCompletion.completed} / {mockDashboardData.tutorialCompletion.total} {t("completed")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-2 mb-8">
            <FileText size={18} className={`${darkMode ? "text-orange-400" : "text-orange-500"}`} />
            <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>{t("mockTestScores")}</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDashboardData.dailyMockScores}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#f1f5f9"} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dx={-10} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', backgroundColor: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#f8fafc' : '#000' }}
                  itemStyle={{ color: darkMode ? '#fb923c' : '#f97316' }}
                />
                <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp size={18} className={`${darkMode ? "text-orange-400" : "text-orange-500"}`} />
            <h3 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>{t("weeklyScores")}</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDashboardData.weeklyTestScores}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#f1f5f9"} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dx={-10} />
                <Tooltip cursor={{ fill: darkMode ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#f8fafc' : '#000' }} />
                <Bar dataKey="score" fill={darkMode ? "#fb923c" : "#f97316"} radius={[4, 4, 4, 4]} barSize={24} />
                <Bar dataKey="target" fill={darkMode ? "rgba(251, 146, 60, 0.2)" : "#fed7aa"} radius={[4, 4, 4, 4]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Topic-wise Detailed Analytics */}
      <TopicAnalytics testHistory={testHistory || []} darkMode={darkMode} />
    </div>
  )
}

export default Dashboard
