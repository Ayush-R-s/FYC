"use client"

import { useState } from "react"
import PerformanceDetailsModal from "./PerformanceDetailModal"

export default function StudentPerformance({
  studentsData = [],
  searchTerm,
  setSearchTerm
}) {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showModal, setShowModal] = useState(false)


  const filtered = (studentsData || []).filter(student =>
    student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Performance</h2>

      <input
        className="w-full mb-4 p-3 border rounded-lg"
        placeholder="Search student..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No students found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => (
                <tr key={student.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.email}</td>
                  <td className="p-3">{student.status || "N/A"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedStudent(student)
                        setShowModal(true)
                      }}
                      className="text-orange-600 font-medium"
                    >
                      View Performance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <PerformanceDetailsModal
          student={selectedStudent}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          studentsData={studentsData}
          selectedSegment={null}
          setSelectedSegment={() => { }}
        />
      )}
    </div>
  )
}
