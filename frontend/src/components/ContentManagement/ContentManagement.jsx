import React, { useState, useEffect } from 'react';
import { FileText, Video, FileUp, Plus, Search, Download, Edit, Trash2, X, Upload, Clock, Moon, Sun, Trash, Sparkles, LayoutGrid, Target, BookOpen, ChevronDown } from 'lucide-react';
import AIQuestionGenerator from './modals/AIQuestionGenerator';
import UploadNotesModal from './modals/UploadNotesModal';
import UploadVideoModal from './modals/UploadVideoModal';
import TestBuilder from './modals/TestBuilder';
import FileViewerModal from './modals/FileViewerModal';
import VideoPlayerModal from './modals/VideoPlayerModal';
import QuestionPool from './modals/QuestionPool';
import { getAllContent, getAllTests, deleteContent, deleteTest, updateNote, updateVideoApi } from '../../services/contentPortalApi';

const ContentManagement = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('notes');
    const [showTestBuilder, setShowTestBuilder] = useState(false);
    const [showUploadNotes, setShowUploadNotes] = useState(false);
    const [showUploadVideo, setShowUploadVideo] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);
    const [viewingFile, setViewingFile] = useState(null);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [editingTest, setEditingTest] = useState(null);
    const [showQuestionPool, setShowQuestionPool] = useState(false);

    const [notes, setNotes] = useState([]);
    const [textbooks, setTextbooks] = useState([]);
    const [pyqs, setPyqs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('11'); // For Textbooks folder system
    const [expandedSubjects, setExpandedSubjects] = useState(['Physics']); // Default open folder

    // Fetch data from backend on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [contentData, testsData] = await Promise.all([
                getAllContent(),
                getAllTests()
            ]);

            // Separate content into notes and videos based on type
            const notesData = contentData.filter(item => item.contentType === 'NOTES');
            const textbooksData = contentData.filter(item => item.contentType === 'TEXTBOOK');
            const pyqsData = contentData.filter(item => item.contentType === 'PYQ');
            const videosData = contentData.filter(item => item.type === 'VIDEO' || item.contentType === 'VIDEO');

            setNotes(notesData);
            setTextbooks(textbooksData);
            setPyqs(pyqsData);
            setVideos(videosData);
            setTests(testsData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data from server');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentContent = () => {
        let allContent;
        if (activeTab === 'notes') allContent = notes;
        else if (activeTab === 'textbooks') allContent = textbooks;
        else if (activeTab === 'pyqs') allContent = pyqs;
        else if (activeTab === 'videos') allContent = videos;
        else allContent = tests;

        return allContent.filter(item => (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const handleViewFile = (file) => {
        setViewingFile(file);
    };

    const handlePlayVideo = (video) => {
        setPlayingVideo(video);
    };

    const stats = [
        { icon: FileText, color: 'blue', label: 'Total Notes', value: notes.length },
        { icon: Video, color: 'purple', label: 'Total Videos', value: videos.length },
        { icon: FileUp, color: 'orange', label: 'Total Tests', value: tests.length },
    ];

    const tabs = [
        { id: 'notes', label: 'Notes', icon: FileText },
        { id: 'textbooks', label: 'Textbooks', icon: BookOpen },
        { id: 'pyqs', label: 'PYQs', icon: FileUp },
        { id: 'videos', label: 'Tutorial Videos', icon: Video },
        { id: 'tests', label: 'Tests', icon: Target },
    ];

    const getTopicColor = (topic) => {
        if (!topic) return '';
        const colors = [
            { light: 'bg-blue-100 text-blue-700', dark: 'bg-blue-900/30 text-blue-300' },
            { light: 'bg-emerald-100 text-emerald-700', dark: 'bg-emerald-900/30 text-emerald-300' },
            { light: 'bg-purple-100 text-purple-700', dark: 'bg-purple-900/30 text-purple-300' },
            { light: 'bg-pink-100 text-pink-700', dark: 'bg-pink-900/30 text-pink-300' },
            { light: 'bg-indigo-100 text-indigo-700', dark: 'bg-indigo-900/30 text-indigo-300' },
            { light: 'bg-teal-100 text-teal-700', dark: 'bg-teal-900/30 text-teal-300' },
            { light: 'bg-orange-100 text-orange-700', dark: 'bg-orange-900/30 text-orange-300' },
            { light: 'bg-rose-100 text-rose-700', dark: 'bg-rose-900/30 text-rose-300' },
        ];

        // Simple hash function to get a stable index for a string
        let hash = 0;
        for (let i = 0; i < topic.length; i++) {
            hash = topic.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colors.length;
        return darkMode ? colors[index].dark : colors[index].light;
    };

    return (
        <div className={`transition-all duration-300 flex flex-col gap-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Content Management</h1>
                    <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage Learning Materials, Videos and Tests</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowQuestionPool(true)}
                        className={`px-4 py-2 sm:py-3 rounded-lg border flex items-center gap-2 font-bold transition-all ${darkMode ? 'bg-orange-950/30 border-orange-500/30 text-orange-500 hover:bg-orange-500/20' : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'}`}
                    >
                        <Sparkles className="w-4 h-4 sm:w-5 h-5" />
                        <span className="text-xs sm:text-sm">Question Bank</span>
                    </button>
                    <button onClick={() => setDarkMode(!darkMode)} className={`p-2 sm:p-3 rounded-lg border flex items-center gap-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        {darkMode ? <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500" /> : <Moon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                        blue: darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-500',
                        purple: darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-500',
                        orange: darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-50 text-orange-500'
                    };
                    return (
                        <div key={idx} className={`rounded-2xl shadow-sm p-4 sm:p-6 border transition-all ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100 hover:shadow-md'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-xl sm:text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                                    <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`rounded-xl shadow-md border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                <div className={`border-b px-4 sm:px-6 overflow-x-auto ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex gap-4 sm:gap-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-2 sm:px-4 border-b-2 flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${activeTab === tab.id ? 'border-orange-500 text-orange-500 font-semibold' : darkMode ? 'border-transparent text-gray-400' : 'border-transparent text-gray-600'}`}>
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={`p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                        <div className="flex-1 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                                <input type="text" placeholder="Search content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm sm:text-base ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`} />
                            </div>

                            {activeTab === 'textbooks' && (
                                <div className="flex bg-slate-100 dark:bg-gray-700 p-1 rounded-xl w-fit self-center sm:self-auto">
                                    <button
                                        onClick={() => setSelectedCategory('11')}
                                        className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedCategory === '11' ? 'bg-white dark:bg-gray-600 shadow-sm text-orange-600' : 'text-gray-500'}`}
                                    >
                                        11th
                                    </button>
                                    <button
                                        onClick={() => setSelectedCategory('12')}
                                        className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedCategory === '12' ? 'bg-white dark:bg-gray-600 shadow-sm text-orange-600' : 'text-gray-500'}`}
                                    >
                                        12th
                                    </button>
                                </div>
                            )}
                        </div>

                        <button onClick={() => {
                            if (activeTab === 'notes' || activeTab === 'textbooks' || activeTab === 'pyqs') setShowUploadNotes(true);
                            else if (activeTab === 'videos') setShowUploadVideo(true);
                            else setShowTestBuilder(true);
                        }} className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm sm:text-base whitespace-nowrap">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {activeTab === 'notes' ? 'Upload Notes' :
                                    activeTab === 'textbooks' ? 'Upload Textbook' :
                                        activeTab === 'pyqs' ? 'Upload PYQ' :
                                            activeTab === 'videos' ? 'Upload Video' : 'Create Test'}
                            </span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {loading ? (
                        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <div className="animate-pulse">Loading...</div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    ) : getCurrentContent().length === 0 ? (
                        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <p>No {activeTab} found. Start by uploading some content!</p>
                        </div>
                    ) : activeTab === 'textbooks' ? (
                    <div className="space-y-8">
                        {['Physics', 'Chemistry', 'Biology'].map(subject => {
                            const subjectTextbooks = getCurrentContent().filter(item =>
                                item.subject === subject && (
                                    item.category === selectedCategory || 
                                    (!item.category && selectedCategory === '11')
                                )
                            );
                            const isExpanded = expandedSubjects.includes(subject);

                            return (
                                <div key={subject} className="space-y-4">
                                    <div 
                                        className="flex items-center justify-between cursor-pointer group/header"
                                        onClick={() => {
                                            if (isExpanded) setExpandedSubjects(expandedSubjects.filter(s => s !== subject));
                                            else setExpandedSubjects([...expandedSubjects, subject]);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isExpanded ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : (darkMode ? 'bg-orange-950/30 text-orange-500' : 'bg-orange-50 text-orange-600')}`}>
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className={`font-black uppercase tracking-widest text-sm transition-colors ${isExpanded ? (darkMode ? 'text-orange-400' : 'text-orange-600') : (darkMode ? 'text-gray-400' : 'text-slate-500')}`}>{subject}</h3>
                                                <p className="text-[10px] font-bold opacity-40 uppercase">Class {selectedCategory} • {subjectTextbooks.length} Books</p>
                                            </div>
                                        </div>
                                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-slate-300'}`} />
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            {subjectTextbooks.length === 0 ? (
                                                <div className={`p-8 rounded-2xl border-2 border-dashed text-center text-xs font-bold opacity-40 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                                                    No textbooks uploaded for {subject} (Class {selectedCategory})
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {subjectTextbooks.map((item) => (
                                                        <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all group gap-4 ${darkMode ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-50 text-orange-500'}`}>
                                                                    <FileText className="w-5 h-5" />
                                                                </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <h4 className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                                                                                item.category 
                                                                                ? (darkMode ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-100 text-gray-500 border-gray-200')
                                                                                : (darkMode ? 'bg-red-900/40 text-red-300 border-red-800' : 'bg-red-50 text-red-500 border-red-100')
                                                                            }`}>
                                                                                {item.category ? `Class ${item.category}` : (item.category === null ? 'CLASS: NULL' : 'CLASS: UNDEF')}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                                                            <span>{item.fileName}</span>
                                                                            {item.pages && <span>• {item.pages} Pages</span>}
                                                                        </p>
                                                                    </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button 
                                                                    onClick={(e) => { 
                                                                        e.stopPropagation(); 
                                                                        // Ensure classLevel is initialized to avoid null-save issues
                                                                        setEditingNote({
                                                                            ...item,
                                                                            category: item.category || selectedCategory
                                                                        }); 
                                                                    }}
                                                                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button 
                                                                    onClick={async (e) => {
                                                                        e.stopPropagation();
                                                                        if (confirm(`Delete this textbook?`)) {
                                                                            await deleteContent(item.id);
                                                                            setTextbooks(textbooks.filter(n => n.id !== item.id));
                                                                        }
                                                                    }}
                                                                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-2 sm:space-y-3">
                        {getCurrentContent().map((item) => (
                            <div key={item.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all group gap-4 ${darkMode ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white border-slate-100 hover:shadow-lg hover:shadow-slate-200/50'}`}>
                                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0 w-full">
                                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${activeTab === 'notes' ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') : activeTab === 'videos' ? (darkMode ? 'bg-purple-900/30' : 'bg-purple-50') : (darkMode ? 'bg-orange-900/30' : 'bg-orange-50')}`}>
                                        {activeTab === 'notes' && <FileText className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />}
                                        {activeTab === 'videos' && <Video className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />}
                                        {activeTab === 'tests' && <FileUp className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                            <h3 className={`font-bold text-sm sm:text-lg truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                                            {item.topic && activeTab !== 'pyqs' && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getTopicColor(item.topic)}`}>
                                                    {item.topic}
                                                </span>
                                            )}
                                            {item.year && activeTab === 'pyqs' && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-orange-100 text-orange-600 uppercase tracking-widest">
                                                    Year: {item.year}
                                                </span>
                                            )}
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                                                item.category 
                                                ? 'bg-gray-100 text-gray-500' 
                                                : 'bg-red-50 text-red-500 border-red-100'
                                            }`}>
                                                {item.category ? `Class ${item.category}` : (item.category === null ? 'CLASS: NULL' : 'CLASS: UNDEF')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-x-3 gap-y-1 mt-1 flex-wrap">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 ${darkMode ? 'bg-gray-700 text-gray-400' : 'text-slate-500'}`}>
                                                {activeTab === 'pyqs' ? 'Previous Year Questions' : (item.subject === 'all' ? 'All Subjects' : item.subject)}
                                            </span>
                                            {activeTab === 'tests' && item.testType && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${darkMode ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                    {item.testType}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                                {activeTab === 'notes' && (<span className="flex items-center gap-1"><Download className="w-3" />{item.downloads || 0}</span>)}
                                                {activeTab === 'videos' && (<span className="flex items-center gap-1"><Clock className="w-3" />{item.duration}</span>)}
                                                {activeTab === 'tests' && (
                                                    <>
                                                        <span className="flex items-center gap-1">
                                                            <LayoutGrid className="w-3 h-3 text-blue-500" />
                                                            {Array.isArray(item.questions) ? item.questions.length : (item.questions || 0)} Questions
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Target className="w-3 h-3 text-orange-500" />
                                                            {item.duration || '0 min'}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions - Always visible list on mobile, hover on desktop */}
                                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 justify-end">
                                    <button
                                        onClick={() => {
                                            if (activeTab === 'notes' || activeTab === 'textbooks' || activeTab === 'pyqs') setEditingNote({
                                                ...item,
                                                category: item.category || '11'
                                            });
                                            else if (activeTab === 'videos') setEditingVideo({
                                                ...item,
                                                category: item.category || '11'
                                            });
                                            else if (activeTab === 'tests') { setEditingTest(item); setShowTestBuilder(true); }
                                        }}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 sm:p-2.5 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-blue-400' : 'bg-slate-50 hover:bg-blue-50 text-blue-600'} transition-colors border border-transparent hover:border-blue-100`}
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="sm:hidden text-xs font-bold">Edit</span>
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (confirm(`Delete this ${activeTab === 'notes' ? 'note' : activeTab === 'textbooks' ? 'textbook' : activeTab === 'pyqs' ? 'PYQ' : activeTab === 'videos' ? 'video' : 'test'}?`)) {
                                                try {
                                                    if (activeTab === 'tests') {
                                                        await deleteTest(item.id);
                                                        setTests(tests.filter(t => t.id !== item.id));
                                                    } else {
                                                        await deleteContent(item.id);
                                                        if (activeTab === 'notes') setNotes(notes.filter(n => n.id !== item.id));
                                                        else if (activeTab === 'textbooks') setTextbooks(textbooks.filter(n => n.id !== item.id));
                                                        else if (activeTab === 'pyqs') setPyqs(pyqs.filter(n => n.id !== item.id));
                                                        else setVideos(videos.filter(v => v.id !== item.id));
                                                    }
                                                } catch (err) {
                                                    alert('Failed to delete item. Please try again.');
                                                }
                                            }
                                        }}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 sm:p-2.5 rounded-xl ${darkMode ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'} transition-colors border border-transparent hover:border-red-200`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="sm:hidden text-xs font-bold">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>

            {showTestBuilder && (
                <TestBuilder
                    onClose={() => { setShowTestBuilder(false); setEditingTest(null); }}
                    darkMode={darkMode}
                    editingTestData={editingTest}
                    onPublish={(test, isUpdating) => {
                        if (isUpdating) {
                            setTests(tests.map(t => t.id === test.id ? test : t));
                        } else {
                            setTests([...tests, test]);
                        }
                        setShowTestBuilder(false);
                        setEditingTest(null);
                    }}
                />
            )}

            {showUploadNotes && (
                <UploadNotesModal
                    onClose={() => setShowUploadNotes(false)}
                    darkMode={darkMode}
                    intendedType={activeTab}
                    initialCategory={selectedCategory}
                    onUpload={(note) => {
                        if (note.contentType === 'TEXTBOOK') {
                            console.log('>>> TEXTBOOK SAVED SUCCESSFULLY (UPLOAD):', note);
                            setTextbooks([...textbooks, note]);
                        }
                        else if (note.contentType === 'PYQ') setPyqs([...pyqs, note]);
                        else setNotes([...notes, note]);
                        setShowUploadNotes(false);
                    }}
                />
            )}

            {showUploadVideo && (
                <UploadVideoModal
                    onClose={() => setShowUploadVideo(false)}
                    darkMode={darkMode}
                    onUpload={(video) => {
                        setVideos([...videos, video]);
                        setShowUploadVideo(false);
                    }}
                />
            )}

            {viewingFile && (
                <FileViewerModal
                    file={viewingFile}
                    darkMode={darkMode}
                    onClose={() => setViewingFile(null)}
                />
            )}

            {playingVideo && (
                <VideoPlayerModal
                    video={playingVideo}
                    darkMode={darkMode}
                    onClose={() => setPlayingVideo(null)}
                />
            )}

            {editingNote && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
                    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
                        <div className={`p-6 border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} flex items-center justify-between sticky top-0`}>
                            <h2 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Notes</h2>
                            <button onClick={() => setEditingNote(null)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                                <input type="text" value={editingNote.title} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} />
                            </div>
                             {editingNote.contentType !== 'PYQ' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Class</label>
                                        <select value={editingNote.classLevel || '11'} onChange={(e) => setEditingNote({ ...editingNote, classLevel: e.target.value })} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`}>
                                            <option value="11">11th</option>
                                            <option value="12">12th</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                                        <select value={editingNote.subject} onChange={(e) => setEditingNote({ ...editingNote, subject: e.target.value })} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`}>
                                            <option>Physics</option>
                                            <option>Chemistry</option>
                                            <option>Biology</option>
                                            <option>Botany</option>
                                            <option>Zoology</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Class</label>
                                        <select value={editingNote.category || '11'} onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value })} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-800 text-white' : 'border-gray-300'}`}>
                                            <option value="11">11th</option>
                                            <option value="12">12th</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Exam Year</label>
                                        <input type="text" value={editingNote.year || ''} onChange={(e) => setEditingNote({ ...editingNote, year: e.target.value })} placeholder="e.g. 2023" className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} />
                                    </div>
                                </div>
                            )}
                            {editingNote.contentType !== 'PYQ' && (
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Topic</label>
                                    <input type="text" value={editingNote.topic || ''} onChange={(e) => setEditingNote({ ...editingNote, topic: e.target.value })} placeholder="Enter topic" className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} />
                                </div>
                            )}
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current File</label>
                                <div className={`border-2 rounded-lg p-4 ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <FileText className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                                        <div className="flex-1">
                                            <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{editingNote.fileName}</p>
                                        </div>
                                        <button onClick={() => {
                                            if (editingNote.newFile) {
                                                const localUrl = URL.createObjectURL(editingNote.newFile);
                                                handleViewFile({ ...editingNote, fileUrl: localUrl, isLocal: true });
                                            } else {
                                                handleViewFile({ ...editingNote, fileUrl: editingNote.fileUrl || editingNote.fileName });
                                            }
                                        }} className={`px-3 py-1 border rounded text-sm font-semibold ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-blue-400' : 'border-gray-300 hover:bg-gray-100 text-blue-500'}`}>
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Replace File (Optional)</label>
                                <label className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-orange-500 cursor-pointer block transition-colors ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Click to upload new file or drag here</p>
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>PDF, Word documents, or text files</p>
                                    <input type="file" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setEditingNote({
                                                ...editingNote,
                                                fileName: file.name,
                                                newFile: file // Store the actual file object for uploading
                                            });
                                        }
                                    }} accept=".pdf,.docx,.doc,.txt" className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} flex gap-3 justify-end sticky bottom-0`}>
                            <button onClick={() => setEditingNote(null)} className={`px-6 py-2 border rounded-lg ${darkMode ? 'border-gray-600 hover:bg-gray-800 text-white' : 'border-gray-300'}`}>Cancel</button>
                            <button onClick={async () => {
                                try {
                                    console.log(`DEBUG: Updating note ${editingNote.id} with title: "${editingNote.title}", category: "${editingNote.category}", subject: "${editingNote.subject}"`);
                                    const updated = await updateNote(
                                        editingNote.id,
                                        editingNote.newFile,
                                        editingNote.title,
                                        editingNote.subject,
                                        editingNote.topic,
                                        editingNote.pages,
                                        editingNote.content || '',
                                        editingNote.contentType,
                                        editingNote.category,
                                        editingNote.year
                                    );
                                    if (updated.contentType === 'TEXTBOOK') {
                                        console.log('>>> TEXTBOOK SAVED SUCCESSFULLY (UPDATE):', updated);
                                        setTextbooks(textbooks.map(n => n.id === editingNote.id ? updated : n));
                                    }
                                    else if (updated.contentType === 'PYQ') setPyqs(pyqs.map(n => n.id === editingNote.id ? updated : n));
                                    else setNotes(notes.map(n => n.id === editingNote.id ? updated : n));
                                    setEditingNote(null);
                                    alert('Content updated successfully!');
                                } catch (error) {
                                    console.error('Update failed:', error);
                                    if (error.response) {
                                        console.error('Server response:', error.response.data);
                                    }
                                    alert(`Failed to update: ${error.response?.data?.message || error.message}`);
                                } finally {
                                    setLoading(false);
                                }
                            }} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {editingVideo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
                    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col`}>
                        <div className={`p-6 border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} flex items-center justify-between sticky top-0`}>
                            <h2 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Video</h2>
                            <button onClick={() => setEditingVideo(null)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto flex-1">
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                                <input type="text" value={editingVideo.title} onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                                    <select value={editingVideo.subject} onChange={(e) => setEditingVideo({ ...editingVideo, subject: e.target.value })} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`}>
                                        <option>Physics</option>
                                        <option>Chemistry</option>
                                        <option>Biology</option>
                                        <option>Botany</option>
                                        <option>Zoology</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Class Level</label>
                                    <select value={editingVideo.category || '11'} onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })} className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`}>
                                        <option value="11">Class 11th</option>
                                        <option value="12">Class 12th</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Video</label>
                                <div className={`border-2 rounded-lg p-3 text-center ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                                    <div className={`w-full aspect-video rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-2`}>
                                        <Video className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                                    </div>
                                    <p className={`font-semibold text-xs mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{editingVideo.fileName}</p>
                                    <button onClick={() => {
                                        if (editingVideo.newFile) {
                                            const localUrl = URL.createObjectURL(editingVideo.newFile);
                                            handlePlayVideo({ ...editingVideo, filePath: localUrl, isLocal: true });
                                        } else {
                                            handlePlayVideo(editingVideo);
                                        }
                                    }} className={`w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2`}>
                                        ▶️ Play Video
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Replace Video (Optional)</label>
                                <label className={`border-2 border-dashed rounded-lg p-3 text-center hover:border-orange-500 cursor-pointer block transition-colors ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                    <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Click to upload new video</p>
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>MP4 or MOV files</p>
                                    <input type="file" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Auto-detect duration
                                            const videoElement = document.createElement('video');
                                            videoElement.preload = 'metadata';
                                            const formatDuration = (seconds) => {
                                                const mins = Math.floor(seconds / 60);
                                                const secs = Math.floor(seconds % 60);
                                                return `${mins}:${secs.toString().padStart(2, '0')}`;
                                            };
                                            videoElement.onloadedmetadata = () => {
                                                window.URL.revokeObjectURL(videoElement.src);
                                                setEditingVideo({
                                                    ...editingVideo,
                                                    fileName: file.name,
                                                    newFile: file,
                                                    duration: formatDuration(videoElement.duration)
                                                });
                                            };
                                            videoElement.src = URL.createObjectURL(file);
                                        }
                                    }} accept=".mp4,.mov" className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div className={`p-6 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} flex gap-3 justify-end sticky bottom-0`}>
                            <button onClick={() => setEditingVideo(null)} className={`px-6 py-2 border rounded-lg ${darkMode ? 'border-gray-600 hover:bg-gray-800 text-white' : 'border-gray-300'}`}>Cancel</button>
                            <button onClick={async () => {
                                try {
                                    const updated = await updateVideoApi(
                                        editingVideo.id,
                                        editingVideo.newFile,
                                        editingVideo.title,
                                        editingVideo.subject,
                                        editingVideo.duration,
                                        editingVideo.category
                                    );
                                    setVideos(videos.map(v => v.id === editingVideo.id ? updated : v));
                                    setEditingVideo(null);
                                    alert('Video updated successfully!');
                                } catch (error) {
                                    console.error('Update failed:', error);
                                    alert('Failed to update video.');
                                }
                            }} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
            {showQuestionPool && (
                <QuestionPool
                    onClose={() => setShowQuestionPool(false)}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
};

export default ContentManagement;