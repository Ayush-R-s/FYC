"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getAllStudents,
  createStudent,
  deleteStudent,
  updateStudent
} from "../services/studentService"

import { AddStudentModal } from "../components/Modal"
import PerformanceDetailsModal from "../components/Modal/PerformanceDetailsModal"

export default function StudentDetails() {
  const navigate = useNavigate()

  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showPerformance, setShowPerformance] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

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

  // ================= DELETE =================
  const handleDelete = async () => {
    await deleteStudent(selectedStudent.id)
    setStudents(prev => prev.filter(s => s.id !== selectedStudent.id))
    setShowDelete(false)
    setSelectedStudent(null)
  }

  // ================= FILTER =================
  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(s.id).includes(searchTerm)
  )

  if (loading) {
    return <div className="p-8 text-center">Loading students...</div>
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students ({students.length})</h1>
        <button
          onClick={() => {
            setSelectedStudent(null)
            setIsEditMode(false)
            setShowAdd(true)
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          + Add Student
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="w-full p-3 border rounded-lg"
        placeholder="Search by name, email or ID"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className="border-b hover:bg-slate-50">
                <td className="p-3">{student.id}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="p-3 flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSelectedStudent(student)
                      setShowPerformance(true)
                    }}
                    className="text-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStudent(student)
                      setIsEditMode(true)
                      setShowAdd(true)
                    }}
                    className="text-orange-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStudent(student)
                      setShowDelete(true)
                    }}
                    className="text-red-600"
                  >
                    Delete
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

      {/* ADD / EDIT MODAL */}
      <AddStudentModal
        isOpen={showAdd}
        student={selectedStudent}
        isEdit={isEditMode}
        onClose={() => {
          setShowAdd(false)
          setSelectedStudent(null)
        }}
        onAdd={async (data) => {
          if (isEditMode && selectedStudent) {
            await updateStudent(selectedStudent.id, data)
          } else {
            await createStudent(data)
          }
          await fetchStudents()
          setShowAdd(false)
        }}
      />

      {/* PERFORMANCE MODAL */}
      <PerformanceDetailsModal
        isOpen={showPerformance}
        student={selectedStudent}
        onClose={() => setShowPerformance(false)}
      />

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[350px]">
            <h3 className="text-lg font-semibold mb-4">Delete Student?</h3>
            <p className="mb-4">
              Are you sure you want to delete <b>{selectedStudent?.name}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
