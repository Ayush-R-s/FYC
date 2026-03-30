"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar/Sidebar"
import { Menu } from "lucide-react"
import { useAppContext } from "../context/AppContext"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  return (
    <div className={`min-h-[100dvh] flex bg-slate-50 transition-colors duration-300`}>
      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-orange-500 text-white rounded-lg shadow-lg lg:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main
        className={`flex-1 transition-all duration-300 p-6 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          } ml-0`}
      >
        <Outlet />
      </main>

    </div>
  )
}
