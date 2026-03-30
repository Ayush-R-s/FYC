import React, { useState, useEffect, useMemo } from 'react';
import { Clock, TrendingUp, BookOpen, Target, Calendar, ChevronRight, BarChart2 } from 'lucide-react';
import { getSubjectColor, getCurrentUser } from '../../utils/helpers';
import * as api from '../../utils/api';

const TestHistoryView = ({ onTestClick, darkMode }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoading(true);
                const userData = getCurrentUser();
                if (userData) {
                    const data = await api.fetchTestHistory(userData.email);
                    // Sort by id descending (assuming higher id is more recent for now)
                    setHistory(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
                }
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const completedTests = history;

    const stats = useMemo(() => {
        if (completedTests.length === 0) return null;

        const totalScore = completedTests.reduce((sum, t) => sum + (t.score || 0), 0);
        const avgScore = Math.round(totalScore / completedTests.length);

        // Find best subject
        const subjectScores = {};
        completedTests.forEach(t => {
            if (!subjectScores[t.subject]) subjectScores[t.subject] = { total: 0, count: 0 };
            subjectScores[t.subject].total += t.score || 0;
            subjectScores[t.subject].count += 1;
        });

        let bestSub = 'N/A';
        let maxAvg = -1;
        Object.entries(subjectScores).forEach(([sub, data]) => {
            const avg = data.total / data.count;
            if (avg > maxAvg) {
                maxAvg = avg;
                bestSub = sub;
            }
        });

        return {
            total: completedTests.length,
            avgScore,
            bestSubject: bestSub,
            recentTrend: completedTests.slice(0, 5).map(t => t.score || 0).reverse()
        };
    }, [completedTests]);

    if (completedTests.length === 0) {
        return (
            <div className={`p-10 text-center rounded-2xl border-2 border-dashed ${darkMode ? 'border-gray-700 bg-gray-800/20' : 'border-gray-200 bg-gray-50'}`}>
                <BarChart2 className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No Test History Yet</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attempt some tests to see your performance analytics here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Analytics Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-2xl border shadow-sm`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Tests Attempted</p>
                            <h4 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</h4>
                        </div>
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-2xl border shadow-sm`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Average Score</p>
                            <h4 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.avgScore}%</h4>
                        </div>
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-2xl border shadow-sm`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Strongest Subject</p>
                            <h4 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} capitalize`}>{stats.bestSubject}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-2xl shadow-sm overflow-hidden`}>
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Attempt History</h3>
                </div>
                <div className="divide-y overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <th className="px-6 py-4">Test Title</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Score</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {completedTests.map((test) => (
                                <tr key={test.id} className={`group transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4">
                                        <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{test.title}</p>
                                        <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-[10px]">
                                            <Calendar className="w-3 h-3" />
                                            {test.completedDate || 'Recently'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getSubjectColor(test.subject)}`}>
                                            {test.subject}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-black ${test.totalPoints > 0 ? 'text-green-600' : test.totalPoints < 0 ? 'text-red-500' : 'text-orange-500'}`}>
                                                    {test.totalPoints || 0} pts
                                                </span>
                                                <span className={`text-[10px] font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    ({test.score || 0}%)
                                                </span>
                                            </div>
                                            <div className={`hidden sm:block w-24 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                <div
                                                    className={`h-1.5 rounded-full ${test.score >= 80 ? 'bg-green-500' : test.score >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                    style={{ width: `${test.score || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onTestClick(test)}
                                            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            Analysis <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TestHistoryView;
