import React, { useState, useEffect } from "react";
import { Calendar, Download, Search, FileText, ChevronRight, Clock } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { API_BASE_URL } from "../../services/axiosInstance";
import axios from "../../services/axiosInstance";

const TimetablePage = () => {
    const { darkMode, t, addActivity } = useAppContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    useEffect(() => {
        fetchTimetables();
    }, []);

    const fetchTimetables = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/materials/TIMETABLE");
            setTimetables(response.data);
        } catch (error) {
            console.error("Error fetching timetables:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTimetables = timetables.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const downloadFile = (item) => {
        if (!item.fileUrl) return;

        const encodedKey = item.fileUrl.split('/').map(segment => encodeURIComponent(segment)).join('/');
        const fileUrl = `${API_BASE_URL}/admin/content/files/${encodedKey}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', item.fileName || 'timetable.pdf');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();

        addActivity("Downloaded Timetable", item.title);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Timetable</h1>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Stay organized with your class and exam schedules</p>
            </div>

            <div className={`${cardBg} border ${borderColor} rounded-2xl p-4 sm:p-6`}>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search timetables..."
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500 transition-all ${darkMode ? "bg-slate-800/50 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Loading timetables...</p>
                    </div>
                ) : filteredTimetables.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTimetables.map(item => (
                            <div key={item.id} className={`group relative p-5 rounded-2xl border transition-all hover:shadow-xl ${darkMode ? "bg-slate-800/40 border-slate-700 hover:border-orange-500/30" : "bg-slate-50 border-slate-100 hover:border-orange-200"}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${darkMode ? "bg-slate-700 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                                        <Calendar size={24} />
                                    </div>
                                    <button
                                        onClick={() => downloadFile(item)}
                                        className={`p-2 rounded-lg bg-orange-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600 shadow-lg shadow-orange-500/20`}
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                                
                                <div>
                                    <h3 className={`font-bold text-lg mb-1 truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{item.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        {item.category && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                                                Class {item.category}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium">{item.fileName}</span>
                                    <button 
                                        onClick={() => downloadFile(item)}
                                        className="flex items-center gap-1 text-orange-500 font-bold text-xs group-hover:gap-2 transition-all"
                                    >
                                        <span>Download</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-slate-400" size={32} />
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>No timetables found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm italic font-medium">No timetables have been uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimetablePage;
