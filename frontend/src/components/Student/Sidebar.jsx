import { useNavigate, useLocation } from "react-router-dom"
import { useAppContext } from "../../context/AppContext"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  PlayCircle,
  Trophy,
  Award,
  Flame,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Target,
  Calendar,
  PenTool
} from "lucide-react"

export default function Sidebar({ sidebarOpen, setSidebarOpen, t }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAppContext()

  // Helper to safely use translation function
  const translate = (key, fallback) => (t && t(key)) || fallback;

  const menuItems = [
    { id: "dashboard", label: translate("dashboard", "Dashboard"), icon: LayoutDashboard, path: "/student" },
    { id: "streaks", label: translate("streaks", "Streaks"), icon: Flame, path: "/student/streaks" },
    { id: "resources", label: translate("study_materials", "Study Materials"), icon: BookOpen, path: "/student/resources" },
    { id: "notes", label: translate("notes", "Notes"), icon: FileText, path: "/student/notes" },
    { id: "timetable", label: translate("timetable", "Timetable"), icon: Calendar, path: "/student/timetable" },
    { id: "tests", label: translate("tests", "Tests"), icon: Target, path: "/student/tests" },
    { id: "videos", label: translate("videos", "Videos"), icon: PlayCircle, path: "/student/videos" },
    { id: "badges", label: translate("badges", "Badges"), icon: Award, path: "/student/badges" },
    { id: "leaderboard", label: translate("leaderboard", "Leaderboard"), icon: Trophy, path: "/student/leaderboard" },
    { id: "feedback", label: translate("feedback", "Feedback"), icon: MessageSquare, path: "/student/feedback" },
    { id: "settings", label: translate("settings", "Settings"), icon: Settings, path: "/student/settings" },
  ];

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-[100dvh] z-50 transition-all duration-300
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
        bg-slate-900 border-r border-slate-800 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/student")}
              className="w-10 h-10 bg-orange-500 text-white rounded-lg font-bold flex items-center justify-center shrink-0"
            >
              A
            </button>
            {sidebarOpen && (
              <div className="min-w-0">
                <h3 className="text-white font-semibold truncate text-sm">Student Panel</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dash</p>
              </div>
            )}
          </div>
          
          {/* Mobile Close Button */}
          {sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive(item.path)
                  ? "bg-orange-500 text-white shadow"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <item.icon size={22} strokeWidth={1.5} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-400 hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut size={22} strokeWidth={1.5} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
