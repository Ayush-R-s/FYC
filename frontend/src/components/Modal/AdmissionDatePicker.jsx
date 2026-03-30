import { useState } from "react"

export default function AdmissionDatePicker({ isOpen, onClose, onApply, currentDate }) {
    const [mode, setMode] = useState("day") // day, week, month, year
    const [selectedDate, setSelectedDate] = useState(
        currentDate ? new Date(currentDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
    )
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    if (!isOpen) return null

    const handleApply = () => {
        let result = { mode, date: null }

        if (mode === "day") {
            result.date = new Date(selectedDate)
        } else if (mode === "week") {
            result.date = new Date(selectedDate)
        } else if (mode === "month") {
            const [year, month] = selectedDate.split("-")
            result.date = new Date(parseInt(year), parseInt(month) - 1, 1)
        } else if (mode === "year") {
            result.date = new Date(selectedYear, 0, 1)
        }

        onApply(result)
        onClose()
    }

    const handleReset = () => {
        onApply(null)
        onClose()
    }

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Select Date Range</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-orange-100 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Mode Tabs */}
                <div className="flex border-b border-slate-200">
                    {["day", "week", "month", "year"].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${mode === m
                                    ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Date Selection */}
                <div className="p-6">
                    {mode === "day" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select a Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            />
                        </div>
                    )}

                    {mode === "week" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select a Week
                            </label>
                            <input
                                type="week"
                                value={selectedDate.substring(0, 4) + "-W" + getWeekNumber(new Date(selectedDate))}
                                onChange={(e) => {
                                    const [year, week] = e.target.value.split("-W")
                                    const date = getDateFromWeek(parseInt(year), parseInt(week))
                                    setSelectedDate(date.toISOString().split("T")[0])
                                }}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            />
                        </div>
                    )}

                    {mode === "month" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select a Month
                            </label>
                            <input
                                type="month"
                                value={selectedDate.substring(0, 7)}
                                onChange={(e) => setSelectedDate(e.target.value + "-01")}
                                max={new Date().toISOString().substring(0, 7)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            />
                        </div>
                    )}

                    {mode === "year" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select a Year
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Info Text */}
                    <p className="mt-4 text-sm text-slate-500">
                        {mode === "day" && "View admissions for a specific day"}
                        {mode === "week" && "View admissions for a specific week"}
                        {mode === "month" && "View admissions for a specific month"}
                        {mode === "year" && "View admissions for a specific year"}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-4 bg-slate-50 border-t border-slate-200">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                    >
                        Reset to Today
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

// Helper functions
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7).toString().padStart(2, "0")
}

function getDateFromWeek(year, week) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7)
    const dayOfWeek = simple.getDay()
    const ISOweekStart = simple
    if (dayOfWeek <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    }
    return ISOweekStart
}
