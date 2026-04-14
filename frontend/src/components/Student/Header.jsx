import React, { useState, useEffect } from "react"
import { Globe, Menu, X, Moon, Sun, Bell, User, Power, CheckCircle, BellOff } from "lucide-react"
import { fetchNotifications as fetchNotificationsApi, markAllNotificationsAsRead } from "../../utils/api"

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  showLanguageMenu,
  setShowLanguageMenu,
  language,
  setLanguage,
  t,
  cardBg,
  borderColor,
  setShowProfileModal,
  notificationsEnabled,
  setNotificationsEnabled,
  userProfile
}) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const languages = ["english", "hindi", "tamil", "telugu", "marathi", "gujarati", "bengali", "malayalam"]
  const nativeLanguageNames = {
    english: "English",
    hindi: "हिन्दी",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    bengali: "বাংলা",
    malayalam: "മലയാളം"
  }


  const [recentNotifications, setRecentNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Polling every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await fetchNotificationsApi();

      // Transform data for display (calculate time ago) and filter out read notifications
      const formatted = data
        .filter(n => !n.isRead) // Only show unread notifications
        .map(n => ({
          id: n.id,
          text: n.text,
          time: getTimeAgo(n.timestamp),
          read: n.isRead
        }));

      setRecentNotifications(formatted);
      setUnreadCount(formatted.length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        // Mark all current notifications as read in local state
        setRecentNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const localeMap = {
    english: 'en-US',
    hindi: 'hi-IN',
    tamil: 'ta-IN',
    telugu: 'te-IN',
    marathi: 'mr-IN',
    gujarati: 'gu-IN',
    bengali: 'bn-BD',
    malayalam: 'ml-IN'
  }

  return (
    <header
      className={`flex items-center justify-between px-4 sm:px-8 py-4 ${darkMode ? "bg-slate-950/80 border-slate-900 text-slate-100 backdrop-blur-md" : "bg-white border-orange-50 text-gray-900"
        } border-b transition-all duration-300 sticky top-0 z-30`}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 ${darkMode
            ? "bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800"
            : "bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100"
            } active:scale-95`}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="flex flex-col">
          <h2 className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{t("dashboard") || "Overview"}</h2>
          <p className={`text-sm sm:text-base font-bold capitalize leading-tight ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
            {new Date().toLocaleDateString(localeMap[language] || 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all relative ${darkMode ? "bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800" : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>}
          </button>

          {showNotifications && (
            <div className={`absolute top-14 -right-12 sm:right-0 w-[calc(100vw-32px)] sm:w-80 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200 ${darkMode ? "bg-slate-950 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "bg-white border-orange-100 shadow-xl"} border rounded-2xl z-50 overflow-hidden`}>
              <div className={`p-4 border-b ${darkMode ? "border-slate-800 bg-slate-900/50" : "border-gray-100 bg-white"} flex items-center justify-between`}>
                <h3 className={`font-black text-[10px] uppercase tracking-widest ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{t("notifications")}</h3>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${notificationsEnabled
                    ? (darkMode ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600")
                    : (darkMode ? "bg-slate-800 text-slate-500" : "bg-gray-100 text-gray-400")}`}
                >
                  {notificationsEnabled ? <CheckCircle size={10} /> : <BellOff size={10} />}
                  {notificationsEnabled ? t("turnOff") : t("turnOn")}
                </button>
              </div>
              <div className={`max-h-64 overflow-y-auto ${darkMode ? "bg-slate-950" : "bg-white"}`}>
                {recentNotifications.length > 0 ? (
                  recentNotifications.map(notif => (
                    <div key={notif.id} className={`p-4 border-b ${darkMode ? "border-slate-900 hover:bg-slate-900/50" : "border-gray-50 hover:bg-gray-50"} transition-colors cursor-pointer group`}>
                      <p className={`text-sm font-bold ${darkMode ? "text-slate-200 group-hover:text-white" : "text-gray-700"}`}>{notif.text}</p>
                      <span className={`text-[10px] ${darkMode ? "text-slate-500" : "text-gray-400"} font-medium`}>{notif.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${darkMode ? "bg-slate-900 text-slate-700" : "bg-gray-50 text-gray-300"}`}>
                      <BellOff size={24} />
                    </div>
                    <p className={`text-xs font-bold ${darkMode ? "text-slate-500" : "text-gray-400"} uppercase tracking-widest`}>
                      No New Notifications
                    </p>
                  </div>
                )}
              </div>
              <div className={`p-3 text-center ${darkMode ? "bg-slate-900/30" : "bg-gray-50"}`}>
                <button
                  onClick={handleMarkAllAsRead}
                  className={`text-[10px] font-black ${darkMode ? "text-orange-400 hover:text-orange-300" : "text-orange-500 hover:text-orange-600"} uppercase tracking-widest transition-colors`}
                >
                  Mark All as Read
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`w-px h-6 ${darkMode ? "bg-slate-800" : "bg-gray-200"} mx-1`}></div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-orange-50 text-orange-500 border border-orange-100"
            }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Language Selection */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className={`flex items-center gap-2 p-2.5 px-3 rounded-xl transition-all ${darkMode
              ? "bg-slate-900 text-slate-400 hover:text-slate-100 border border-slate-800"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
              }`}
          >
            <Globe size={18} />
            <span className="text-xs font-black uppercase tracking-widest hidden sm:block">{language.substring(0, 3)}</span>
          </button>

          {showLanguageMenu && (
            <div className={`absolute top-14 right-0 w-48 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200 ${cardBg} border ${borderColor} rounded-2xl shadow-xl z-50 overflow-hidden p-1.5`}>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang)
                    setShowLanguageMenu(false)
                  }}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${language === lang
                    ? (darkMode ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-orange-500 text-white shadow-sm")
                    : (darkMode ? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" : "text-gray-500 hover:bg-orange-50 hover:text-orange-600")
                    }`}
                >
                  {nativeLanguageNames[lang] || lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          onClick={() => setShowProfileModal(true)}
          className={`ml-2 flex items-center gap-3 p-1 rounded-xl transition-all border border-transparent ${darkMode ? "hover:bg-slate-900 hover:border-slate-800" : "hover:bg-orange-50 hover:border-orange-100"} group`}
        >
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <User size={18} />
          </div>
          <div className="flex flex-col text-left hidden md:flex">
            <span className={`text-xs font-black ${darkMode ? "text-slate-200" : "text-gray-800"} leading-none`}>{userProfile?.name || "Guest"}</span>
            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-tighter mt-0.5">Gold Member</span>
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header
