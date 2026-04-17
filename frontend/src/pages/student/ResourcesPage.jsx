import React, { useState, useEffect } from "react";
import { BookOpen, FileUp, Search, Download, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { API_BASE_URL } from "../../services/axiosInstance";
import axios from "../../services/axiosInstance";

const ResourcesPage = () => {
    const { darkMode, t, addActivity } = useAppContext();
    const [activeTab, setActiveTab] = useState("textbooks");
    const [searchQuery, setSearchQuery] = useState("");
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('11');
    const [expandedSubjects, setExpandedSubjects] = useState(['Physics']);

    const cardBg = darkMode ? "bg-slate-900/40 backdrop-blur-md" : "bg-white";
    const borderColor = darkMode ? "border-slate-800/60" : "border-orange-200";

    useEffect(() => {
        fetchResources();
    }, [activeTab]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const type = activeTab === "textbooks" ? "TEXTBOOK" : "PYQ";
            const response = await axios.get(`/materials/${type}`);
            setResources(response.data);
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const downloadFile = (resource) => {
        if (!resource.fileUrl) return;

        const encodedKey = resource.fileUrl.split('/').map(segment => encodeURIComponent(segment)).join('/');
        const fileUrl = `${API_BASE_URL}/admin/content/files/${encodedKey}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', resource.fileName || 'document.pdf');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();

        addActivity(`Downloaded ${activeTab === 'textbooks' ? 'Textbook' : 'PYQ'}`, resource.title);
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Study Materials</h1>
                    <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Access Textbooks and Previous Year Questions</p>
                </div>

                <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab("textbooks")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "textbooks" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} />
                            <span>Textbooks</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("pyqs")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "pyqs" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        <div className="flex items-center gap-2">
                            <FileUp size={16} />
                            <span>PYQs</span>
                        </div>
                    </button>
                </div>
            </div>

            {activeTab === 'textbooks' && (
                <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setSelectedClass("11")}
                        className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${selectedClass === "11" ? "bg-white dark:bg-slate-700 text-orange-500 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        Class 11th
                    </button>
                    <button
                        onClick={() => setSelectedClass("12")}
                        className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${selectedClass === "12" ? "bg-white dark:bg-slate-700 text-orange-500 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        Class 12th
                    </button>
                </div>
            )}

            <div className={`${cardBg} border ${borderColor} rounded-2xl p-4 sm:p-6`}>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500 transition-all ${darkMode ? "bg-slate-800/50 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-medium">Loading materials...</p>
                    </div>
                ) : activeTab === "textbooks" ? (
                    <div className="space-y-12">
                        {["Physics", "Chemistry", "Biology"].map(subject => {
                            const subjectResources = filteredResources.filter(res => 
                                res.subject === subject && (
                                    res.classLevel === selectedClass || 
                                    res.classLevel === 'Both' || 
                                    (!res.classLevel && selectedClass === '11')
                                )
                            );
                            
                            const isExpanded = expandedSubjects.includes(subject);

                            return (
                                <div key={subject} className="space-y-6">
                                    <div 
                                        className="flex items-center justify-between cursor-pointer group/header"
                                        onClick={() => {
                                            if (isExpanded) setExpandedSubjects(expandedSubjects.filter(s => s !== subject));
                                            else setExpandedSubjects([...expandedSubjects, subject]);
                                        }}
                                    >
                                        <div className="flex items-center gap-4 border-l-4 border-orange-500 pl-4">
                                            <div className={`p-2 rounded-lg transition-all ${isExpanded ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold transition-colors ${isExpanded ? (darkMode ? "text-orange-400" : "text-orange-600") : (darkMode ? "text-white" : "text-slate-900")}`}>{subject}</h3>
                                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Class {selectedClass} • {subjectResources.length} Materials</p>
                                            </div>
                                        </div>
                                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                            <ChevronDown size={20} className={darkMode ? 'text-slate-600' : 'text-slate-300'} />
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                            {subjectResources.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {subjectResources.map(res => (
                                                        <div key={res.id} className={`group relative p-5 rounded-2xl border transition-all hover:shadow-xl ${darkMode ? "bg-slate-800/40 border-slate-700 hover:border-orange-500/30" : "bg-slate-50 border-slate-100 hover:border-orange-200"}`}>
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className={`p-3 rounded-xl ${darkMode ? "bg-slate-700 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                                                                    <BookOpen size={24} />
                                                                </div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); downloadFile(res); }}
                                                                    className={`p-2 rounded-lg bg-orange-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600 shadow-lg shadow-orange-500/20`}
                                                                >
                                                                    <Download size={18} />
                                                                </button>
                                                            </div>
                                                            
                                                            <div>
                                                                <h3 className={`font-bold text-lg mb-1 truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{res.title}</h3>
                                                                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-600"}`}>
                                                                        {res.subject}
                                                                    </span>
                                                                    {res.classLevel && (
                                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                                                                            Class {res.classLevel}
                                                                        </span>
                                                                    )}
                                                                    {res.pages && <span>{res.pages} pages</span>}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                                                                <span className="text-xs text-slate-400 font-medium">Uploaded on {new Date(res.uploadedAt).toLocaleDateString()}</span>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); downloadFile(res); }}
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
                                                <div className={`p-10 rounded-2xl border-2 border-dashed text-center ${darkMode ? "border-slate-800 text-slate-600" : "border-slate-100 text-slate-400"}`}>
                                                    <p className="font-bold text-sm italic">No {subject} textbooks found for Class {selectedClass}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map(res => (
                            <div key={res.id} className={`group relative p-5 rounded-2xl border transition-all hover:shadow-xl ${darkMode ? "bg-slate-800/40 border-slate-700 hover:border-orange-500/30" : "bg-slate-50 border-slate-100 hover:border-orange-200"}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${darkMode ? "bg-slate-700 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                                        <FileText size={24} />
                                    </div>
                                    <button
                                        onClick={() => downloadFile(res)}
                                        className={`p-2 rounded-lg bg-orange-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-600 shadow-lg shadow-orange-500/20`}
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                                
                                <div>
                                    <h3 className={`font-bold text-lg mb-1 truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{res.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${darkMode ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                                            Year: {res.year || 'N/A'}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-600"}`}>
                                            Class {res.classLevel}
                                        </span>
                                        {res.pages && <span>{res.pages} pages</span>}
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                                    <span className="text-xs text-slate-400 font-medium">Uploaded on {new Date(res.uploadedAt).toLocaleDateString()}</span>
                                    <button 
                                        onClick={() => downloadFile(res)}
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
                            <Search className="text-slate-400" size={32} />
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>No materials found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm italic font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcesPage;
