import React, { useMemo } from 'react';
import { Brain, Target, TrendingUp, AlertCircle, BookOpen, CheckCircle2 } from 'lucide-react';

const TopicAnalytics = ({ testHistory, darkMode }) => {
    const topicStats = useMemo(() => {
        const stats = {};

        testHistory.forEach(history => {
            if (!history.analytics) return;

            Object.entries(history.analytics).forEach(([key, value]) => {
                if (key.startsWith('topic_correct:')) {
                    const topic = key.replace('topic_correct:', '');
                    if (!stats[topic]) stats[topic] = { correct: 0, total: 0 };
                    stats[topic].correct += value;
                } else if (key.startsWith('topic_total:')) {
                    const topic = key.replace('topic_total:', '');
                    if (!stats[topic]) stats[topic] = { correct: 0, total: 0 };
                    stats[topic].total += value;
                }
            });
        });

        return Object.entries(stats).map(([topic, data]) => ({
            topic,
            percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
            correct: data.correct,
            total: data.total
        })).sort((a, b) => a.percentage - b.percentage);
    }, [testHistory]);

    const subjectStats = useMemo(() => {
        const stats = {};

        testHistory.forEach(history => {
            if (!history.analytics) return;

            Object.entries(history.analytics).forEach(([key, value]) => {
                if (key.startsWith('sub_correct:')) {
                    const subject = key.replace('sub_correct:', '');
                    if (!stats[subject]) stats[subject] = { correct: 0, total: 0 };
                    stats[subject].correct += value;
                } else if (key.startsWith('sub_total:')) {
                    const subject = key.replace('sub_total:', '');
                    if (!stats[subject]) stats[subject] = { correct: 0, total: 0 };
                    stats[subject].total += value;
                }
            });
        });

        return Object.entries(stats).map(([subject, data]) => ({
            subject,
            percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
            correct: data.correct,
            total: data.total
        })).sort((a, b) => a.percentage - b.percentage);
    }, [testHistory]);

    const weakTopics = topicStats.filter(s => s.percentage < 60).slice(0, 5);
    const strongTopics = [...topicStats].sort((a, b) => b.percentage - a.percentage).filter(s => s.percentage >= 80).slice(0, 5);

    if (testHistory.length === 0) {
        return (
            <div className={`p-8 text-center rounded-2xl border-2 border-dashed ${darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No test data available for topic analytics yet. Complete some tests to see your insights!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Subject & Topic Insights</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deep dive into your performance across specific learning areas</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${darkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">{testHistory.length} Tests Analyzed</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weak Subjects Section */}
                <div className={`rounded-2xl p-6 border shadow-sm ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performance by Subject</h3>
                    </div>
                    <div className="space-y-5">
                        {subjectStats.map((stat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className={`text-sm font-bold capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stat.subject}</span>
                                    <span className={`text-sm font-black ${stat.percentage < 50 ? 'text-red-500' : stat.percentage < 80 ? 'text-orange-500' : 'text-emerald-500'}`}>{stat.percentage}%</span>
                                </div>
                                <div className={`h-2.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${stat.percentage < 50 ? 'bg-red-500' : stat.percentage < 80 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${stat.percentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    <span>{stat.correct} Correct</span>
                                    <span>{stat.total} Total Questions</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Topics Priority List */}
                <div className="space-y-6">
                    {/* Priority Focus */}
                    <div className={`rounded-2xl p-6 border shadow-sm ${darkMode ? 'bg-red-900/10 border-red-900/20' : 'bg-red-50/50 border-red-100'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="w-5 h-5 text-red-500" />
                            <h3 className={`font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>Priority Focus Topics</h3>
                        </div>
                        <div className="space-y-3">
                            {weakTopics.length > 0 ? weakTopics.map((stat, idx) => (
                                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.02] ${darkMode ? 'bg-gray-900/50 border-gray-800 hover:border-red-500/30' : 'bg-white border-gray-200 shadow-sm hover:border-red-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${darkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                                            {idx + 1}
                                        </div>
                                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stat.topic}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-red-500">{stat.percentage}%</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{stat.total - stat.correct} Errors</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-center py-4 text-gray-400 italic">No critical weak topics found. Keep it up!</p>
                            )}
                        </div>
                    </div>

                    {/* Strengths */}
                    <div className={`rounded-2xl p-6 border shadow-sm ${darkMode ? 'bg-emerald-900/10 border-emerald-900/20' : 'bg-emerald-50/50 border-emerald-100'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <h3 className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Your Top Strengths</h3>
                        </div>
                        <div className="space-y-3">
                            {strongTopics.length > 0 ? strongTopics.map((stat, idx) => (
                                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.02] ${darkMode ? 'bg-gray-900/50 border-gray-800 hover:border-emerald-500/30' : 'bg-white border-gray-200 shadow-sm hover:border-emerald-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <TrendingUp className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{stat.topic}</span>
                                    </div>
                                    <span className="text-sm font-black text-emerald-600">{stat.percentage}%</span>
                                </div>
                            )) : (
                                <p className="text-sm text-center py-4 text-gray-400 italic">Keep practicing to build your core strengths!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* All Topics Breakdown */}
            <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl'}`}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-orange-500" />
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Complete Topic-wise Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400">Topic Area</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Score</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Correct/Total</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-gray-400">Performance Index</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {topicStats.map((stat, idx) => (
                                <tr key={idx} className={`transition-colors ${darkMode ? 'hover:bg-gray-800/30' : 'hover:bg-orange-50/30'}`}>
                                    <td className="p-4">
                                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{stat.topic}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-sm font-black ${stat.percentage < 50 ? 'text-red-500' : stat.percentage < 80 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                            {stat.percentage}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-xs font-bold text-gray-400">{stat.correct} / {stat.total}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className={`h-1.5 w-full rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                            <div
                                                className={`h-full rounded-full ${stat.percentage < 50 ? 'bg-red-500' : stat.percentage < 80 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${stat.percentage}%` }}
                                            />
                                        </div>
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

export default TopicAnalytics;
