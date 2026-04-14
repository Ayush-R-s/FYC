"use client"

import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar/Sidebar"
import { Menu } from "lucide-react"
import { useAppContext } from "../context/AppContext"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Responsive sidebar default
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true)
    }
  }, [])

  // Enforce light mode in this layout
  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
    document.body.classList.remove('dark');
  }, []);

  // Format module name based on path
  const getModuleName = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('students')) return 'Students';
    if (path.includes('content')) return 'Content';
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('progress')) return 'Progress';
    if (path.includes('feedback')) return 'Feedback';
    if (path.includes('reports')) return 'Reports';
    return 'Admin';
  }

  return (
    <div className={`min-h-[100dvh] flex bg-slate-50 transition-colors duration-300`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} ml-0`}>
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex flex-col items-end">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Admin</h2>
            <p className="text-sm font-bold text-gray-800">{getModuleName()}</p>
          </div>
        </header>

        <main className="flex-1 transition-all duration-300 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
