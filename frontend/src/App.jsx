import React, { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

const MainLayout = lazy(() => import("./layouts/MainLayout"))
const AuthLayout = lazy(() => import("./layouts/AuthLayout"))
const AdminLayout = lazy(() => import("./layouts/AdminLayout"))
const StudentLayout = lazy(() => import("./layouts/StudentLayout"))

const Home = lazy(() => import("./pages/Home"))
const About = lazy(() => import("./pages/About"))
const Contact = lazy(() => import("./pages/Contact"))

const StudentLogin = lazy(() => import("./pages/auth/StudentLogin"))
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"))

const Dashboard = lazy(() => import("./pages/Dashboard"))
const StudentDetails = lazy(() => import("./pages/StudentDetails"))
const ContentManagement = lazy(() => import("./components/ContentManagement/ContentManagement"))
const EditStudent = lazy(() => import("./pages/EditStudent"))
const Reference = lazy(() => import("./pages/Reference"))

const Analytics = lazy(() => import("./pages/Analytics"))
const Progress = lazy(() => import("./pages/Progress"))
const Feedback = lazy(() => import("./pages/FeedbackManagement"))

const StudentFeedback = lazy(() => import("./pages/student/FeedbackPage"))
const Tests = lazy(() => import("./pages/student/TestsPage"))
const Videos = lazy(() => import("./pages/student/VideosPage"))
const StudentHome = lazy(() => import("./pages/student/Home"))
const NotesPage = lazy(() => import("./pages/student/NotesPage"))
const SettingsPage = lazy(() => import("./pages/student/SettingsPage"))
const AccuracyPage = lazy(() => import("./pages/student/AccuracyPage"))
const TutorialsPage = lazy(() => import("./pages/student/TutorialsPage"))
const ProgressPage = lazy(() => import("./pages/student/ProgressPage"))

const StreaksPage = lazy(() => import("./pages/student/StreaksPage"))
const BadgesPage = lazy(() => import("./pages/student/BadgesPage"))
const LeaderboardPage = lazy(() => import("./pages/student/LeaderboardPage"))
const ResourcesPage = lazy(() => import("./pages/student/ResourcesPage"))
const SchoolReportPage = lazy(() => import("./pages/admin/SchoolReportPage"))
const NeetQuestionsPage = lazy(() => import("./pages/admin/NeetQuestionsPage"))
const TimetablePage = lazy(() => import("./pages/student/TimetablePage"))
const PracticePage = lazy(() => import("./pages/student/PracticePage"))


export default function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-orange-500 font-black uppercase tracking-widest text-[10px]">Loading FYC...</p>
          </div>
        </div>
      }>
        <Routes>

          {/* PUBLIC */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* AUTH */}
          <Route element={<AuthLayout />}>
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Route>

          {/* ADMIN */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/students" element={<StudentDetails />} />
            <Route path="/admin/students/:id/edit" element={<EditStudent />} />
            <Route path="/admin/content" element={<ContentManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/progress" element={<Progress />} />
            <Route path="/admin/feedback" element={<Feedback />} />
            <Route path="/admin/reports" element={<SchoolReportPage />} />
            <Route path="/admin/neet" element={<NeetQuestionsPage />} />
            <Route path="/admin/reffered" element={<Reference />} />
          </Route>

          <Route element={<StudentLayout />}>
            <Route path="/student" element={<StudentHome />} />
            <Route path="/student/notes" element={<NotesPage />} />
            <Route path="/student/settings" element={<SettingsPage />} />
            <Route path="/student/accuracy" element={<AccuracyPage />} />
            <Route path="/student/tutorials" element={<TutorialsPage />} />
            <Route path="/student/progress" element={<ProgressPage />} />
            <Route path="/student/tests" element={<Tests />} />
            <Route path="/student/videos" element={<Videos />} />
            <Route path="/student/feedback" element={<StudentFeedback />} />
            <Route path="/student/streaks" element={<StreaksPage />} />
            <Route path="/student/badges" element={<BadgesPage />} />
            <Route path="/student/leaderboard" element={<LeaderboardPage />} />
            <Route path="/student/resources" element={<ResourcesPage />} />
            <Route path="/student/timetable" element={<TimetablePage />} />
            <Route path="/student/practice" element={<PracticePage />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
