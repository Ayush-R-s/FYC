import React, { useState, useEffect } from 'react';
import { Trophy, Target, Clock, School, User, Filter, Calendar, Award, Medal, ChevronLeft } from 'lucide-react';
import { fetchTestLeaderboard, fetchWeeklyLeaderboard, fetchSchoolLeaderboard, fetchTests } from '../../utils/api';
import { useAppContext } from '../../context/AppContext';

const LeaderboardView = ({ setCurrentView }) => {
    const darkMode = false;
    const [leaderboardType, setLeaderboardType] = useState('test'); // 'test', 'weekly', 'school'
    const [timeRange, setTimeRange] = useState('all'); // 'today', 'week', 'all'
    const [selectedTest, setSelectedTest] = useState('');
    const [tests, setTests] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const textColor = 'text-gray-800';
    const textSecondary = 'text-gray-600';
    const cardBg = 'bg-white border-gray-200';

    useEffect(() => {
        const loadTests = async () => {
            const rawTests = await fetchTests();
            const testList = (rawTests || []).map(test => ({
                ...test,
                subject: test.subject || 'General'
            }));
            setTests(testList);
            if (testList.length > 0) {
                const first = testList[0];
                setSelectedTest(`${first.title}|${first.subject}`);
            }
        };
        loadTests();
    }, []);

    useEffect(() => {
        const loadLeaderboard = async () => {
            setLoading(true);
            try {
                let result = [];
                if (leaderboardType === 'test') {
                    if (!selectedTest || !selectedTest.includes('|')) {
                        setData([]);
                        setLoading(false);
                        return;
                    }
                    const [title, subject] = selectedTest.split('|');
                    result = await fetchTestLeaderboard(title, subject, timeRange);
                } else if (leaderboardType === 'weekly') {
                    result = await fetchWeeklyLeaderboard();
                } else if (leaderboardType === 'school') {
                    result = await fetchSchoolLeaderboard(timeRange);
                }
                setData(result);
            } catch (error) {
                console.error("Error loading leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        loadLeaderboard();
    }, [leaderboardType, timeRange, selectedTest]);

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="text-yellow-500" size={20} />;
        if (rank === 2) return <Medal className="text-gray-400" size={20} />;
        if (rank === 3) return <Medal className="text-orange-500" size={20} />;
        return <span className={`text-sm font-bold ${textSecondary}`}>{rank}</span>;
    };

    const formatTime = (seconds) => {
        if (!seconds) return '0s';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Filters */}
            <div className={`p-6 rounded-2xl border ${cardBg} shadow-sm`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className={`text-2xl font-bold ${textColor} flex items-center gap-2`}>
                            <Award className="text-orange-500" /> Leaderboard Rankings
                        </h2>
                        <p className={`${textSecondary} text-sm mt-1`}>Real-time rankings based on score, accuracy and time taken.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={leaderboardType}
                            onChange={(e) => setLeaderboardType(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'} text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none`}
                        >
                            <option value="test">Test-wise</option>
                            <option value="weekly">Weekly Cumulative</option>
                            <option value="school">School-wise</option>
                        </select>

                        {leaderboardType !== 'weekly' && (
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'} text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none`}
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="all">All Time</option>
                            </select>
                        )}

                        {leaderboardType === 'test' && (
                            <select
                                value={selectedTest}
                                onChange={(e) => setSelectedTest(e.target.value)}
                                className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'} text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none`}
                            >
                                {tests.map((test, idx) => (
                                    <option key={idx} value={`${test.title}|${test.subject}`}>
                                        {test.title} ({test.subject})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className={`rounded-2xl border ${cardBg} shadow-sm overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className={`px-6 py-4 text-xs font-bold ${textSecondary} uppercase tracking-wider`}>Rank</th>
                                <th className={`px-6 py-4 text-xs font-bold ${textSecondary} uppercase tracking-wider`}>{leaderboardType === 'school' ? 'School Name' : 'Student Name'}</th>
                                <th className={`px-6 py-4 text-xs font-bold ${textSecondary} uppercase tracking-wider text-center`}>Score</th>
                                <th className={`px-6 py-4 text-xs font-bold ${textSecondary} uppercase tracking-wider text-center`}>Accuracy</th>
                                <th className={`px-6 py-4 text-xs font-bold ${textSecondary} uppercase tracking-wider text-center`}>Time Taken</th>
                                {leaderboardType !== 'school' && <th className={`px-6 py-4 text-xs font-bold ${textSecondary} uppercase tracking-wider`}>School</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className={textSecondary}>Calculating rankings...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length > 0 ? (
                                data.map((entry, idx) => (
                                    <tr key={idx} className="hover:bg-orange-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center w-8">
                                                {getRankIcon(entry.rank)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                                    {leaderboardType === 'school' ? <School size={16} className="text-orange-600" /> : <User size={16} className="text-orange-600" />}
                                                </div>
                                                <span className={`font-bold ${textColor}`}>{entry.studentName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-black">
                                                {entry.score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Target size={14} className="text-orange-500" />
                                                <span className={`text-sm font-bold ${textColor}`}>{entry.accuracy}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Clock size={14} className="text-purple-500" />
                                                <span className={`text-sm font-bold ${textColor}`}>{formatTime(entry.timeTaken)}</span>
                                            </div>
                                        </td>
                                        {leaderboardType !== 'school' && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <School size={14} className="text-gray-400" />
                                                    <span className={`text-sm ${textSecondary}`}>{entry.schoolName || '--'}</span>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className={`px-6 py-12 text-center ${textSecondary}`}>
                                        No data found for the selected criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Back to Overview */}
            <div className="flex justify-start">
                <button
                    onClick={() => setCurrentView('overview')}
                    className="px-4 py-2 rounded-lg border bg-white border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold transition-all flex items-center gap-2"
                >
                    <ChevronLeft size={16} /> Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default LeaderboardView;
