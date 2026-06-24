"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService";
import { apiService } from "../services/apiService";
import { analyticsService } from "../services/analyticsService";

import GlassmorphCard from "../components/Common/GlassmorphCard"
import { useAppContext } from "../context/AppContext"

export default function Dashboard() {
  const navigate = useNavigate()
  const { darkMode } = useAppContext()

  const [studentsData, setStudentsData] = useState([])
  const [statsData, setStatsData] = useState(null)
  const [loading, setLoading] = useState(true)

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, statsResponse] = await Promise.all([
          getAllStudents().catch(err => {
            console.warn("Could not fetch students (might be restricted)", err);
            return [];
          }),
          analyticsService.getOverallStats().catch(err => {
            console.warn("Could not fetch stats", err);
            return null;
          })
        ]);

        // ✅ SAFETY CHECK FOR STUDENTS
        if (Array.isArray(studentsResponse)) {
          setStudentsData(studentsResponse)
        } else if (Array.isArray(studentsResponse?.data)) {
          setStudentsData(studentsResponse.data)
        } else {
          setStudentsData([])
        }

        setStatsData(statsResponse)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-600">
        Loading dashboard...
      </div>
    )
  }

  const safeStudents = Array.isArray(studentsData) ? studentsData : []

  // ================== CALCULATIONS ==================
  const calculateStats = () => {
    const totalStudents = safeStudents.length
    const activeStudents = safeStudents.filter(s => s.status === "ACTIVE").length
    const inactiveStudents = safeStudents.filter(s => s.status !== "ACTIVE").length

    return {
      totalStudents: { value: statsData?.totalStudents ?? totalStudents, trend: "up" },
      activeStudents: { value: statsData?.activeMonthly ?? activeStudents, trend: "up" },
      avgTestScore: { value: statsData?.avgTestScore ?? "--", trend: "up" },
      inactiveStudents: { value: inactiveStudents, trend: "down" }
    }
  }

  const stats = calculateStats()

  const recentActivity = safeStudents.slice(0, 5).map((s, i) => ({
    id: i + 1,
    student: s.name,
    action: "Updated profile",
    time: `${i + 1}h ago`
  }))

  // ================== UI ==================
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassmorphCard title="Total Students" value={stats.totalStudents.value} />
        <GlassmorphCard title="Active Students" value={stats.activeStudents.value} />
        <GlassmorphCard title="Average Score" value={stats.avgTestScore.value} />
        <GlassmorphCard title="Inactive Students" value={stats.inactiveStudents.value} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-100 p-6 rounded-xl transition-colors duration-300">
        <h3 className="font-semibold mb-4 text-gray-900">Recent Activity</h3>

        {recentActivity.map(a => (
          <div
            key={a.id}
            className="flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-slate-100 cursor-pointer"
            onClick={() => navigate(`/students/${a.student}`)}
          >
            <div className="bg-orange-100 text-orange-600 flex items-center justify-center rounded-full font-bold w-10 h-10">
              {a.student[0]}
            </div>
            <div>
              <p className="font-medium text-gray-900">{a.student}</p>
              <p className="text-sm text-gray-500">{a.action}</p>
            </div>
            <div className="ml-auto text-sm text-gray-400">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
