import React, { useState } from 'react';
import {
    CheckCircle, XCircle, Clock, BookOpen, ArrowLeft,
    BarChart3, Target, ChevronDown, ChevronUp, AlertCircle,
    Award, Zap, Hash
} from 'lucide-react';
import { getSubjectColor, getCurrentUser } from '../../utils/helpers';

const TestAnalyticsView = ({ test, setSelectedTestForResult, darkMode }) => {
    const userData = getCurrentUser();

    // Parse responses if they are in JSON string format
    const responses = React.useMemo(() => {
        if (!test.responsesJson) return test.responses || {};
        try {
            return typeof test.responsesJson === 'string'
                ? JSON.parse(test.responsesJson)
                : test.responsesJson;
        } catch (e) {
            console.error('Error parsing responses:', e);
            return {};
        }
    }, [test.responsesJson, test.responses]);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const questions = test.questionsList || test.questions || [];
    const totalQuestions = Array.isArray(questions) ? questions.length : (test.totalQuestions || 0);

    const toggleQuestion = (idx) => {
        setExpandedQuestion(expandedQuestion === idx ? null : idx);
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setSelectedTestForResult(null)}
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold transition-all group"
                >
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Dashboard</span>
                </button>
                <div className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    Test ID: #{test.id || 'N/A'}
                </div>
            </div>

            {/* Header Card */}
            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl p-6 sm:p-8 shadow-xl border overflow-hidden relative`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-3">
                        <div className={`inline-flex items-center gap-2 ${getSubjectColor(test.subject)} px-4 py-1.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm`}>
                            <BookOpen size={14} />
                            {test.subject}
                        </div>
                        <h2 className={`text-3xl sm:text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {test.title}
                        </h2>
                        <div className={`flex items-center gap-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-orange-500" /> {test.duration || 'N/A'}</span>
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                            <span className="flex items-center gap-1.5"><Hash size={16} className="text-blue-500" /> {totalQuestions} Questions</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-3xl text-white shadow-lg shadow-orange-200 min-w-[240px]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Grand Score</p>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-6xl font-black tracking-tighter">{test.totalPoints || 0}</span>
                            <span className="text-xl font-bold opacity-60">pts</span>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-1000"
                                    style={{ width: `${test.score || 0}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                                <span>Accuracy</span>
                                <span>{test.score || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-3xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'} shadow-sm flex items-center gap-4`}>
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Correct (+4 pts)</p>
                        <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{test.correctCount || 0}</p>
                        <p className="text-[10px] font-bold text-green-500">+{(test.correctCount || 0) * 4} Points</p>
                    </div>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-3xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'} shadow-sm flex items-center gap-4`}>
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                        <XCircle size={24} />
                    </div>
                    <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Incorrect (-1 pt)</p>
                        <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{test.wrongCount || 0}</p>
                        <p className="text-[10px] font-bold text-red-500">-{test.wrongCount || 0} Points</p>
                    </div>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-3xl border ${darkMode ? 'border-gray-700' : 'border-gray-100'} shadow-sm flex items-center gap-4`}>
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unattempted (0 pt)</p>
                        <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalQuestions - (test.correctCount || 0) - (test.wrongCount || 0)}</p>
                        <p className="text-[10px] font-bold text-orange-500">0 Points</p>
                    </div>
                </div>
            </div>

            {/* Marking Scheme Alert */}
            <div className={`p-4 rounded-2xl flex items-center gap-4 border ${darkMode ? 'bg-orange-900/20 border-orange-800/30 text-orange-300' : 'bg-orange-50 border-orange-100 text-orange-800'}`}>
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-orange-500" />
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-0.5">Scoring Algorithm</p>
                    <p className="text-xs opacity-80 font-medium">Earn 4 points for every correct hit. Lose 1 point for every miss. Skipped questions don't affect your score.</p>
                </div>
            </div>

            {/* Question Review Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className={`text-xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Target className="text-orange-500" />
                        Detailed Analysis
                    </h3>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Reviewing {totalQuestions} Questions
                    </div>
                </div>

                <div className="grid gap-3">
                    {Array.isArray(questions) && questions.map((q, idx) => {
                        const qId = q.id || idx;
                        const userAnsIndex = responses[qId];
                        const isCorrect = q.correctAnswers?.includes(userAnsIndex);
                        const isUnattempted = userAnsIndex === undefined || userAnsIndex === null;

                        return (
                            <div
                                key={idx}
                                className={`${darkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white border-gray-100'} rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${expandedQuestion === idx ? 'ring-2 ring-orange-500/20' : ''}`}
                            >
                                <button
                                    onClick={() => toggleQuestion(idx)}
                                    className="w-full text-left p-4 sm:p-5 flex items-start gap-4 hover:bg-orange-500/5 transition-colors"
                                >
                                    <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black
                                        ${isUnattempted ? (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500') :
                                            isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {q.text || q.questionText}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            {isUnattempted ? (
                                                <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Skipped • 0 pts</span>
                                            ) : isCorrect ? (
                                                <span className="text-[10px] font-black uppercase tracking-wider text-green-500 flex items-center gap-1">
                                                    <CheckCircle size={10} /> Correct Hit • +4 pts
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-wider text-red-500 flex items-center gap-1">
                                                    <XCircle size={10} /> Critical Error • -1 pt
                                                </span>
                                            )}
                                            {q.topic && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    {q.topic}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`${darkMode ? 'text-gray-600' : 'text-gray-300'} transition-transform duration-300 ${expandedQuestion === idx ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                {expandedQuestion === idx && (
                                    <div className={`p-5 pt-0 border-t ${darkMode ? 'border-gray-700/50' : 'border-gray-50'} animate-in slide-in-from-top-2 duration-300`}>
                                        <div className="mt-4 space-y-4">
                                            {/* Question Text Full */}
                                            <div className={`text-sm leading-relaxed p-4 rounded-xl ${darkMode ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-50 text-gray-700'} font-medium`}>
                                                {q.text || q.questionText}
                                            </div>

                                            {/* Options */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {(q.answers || q.options || [])?.map((opt, oIdx) => {
                                                    const userAnsIdx = responses[q.id || idx]; // Use qId from parent scope or idx
                                                    const isUserChoice = userAnsIdx === oIdx;
                                                    const isActualCorrect = (q.correctAnswers || [])?.includes(oIdx);

                                                    let statusStyles = darkMode ? 'border-gray-700 text-gray-400 hover:border-gray-600' : 'border-gray-100 text-gray-600 hover:border-gray-200';
                                                    if (isActualCorrect) statusStyles = 'border-green-500 bg-green-500/10 text-green-500';
                                                    else if (isUserChoice && !isActualCorrect) statusStyles = 'border-red-500 bg-red-500/10 text-red-500';

                                                    return (
                                                        <div
                                                            key={oIdx}
                                                            className={`p-3.5 rounded-xl border-2 flex items-center justify-between text-sm font-bold transition-all ${statusStyles}`}
                                                        >
                                                            <span>{opt}</span>
                                                            <div className="flex items-center gap-2">
                                                                {isActualCorrect && <CheckCircle size={16} />}
                                                                {isUserChoice && !isActualCorrect && <XCircle size={16} />}
                                                                {isUserChoice && <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-current opacity-20 text-white">Your Choice</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation */}
                                            {q.explanation && (
                                                <div className="mt-6">
                                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Expert Insight</p>
                                                    <div className={`p-4 rounded-2xl border-l-4 border-blue-500 ${darkMode ? 'bg-blue-900/10 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
                                                        <p className="text-sm font-semibold italic">{q.explanation}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Topic Breakdown Replicated for consistency */}
            {test.topicBreakdown && test.topicBreakdown.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200/20">
                    <h3 className={`text-xl font-black flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <BarChart3 className="text-blue-500" />
                        Performance by Discipline
                    </h3>
                    <div className="grid gap-3">
                        {test.topicBreakdown.map((topic, idx) => (
                            <div key={idx} className={`${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'} p-4 rounded-2xl`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm font-black ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{topic.topic}</span>
                                    <span className={`text-xs font-black ${topic.percentage >= 80 ? 'text-green-500' : topic.percentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                        {topic.percentage}% Mastery
                                    </span>
                                </div>
                                <div className={`w-full rounded-full h-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${topic.percentage >= 80 ? 'bg-green-500' : topic.percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                                        style={{ width: `${topic.percentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    <span>{topic.correct} Correct Hits</span>
                                    <span>{topic.total} Total Questions</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestAnalyticsView;
