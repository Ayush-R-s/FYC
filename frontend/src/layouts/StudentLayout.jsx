"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Student/Sidebar"
import Header from "../components/Student/Header"
import ProfileModal from "../components/Student/ProfileModal"
import { useAppContext } from "../context/AppContext"

export default function StudentLayout() {
  const {
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    t,
    userProfile,
    currentStudent,
    notificationsEnabled,
    setNotificationsEnabled
  } = useAppContext();

  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Responsive sidebar default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
  const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

  // Apply theme locally
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Optional: cleanup to reset theme when leaving student section
    return () => {
      document.documentElement.dataset.theme = 'light';
      document.body.classList.remove('dark');
    };
  }, [darkMode]);

  return (
    <div className={`min-h-[100dvh] flex ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-gray-900"}`}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        t={t}
      />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          showLanguageMenu={showLanguageMenu}
          setShowLanguageMenu={setShowLanguageMenu}
          language={language}
          setLanguage={setLanguage}
          t={t}
          cardBg={cardBg}
          borderColor={borderColor}
          setShowProfileModal={setShowProfileModal}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          userProfile={userProfile}
        />

        <main className="flex-1 transition-all duration-300 p-4 sm:p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        userProfile={userProfile || {}} 
        currentStudent={currentStudent || {}} 
        darkMode={darkMode} 
        t={t} 
      />
    </div>
  )
}
