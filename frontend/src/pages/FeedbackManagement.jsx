import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Moon, Sun, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import feedbackService from '../services/feedbackService';
import KPICard from '../components/Charts/KPICard';
import FacultyBar from '../components/Modal/FacultyBar';
import RecentFeedbackItem from '../components/Modal/RecentFeedbackItem';
import FeedbackModal from '../components/Modal/FeedbackModal';
import Analytics from '../components/Modal/Analytics';

export default function FeedbackManagement() {
    const { darkMode: isDarkMode, setDarkMode } = useAppContext();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRating, setFilterRating] = useState('All Ratings');
    const [filterSubject, setFilterSubject] = useState('All Subjects');
    const [selectedDate, setSelectedDate] = useState('');

    const [allFeedback, setAllFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const data = await feedbackService.getAllFeedback();
            setAllFeedback(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching feedback:', err);
            setError('Failed to load feedback data');
            setLoading(false);
        }
    };

    const analytics = useMemo(() => {
        const avgByFaculty = {};
        const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const subjectAvg = {};

        allFeedback.forEach(fb => {
            const facultyKey = fb.facultyName || fb.faculty || "Unknown Faculty";
            ratingDist[fb.rating]++;
            if (!avgByFaculty[facultyKey]) avgByFaculty[facultyKey] = { sum: 0, count: 0 };
            avgByFaculty[facultyKey].sum += fb.rating;
            avgByFaculty[facultyKey].count++;
            if (!subjectAvg[fb.subject]) subjectAvg[fb.subject] = { sum: 0, count: 0 };
            subjectAvg[fb.subject].sum += fb.rating;
            subjectAvg[fb.subject].count++;
        });

        const facultyRatings = Object.entries(avgByFaculty).map(([name, data]) => ({ name, avg: (data.sum / data.count).toFixed(1) }));
        const overallAvg = allFeedback.length > 0
            ? (allFeedback.reduce((sum, fb) => sum + fb.rating, 0) / allFeedback.length).toFixed(1)
            : 0;

        return { avgByFaculty: facultyRatings, ratingDist, overallAvg, subjectAvg };
    }, [allFeedback]);

    const uniqueSubjects = useMemo(() => {
        return [...new Set(allFeedback.map(fb => fb.subject).filter(Boolean))];
    }, [allFeedback]);

    const filteredFeedback = useMemo(() => {
        let filtered = allFeedback.filter(fb => {
            const studentName = fb.studentName || "Anonymous";
            const facultyName = fb.facultyName || fb.faculty || "Unknown Faculty";
            const matchesSearch = studentName.toLowerCase().includes(searchQuery.toLowerCase()) || facultyName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRating = filterRating === 'All Ratings' || fb.rating === parseInt(filterRating);
            const matchesSubject = filterSubject === 'All Subjects' || fb.subject === filterSubject;
            const matchesDate = selectedDate === '' || fb.date === selectedDate;
            return matchesSearch && matchesRating && matchesSubject && matchesDate;
        });
        return filtered;
    }, [allFeedback, searchQuery, filterRating, filterSubject, selectedDate]);

    const handleViewDetails = (feedback) => { setSelectedFeedback(feedback); setShowDetailModal(true); };

    const handleMarkReviewed = async (id) => {
        try {
            await feedbackService.markAsReviewed(id);
            // Update local state to reflect the change
            setAllFeedback(prev => prev.map(fb =>
                fb.id === id ? { ...fb, isReviewed: true } : fb
            ));

            // Also update selected feedback if it's currently open
            if (selectedFeedback && selectedFeedback.id === id) {
                setSelectedFeedback(prev => ({ ...prev, isReviewed: true }));
            }
        } catch (err) {
            console.error('Error marking feedback as reviewed:', err);
            alert('Failed to update feedback status');
        }
    };

    const renderStars = (rating) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (<span key={i} className={i <= rating ? 'text-orange-500' : 'text-gray-300'}>★</span>))}
        </div>
    );

    return (
        <div className={`flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex-none transition-colors duration-300`}>
                <div className="w-full px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-xl ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                            <MessageSquare className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                        </div>
                        <div>
                            <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'} leading-tight`}>
                                Feedback Management
                            </h1>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-[10px] sm:text-xs font-semibold tracking-wide mt-0.5 uppercase`}>
                                Monitor & Analyze Student Feedback
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="w-full px-4 sm:px-6 py-4">
                    <div className={`flex gap-4 sm:gap-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b mb-6 sm:mb-8 overflow-x-auto no-scrollbar`}>
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'feedback', label: 'Feedback List' },
                            { id: 'analytics', label: 'Analytics' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 px-1 font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                                <KPICard icon={{ element: '⭐', bg: 'bg-orange-50' }} title="Avg Rating" value={analytics.overallAvg} isDarkMode={isDarkMode} />
                                <KPICard icon={{ element: '📊', bg: 'bg-orange-50' }} title="Total Feedback" value={allFeedback.length} isDarkMode={isDarkMode} />
                                <KPICard icon={{ element: '✓', bg: 'bg-orange-50' }} title="5-Star Reviews" value={analytics.ratingDist[5]} isDarkMode={isDarkMode} />
                                <KPICard icon={{ element: '⚠', bg: 'bg-orange-50' }} title="Low Ratings" value={analytics.ratingDist[1] + analytics.ratingDist[2]} isDarkMode={isDarkMode} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 shadow-sm border`}>
                                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Faculty Comparison</h2>
                                    <div className="space-y-5">
                                        {analytics.avgByFaculty.map((faculty, idx) => {
                                            const colors = ['#fb923c', '#fdba74', '#9ca3af', '#d1d5db'];
                                            // Removed glowColors
                                            const color = colors[idx % colors.length];

                                            return <FacultyBar key={idx} faculty={faculty} color={color} isDarkMode={isDarkMode} />;
                                        })}
                                    </div>
                                </div>

                                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 shadow-sm border`}>
                                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Recent Feedback</h2>
                                    <div className="space-y-4">
                                        {allFeedback.slice(0, 3).map(fb => (
                                            <RecentFeedbackItem key={fb.id} fb={fb} isDarkMode={isDarkMode} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'feedback' && (
                        <div className="space-y-6">
                            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg p-6 shadow-sm border`}>
                                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Filters & Sorting</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Search</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input type="text" placeholder="Student or Faculty name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900'}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Rating</label>
                                        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                                            <option>All Ratings</option>
                                            {[5, 4, 3, 2, 1].map(r => <option key={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Subject</label>
                                        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                                            <option>All Subjects</option>
                                            {uniqueSubjects.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Select Date</label>
                                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                                    </div>
                                </div>
                            </div>

                            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl overflow-hidden shadow-sm border`}>
                                {/* Desktop View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b`}>
                                            <tr>
                                                {['Student', 'Faculty', 'Subject', 'Rating', 'Date', 'Action'].map(h => <th key={h} className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{h}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody className={`${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                                            {filteredFeedback.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className={`px-6 py-12 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        No feedback data available matching the selected filters.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredFeedback.map(fb => (
                                                    <tr
                                                        key={fb.id}
                                                        className={`transition-colors text-sm ${isDarkMode
                                                            ? 'hover:bg-gray-800 border-gray-700'
                                                            : 'hover:bg-gray-50 border-gray-200'
                                                            } border-b last:border-0`}
                                                    >
                                                        <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            <div className="flex items-center gap-2">
                                                                {fb.isNew && !fb.isReviewed && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800">
                                                                        New
                                                                    </span>
                                                                )}
                                                                {fb.isReviewed && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                                                                        ✓ Reviewed
                                                                    </span>
                                                                )}
                                                                <span className={fb.isReviewed ? 'font-normal opacity-70' : 'font-medium'}>{fb.studentName || "Anonymous Student"}</span>
                                                            </div>
                                                        </td>
                                                        <td className={`px-6 py-4 text-sm ${fb.isReviewed ? 'opacity-70' : ''} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {fb.facultyName || fb.faculty || "Unknown Faculty"}
                                                        </td>
                                                        <td className={`px-6 py-4 text-sm ${fb.isReviewed ? 'opacity-70' : ''} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {fb.subject}
                                                        </td>
                                                        <td className={`px-6 py-4 ${fb.isReviewed ? 'opacity-70' : ''}`}>
                                                            {renderStars(fb.rating)}
                                                        </td>
                                                        <td className={`px-6 py-4 text-sm ${fb.isReviewed ? 'opacity-70' : ''} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {fb.date}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => handleViewDetails(fb)}
                                                                className={`inline-flex items-center gap-2 px-3 py-1.5 text-white text-sm rounded-lg transition-colors ${fb.isReviewed
                                                                    ? 'bg-gray-500 hover:bg-gray-600'
                                                                    : 'bg-orange-500 hover:bg-orange-600'
                                                                    }`}
                                                            >
                                                                <Eye className="w-4 h-4" /> View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden divide-y divide-gray-100">
                                    {filteredFeedback.length === 0 ? (
                                        <div className={`p-10 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No feedback data matching filters.
                                        </div>
                                    ) : (
                                        filteredFeedback.map(fb => (
                                            <div key={fb.id} className="p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {fb.isNew && !fb.isReviewed && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">NEW</span>
                                                            )}
                                                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${fb.isReviewed ? 'opacity-60' : ''}`}>
                                                                {fb.studentName || "Anonymous"}
                                                            </h4>
                                                        </div>
                                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ${fb.isReviewed ? 'opacity-60' : ''}`}>
                                                            {fb.facultyName || fb.faculty} • {fb.subject}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="mb-1">{renderStars(fb.rating)}</div>
                                                        <div className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{fb.date}</div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center pt-2">
                                                    {fb.isReviewed ? (
                                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                            <span className="w-3 h-3 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-[8px]">✓</span> Reviewed
                                                        </span>
                                                    ) : <span></span>}
                                                    <button
                                                        onClick={() => handleViewDetails(fb)}
                                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${fb.isReviewed
                                                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm active:scale-95'
                                                            }`}
                                                    >
                                                        View & Respond
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <Analytics analytics={analytics} isDarkMode={isDarkMode} />
                    )}
                </div>
            </div>

            {showDetailModal && selectedFeedback && (
                <FeedbackModal
                    selectedFeedback={selectedFeedback}
                    onClose={() => setShowDetailModal(false)}
                    onMarkReviewed={handleMarkReviewed}
                    isReviewed={selectedFeedback.isReviewed}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    );
}
