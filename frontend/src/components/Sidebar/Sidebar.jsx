import { useNavigate, useLocation } from "react-router-dom"
import { useAppContext } from "../../context/AppContext"
import { Sun, Moon, LogOut, X } from "lucide-react"

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { darkMode, setDarkMode, logout } = useAppContext()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/admin" },
    { id: "students", label: "Student Details", icon: "👥", path: "/admin/students" },
    { id: "content", label: "Content Portal", icon: "📁", path: "/admin/content" },
    { id: "analytics", label: "Analytics", icon: "📈", path: "/admin/analytics" },
    { id: "progress", label: "Progress", icon: "🎯", path: "/admin/progress" },
    { id: "feedback", label: "Feedback", icon: "💬", path: "/admin/feedback" },
    { id: "reports", label: "School Reports", icon: "📝", path: "/admin/reports" },
    { id: "neet", label: "Question Bank", icon: "📚", path: "/admin/neet" },
    { id: "reffered", label: "Reffered", icon: "👥", path: "/admin/reffered" },
    { id: "practice-requests", label: "Practice Requests", icon: "✅", path: "/admin/practice-requests" }
  ]

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
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-10 h-10 bg-orange-500 text-white rounded-lg font-bold shrink-0"
            >
              FYC
            </button>
            {sidebarOpen && (
              <div className="min-w-0">
                <h3 className="text-white font-semibold truncate">Admin Panel</h3>
                <p className="text-xs text-slate-400">Dashboard</p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-white lg:hidden animate-in fade-in duration-300"
            >
              <X size={24} />
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
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-400 hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
