"use client"
import { useState, useRef } from 'react'

export default function PieChart({ data = [], selectedSegment: externalSelected = null, onSegmentHover = () => {} }) {
  const [selectedSegment, setSelectedSegment] = useState(null)
  const containerRef = useRef(null)
  
  const validData = data.filter(item => 
    item && 
    typeof item.passRate === 'number' && 
    !isNaN(item.passRate) && 
    item.passRate >= 0 && 
    item.passRate <= 100
  )
  
  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <p className="text-slate-500 text-sm">No valid data available</p>
        </div>
      </div>
    )
  }
  
  const colors = ["#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"]
  const total = validData.reduce((sum, s) => sum + s.passRate, 0)
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2" />
          <text x="100" y="100" textAnchor="middle" fill="#6b7280" fontSize="14" dy=".3em">
            No Data
          </text>
        </svg>
      </div>
    )
  }
  
  let currentAngle = -90
  const segments = []
  
  for (let idx = 0; idx < validData.length; idx++) {
    const subject = validData[idx]
    const sliceAngle = (subject.passRate / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle
    
    const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180)
    const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180)
    const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180)
    const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180)
    
    const largeArc = sliceAngle > 180 ? 1 : 0
    const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`
    
    segments.push({
      path,
      color: colors[idx % colors.length],
      subjectName: subject.subject || "Unknown",
      passRate: subject.passRate || 0,
      attendance: subject.attendancePercentile || 0,
      idx
    })
    
    currentAngle = endAngle
  }

  const active = selectedSegment !== null ? selectedSegment : externalSelected
  
  const handleSegmentClick = (idx) => {
    setSelectedSegment(selectedSegment === idx ? null : idx)
    onSegmentHover(selectedSegment === idx ? null : idx)
  }
  
  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {segments.map((seg) => (
            <path
              key={seg.idx}
              d={seg.path}
              fill={seg.color}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleSegmentClick(seg.idx)}
            />
          ))}
        </svg>
      </div>
      
      {active !== null && segments[active] && (
        <div 
          className="absolute left-1/2 min-w-[140px] text-center p-3 bg-white rounded-lg shadow-lg border border-slate-200 z-50 whitespace-nowrap pointer-events-none"
          style={{
            bottom: '-90px',
            transform: 'translateX(-50%)'
          }}
        >
          <p className="font-semibold text-slate-900">{segments[active].subjectName}</p>
          <p className="text-sm text-slate-600">Pass Rate: {segments[active].passRate.toFixed(1)}%</p>
          <p className="text-sm text-slate-600">Attendance: {segments[active].attendance.toFixed(1)}%</p>
        </div>
      )}
    </div>
  )
}