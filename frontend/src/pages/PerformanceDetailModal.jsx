"use client"

import { useEffect, useState } from "react"
import { getStudentPerformance } from "../services/studentService"

export default function PerformanceDetailsModal({
  student,
  isOpen,
  onClose
}) {
  const [performance, setPerformance] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!student) return

    setLoading(true)
    getStudentPerformance(student.id)
      .then(data => {
        setPerformance(data || [])
      })
      .catch(err => {
        console.error("Failed to load performance", err)
        setPerformance([])
      })
      .finally(() => setLoading(false))
  }, [student])

  if (!isOpen || !student) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Student Performance</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* STUDENT INFO */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {student.name}</div>
            <div><strong>Email:</strong> {student.email}</div>
            <div><strong>Mobile:</strong> {student.mobile}</div>
            <div><strong>Status:</strong> {student.status}</div>
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="p-6">
          <h3 className="font-semibold mb-3">Performance Records</h3>

          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && performance.length === 0 && (
            <p className="text-gray-500">No performance data available.</p>
          )}

          {!loading && performance.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Subject</th>
                    <th className="p-2 text-left">Score</th>
                    <th className="p-2 text-left">Remarks</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {performance.map((p, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{p.subject}</td>
                      <td className="p-2">{p.score}</td>
                      <td className="p-2">{p.remarks || "-"}</td>
                      <td className="p-2">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
