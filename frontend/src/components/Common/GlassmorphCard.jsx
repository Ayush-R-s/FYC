"use client"

const GlassmorphCard = ({ title, value, change, trend, icon, gradient }) => (
  <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-slate-200">
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-600 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg text-2xl`}>{icon}</div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span>{trend === "up" ? "📈" : "📉"}</span>
        <span className={`font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {change > 0 ? "+" : ""}{change}%
        </span>
        <span className="text-slate-600">vs last period</span>
      </div>
    </div>
  </div>
)

export default GlassmorphCard