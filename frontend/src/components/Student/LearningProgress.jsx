import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ArrowLeft, BookOpen, TrendingUp, Award } from "lucide-react"

const LearningProgress = ({
  mockDashboardData,
  onBack,
  darkMode,
  cardBg,
  borderColor,
  t
}) => {
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
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${darkMode ? "text-slate-50 drop-shadow-sm" : "text-gray-900"}`}>{t("learningProgress")}</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{t("trackProgress")}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`p-3 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-orange-50 border-orange-100"} rounded-xl border flex items-center gap-3`}>
            <Award className={`${darkMode ? "text-orange-400" : "text-orange-500"}`} size={20} />
            <div>
              <div className={`text-[8px] font-black ${darkMode ? "text-orange-400/70" : "text-orange-400"} uppercase tracking-widest`}>{t("mastery")}</div>
              <div className={`text-xs font-black ${darkMode ? "text-slate-200" : "text-gray-800"} leading-none`}>{t("advancedTier")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} shadow-sm`}>
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp size={18} className={`${darkMode ? "text-orange-400" : "text-orange-500"}`} />
            <h3 className={`text-base font-bold ${darkMode ? "text-slate-200" : "text-gray-800"}`}>{t("subjectProgress")}</h3>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDashboardData?.subjectProgress || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#374151" : "#f1f5f9"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dx={-10} />
                <Tooltip
                  cursor={{ fill: darkMode ? 'rgba(30, 41, 59, 0.5)' : '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#f8fafc' : '#000' }}
                />
                <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={40}>
                  {(mockDashboardData?.subjectProgress || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">{t("subjectProgress")}</h3>
          {(mockDashboardData?.subjectProgress || []).map((subject, index) => (
            <div
              key={index}
              className={`${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm transition-all hover:border-orange-200 group relative overflow-hidden`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: subject.color }}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-black tracking-tight ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{t(subject.name.toLowerCase())}</h4>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t("trackProgress")}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-black tracking-tighter ${darkMode ? "text-slate-50" : "text-gray-900"}`}>{subject.value}%</div>
                  <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{t("mastery")}</div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className={`w-full ${darkMode ? "bg-slate-900" : "bg-gray-100"} h-2 rounded-full overflow-hidden`}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${subject.value}%`,
                      backgroundColor: subject.color,
                      boxShadow: darkMode ? `0 0 12px ${subject.color}40` : 'none'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LearningProgress