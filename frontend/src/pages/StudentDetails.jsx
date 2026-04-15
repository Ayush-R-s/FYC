"use client"

import { useEffect, useState } from "react"
import {
  getAllStudents,
  getStudentById
} from "../services/studentService"

import PerformanceDetailsModal from "../components/Modal/PerformanceDetailsModal"
import AddStudentModal from "../components/Modal/AddStudentModal"
import { Plus } from "lucide-react"

export default function StudentDetails() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showPerformance, setShowPerformance] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleViewStudent = async (student) => {
    try {
      setSelectedStudent(null); // Reset for loader
      setShowPerformance(true);
      const detailedStudent = await getStudentById(student.studentId || student.id);
      if (detailedStudent && Object.keys(detailedStudent).length > 2) {
        setSelectedStudent(detailedStudent);
      } else {
        setSelectedStudent(student);
      }
    } catch (err) {
      console.error("Failed to load details", err);
      setSelectedStudent(student);
    }
  }

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    try {
      const data = await getAllStudents()
      setStudents(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load students", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // ================= FILTER =================
  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(s.id).includes(searchTerm)
  )

  if (loading) return <div className="p-8 text-center">Loading students...</div>

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-black tracking-tight">Students ({students.length})</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="w-full p-3 border rounded-lg"
        placeholder="Search by name, email or Student ID"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* TABLE - HIDDEN ON MOBILE */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">School</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-mono">{student.studentId || '--'}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="p-3">{student.schoolName || 'N/A'}</td>
                <td className="p-3 flex gap-3 justify-center">
                  <button
                    onClick={() => handleViewStudent(student)}
                    className="text-blue-600 hover:underline disabled:opacity-50"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <p className="p-6 text-center text-gray-500">No students found</p>
        )}
      </div>

      {/* MOBILE CARD LIST */}
      <div className="md:hidden space-y-4">
        {filteredStudents.map(student => (
          <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900">{student.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{student.studentId || '--'}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${student.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >
                {student.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Email</p>
                <p className="text-slate-700 truncate">{student.email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">School</p>
                <p className="text-slate-700 truncate">{student.schoolName || 'N/A'}</p>
              </div>
            </div>

            <button
              onClick={() => handleViewStudent(student)}
              className="w-full py-2.5 bg-slate-50 text-blue-600 font-bold rounded-lg border border-blue-100 active:bg-blue-50 transition-colors mt-1"
            >
              View Details
            </button>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-200">
            <p className="text-gray-400 text-sm">No students found matching your search</p>
          </div>
        )}
      </div>

      {/* PERFORMANCE MODAL (Unified Dashboard) */}
      <PerformanceDetailsModal
        isOpen={showPerformance}
        student={selectedStudent}
        studentsData={students}
        onClose={() => setShowPerformance(false)}
        onDeleteSuccess={fetchStudents}
      />

      {/* ADD STUDENT MODAL */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchStudents}
      />
    </div>
  )
}
