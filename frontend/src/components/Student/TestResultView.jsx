import React from 'react';
import { Trophy, CheckCircle, XCircle, Clock, BookOpen, ArrowLeft, BarChart3, Target, ChevronRight } from 'lucide-react';
import { getSubjectColor, getCurrentUser } from '../../utils/helpers';

const TestResultView = ({ test, setSelectedTestForResult, darkMode }) => {
    const userData = getCurrentUser();
    return (
        <div className="space-y-6">
            <button
                onClick={() => setSelectedTestForResult(null)}
                className="text-orange-500 hover:text-orange-600 font-medium mb-4"
            >
                ← Back to Tests
            </button>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 sm:p-8 shadow-sm`}>
                <div className={`inline-block ${getSubjectColor(test.subject)} px-4 py-2 rounded-full text-sm font-medium mb-4`}>
                    {test.subject}
                </div>

                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : ''}`}>
                    {test.title}
                </h2>

                <div className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Test Results and Analysis
                </div>

                <div className="mb-8 p-6 bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl text-white shadow-lg shadow-orange-200">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Your Total Score</p>
                            <p className="text-6xl font-black">{test.totalPoints || 0} <span className="text-2xl opacity-60">pts</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Accuracy</p>
                            <p className="text-3xl font-black">{test.score || 0}%</p>
                        </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 mb-6 relative overflow-hidden">
                        <div
                            className="h-3 bg-white rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${test.score || 0}%` }}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                        <div className="text-center border-r border-white/10">
                            <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Correct (+4)</p>
                            <p className="text-xl font-black text-green-300">+{(test.correctCount || 0) * 4}</p>
                            <p className="text-[10px] opacity-60">{test.correctCount || 0} Questions</p>
                        </div>
                        <div className="text-center border-r border-white/10">
                            <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Wrong (-1)</p>
                            <p className="text-xl font-black text-red-300">-{test.wrongCount || 0}</p>
                            <p className="text-[10px] opacity-60">{test.wrongCount || 0} Questions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Unattempted (0)</p>
                            <p className="text-xl font-black text-orange-200">0</p>
                            <p className="text-[10px] opacity-60">{(test.questions || 0) - (test.correctCount || 0) - (test.wrongCount || 0)} Questions</p>
                        </div>
                    </div>
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 rounded-2xl border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex flex-col gap-1">
                        <p className={`text-[10px] font-bold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Questions</p>
                        <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{test.questions || 0}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className={`text-[10px] font-bold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</p>
                        <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{test.duration || 'N/A'}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className={`text-[10px] font-bold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Correct Answers</p>
                        <p className="text-2xl font-black text-green-500">{test.correctCount || 0}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className={`text-[10px] font-bold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wrong Answers</p>
                        <p className="text-2xl font-black text-red-500">{test.wrongCount || 0}</p>
                    </div>
                </div>

                <div className={`mb-8 p-4 rounded-xl border-l-4 border-orange-500 flex items-center justify-between ${darkMode ? 'bg-gray-700/30' : 'bg-orange-50'}`}>
                    <div>
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-orange-900'}`}>Marking Scheme Applied</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-orange-700'}`}>Correct: +4 Points • Wrong: -1 Point • Unattempted: 0 Points</p>
                    </div>
                    <Target className={`w-6 h-6 ${darkMode ? 'text-orange-500/50' : 'text-orange-200'}`} />
                </div>

                <div className="space-y-4">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : ''}`}>Performance Analysis by Topic</h3>
                    {test.topicBreakdown && test.topicBreakdown.length > 0 ? (
                        test.topicBreakdown.map((topic, idx) => (
                            <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{topic.topic}</p>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Correct: {topic.correct}/{topic.total}</span>
                                    <span className="font-bold">{topic.percentage}%</span>
                                </div>
                                <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    <div
                                        className={`h-2 rounded-full ${topic.percentage >= 80 ? 'bg-green-600' :
                                            topic.percentage >= 60 ? 'bg-yellow-600' :
                                                'bg-red-600'
                                            }`}
                                        style={{ width: `${topic.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No detailed breakdown available for this test.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestResultView;