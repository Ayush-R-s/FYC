import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Info, CheckCircle, HelpCircle, AlertCircle, XCircle } from 'lucide-react';
import { getCurrentUser } from '../../utils/helpers';

const STATUS = {
    NOT_VISITED: 'not_visited',
    NOT_ANSWERED: 'not_answered',
    ANSWERED: 'answered',
    MARKED_FOR_REVIEW: 'marked_for_review',
    ANSWERED_MARKED_FOR_REVIEW: 'answered_marked_for_review'
};

const ExamInterface = ({ test, onExit, onComplete, darkMode }) => {
    const user = getCurrentUser();
    const questions = test.questions || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(() => {
        const durationMatch = test.duration?.match(/\d+/);
        return durationMatch ? parseInt(durationMatch[0]) * 60 : 60 * 60;
    });
    const [responses, setResponses] = useState({}); // { questionId: answerIndex }
    const [statusMap, setStatusMap] = useState(() => {
        const initial = {};
        questions.forEach((q, idx) => {
            initial[q.id || idx] = STATUS.NOT_VISITED;
        });
        if (questions.length > 0) initial[questions[0].id || 0] = STATUS.NOT_ANSWERED;
        return initial;
    });
    const [warningCount, setWarningCount] = useState(0);

    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            performSubmit(true);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Tab switch detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarningCount(prev => {
                    const nextCount = prev + 1;
                    if (nextCount >= 3) {
                        performSubmit(true, 'termination');
                        return nextCount;
                    }
                    alert(`Warning ${nextCount} of 3: You are not allowed to switch tabs or minimize the window during the test. The test will automatically end on the 3rd warning.`);
                    return nextCount;
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIndex];
    const currentStatus = statusMap[currentQuestion?.id || currentIndex];

    const updateStatus = (index, newStatus) => {
        const qId = questions[index].id || index;
        setStatusMap(prev => ({ ...prev, [qId]: newStatus }));
    };

    const handleAnswerSelect = (ansIdx) => {
        const qId = currentQuestion.id || currentIndex;
        setResponses(prev => ({ ...prev, [qId]: ansIdx }));
    };

    const handleSaveNext = () => {
        const qId = currentQuestion.id || currentIndex;
        const hasAnswer = responses[qId] !== undefined;

        if (hasAnswer) {
            updateStatus(currentIndex, STATUS.ANSWERED);
        } else {
            updateStatus(currentIndex, STATUS.NOT_ANSWERED);
        }

        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1;
            const nextQId = questions[nextIdx].id || nextIdx;
            if (statusMap[nextQId] === STATUS.NOT_VISITED) {
                updateStatus(nextIdx, STATUS.NOT_ANSWERED);
            }
            setCurrentIndex(nextIdx);
        }
    };

    const handleMarkForReview = () => {
        const qId = currentQuestion.id || currentIndex;
        const hasAnswer = responses[qId] !== undefined;

        if (hasAnswer) {
            updateStatus(currentIndex, STATUS.ANSWERED_MARKED_FOR_REVIEW);
        } else {
            updateStatus(currentIndex, STATUS.MARKED_FOR_REVIEW);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleClearResponse = () => {
        const qId = currentQuestion.id || currentIndex;
        setResponses(prev => {
            const newRes = { ...prev };
            delete newRes[qId];
            return newRes;
        });
    };

    const performSubmit = (isAuto = false) => {
        let correctCount = 0;
        let wrongCount = 0;
        let unattemptedCount = 0;
        let totalPoints = 0;
        const detailedAnalytics = {};

        questions.forEach((q, idx) => {
            const qId = q.id || idx;
            const userAns = responses[qId];
            const topic = q.topic || 'General';
            const subject = q.subject || test.subject || 'General';

            // Initialize analytics keys
            if (!detailedAnalytics[`topic_total:${topic}`]) detailedAnalytics[`topic_total:${topic}`] = 0;
            if (!detailedAnalytics[`topic_correct:${topic}`]) detailedAnalytics[`topic_correct:${topic}`] = 0;
            if (!detailedAnalytics[`sub_total:${subject}`]) detailedAnalytics[`sub_total:${subject}`] = 0;
            if (!detailedAnalytics[`sub_correct:${subject}`]) detailedAnalytics[`sub_correct:${subject}`] = 0;

            detailedAnalytics[`topic_total:${topic}`]++;
            detailedAnalytics[`sub_total:${subject}`]++;

            if (userAns !== undefined) {
                if (q.correctAnswers?.includes(userAns)) {
                    correctCount++;
                    totalPoints += 4;
                    detailedAnalytics[`topic_correct:${topic}`]++;
                    detailedAnalytics[`sub_correct:${subject}`]++;
                } else {
                    wrongCount++;
                    totalPoints -= 1;
                }
            } else {
                unattemptedCount++;
            }
        });

        // Use the test's totalMarks if available, otherwise calculate from questions
        const maxPossiblePoints = questions.length * 4;
        const percentage = Math.max(0, Math.round((totalPoints / maxPossiblePoints) * 100));

        // Calculate speed and accuracy
        const accuracy = Math.round((correctCount / (correctCount + wrongCount || 1)) * 100);

        const durationMatch = test.duration?.match(/\d+/);
        const totalDuration = durationMatch ? parseInt(durationMatch[0]) * 60 : 60 * 60;
        const speed = Math.round((timeLeft / totalDuration) * 100);

        if (isAuto === 'termination') {
            alert('Test Terminated! You have reached the maximum number of tab switch warnings. Your test has been submitted automatically.');
        } else if (isAuto) {
            alert('Time is up! Your test is being submitted automatically.');
        } else {
            alert(`Test Submitted Successfully! \nCorrect: ${correctCount}\nWrong: ${wrongCount}\nTotal Points: ${totalPoints}`);
        }

        onComplete({
            ...test,
            score: percentage,
            totalPoints: totalPoints,
            correctCount: correctCount,
            wrongCount: wrongCount,
            timeTaken: totalDuration - timeLeft,
            responsesJson: JSON.stringify(responses),
            completed: true,
            analytics: {
                ...detailedAnalytics,
                accuracy: accuracy,
                speed: speed,
                correct: correctCount,
                wrong: wrongCount,
                points: totalPoints,
                maxPoints: maxPossiblePoints
            }
        });
    };

    const handleFinalSubmit = () => {
        if (window.confirm('Are you sure you want to submit the test?')) {
            performSubmit(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case STATUS.ANSWERED: return 'bg-green-600 text-white';
            case STATUS.NOT_ANSWERED: return 'bg-red-500 text-white';
            case STATUS.MARKED_FOR_REVIEW: return 'bg-purple-600 text-white rounded-full';
            case STATUS.ANSWERED_MARKED_FOR_REVIEW: return 'bg-purple-600 text-white rounded-full relative after:content-["✓"] after:absolute after:-bottom-1 after:-right-1 after:bg-green-500 after:text-[8px] after:w-3 after:h-3 after:flex after:items-center after:justify-center after:rounded-full after:border after:border-white';
            case STATUS.NOT_VISITED: return 'bg-gray-200 text-gray-700';
            default: return 'bg-gray-200';
        }
    };

    const stats = useMemo(() => {
        const counts = {
            [STATUS.ANSWERED]: 0,
            [STATUS.NOT_ANSWERED]: 0,
            [STATUS.MARKED_FOR_REVIEW]: 0,
            [STATUS.ANSWERED_MARKED_FOR_REVIEW]: 0,
            [STATUS.NOT_VISITED]: 0
        };
        Object.values(statusMap).forEach(s => counts[s]++);
        return counts;
    }, [statusMap]);

    return (
        <div className="flex flex-col h-[100dvh] bg-gray-100 font-sans select-none overflow-hidden">
            {/* Top Bar */}
            <header className="bg-orange-600 text-white p-2 sm:p-3 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                    <h1 className="text-sm sm:text-lg font-bold truncate max-w-[120px] sm:max-w-md">{test.title}</h1>
                    <div className="hidden xs:flex items-center gap-1 sm:gap-2 bg-orange-700/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-orange-500">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-orange-200" />
                        <span className="text-[10px] sm:text-xs font-semibold uppercase">{test.subject}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-6">
                    <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-mono text-base sm:text-xl border-2 ${timeLeft < 300 ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-orange-700 border-orange-500'}`}>
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                        {formatTime(timeLeft)}
                    </div>
                    <div className="h-6 sm:h-10 w-[2px] bg-orange-700 hidden xs:block"></div>
                    <button
                        onClick={onExit}
                        className="px-2 sm:px-4 py-1.5 sm:py-2 hover:bg-orange-700 rounded-lg transition-colors text-[10px] sm:text-sm font-semibold border border-orange-500 whitespace-nowrap"
                    >
                        Quit
                    </button>
                    <button
                        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                        className="lg:hidden px-3 py-1.5 bg-orange-700 hover:bg-orange-800 rounded-lg border border-orange-500 text-[10px] font-black uppercase tracking-widest"
                    >
                        {isPaletteOpen ? 'Back' : 'Palette'}
                    </button>
                    <button
                        onClick={handleFinalSubmit}
                        className="px-3 sm:px-6 py-1.5 sm:py-2 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-lg shadow-lg border-b-2 sm:border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all text-xs sm:text-sm"
                    >
                        Finish
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-1 overflow-hidden relative">

                {/* Left Panel: Question Content */}
                <div className={`flex-1 flex flex-col bg-white overflow-hidden shadow-inner ${isPaletteOpen ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="bg-gray-50 border-b p-2 sm:p-3 flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-bold text-orange-600 bg-orange-50 px-2 sm:px-3 py-1 rounded">Q. {currentIndex + 1}</span>
                        <div className="flex gap-2 sm:gap-4 text-[10px] sm:text-xs font-medium text-gray-500">
                            <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-3 h-3" /> +4</span>
                            <span className="flex items-center gap-1 text-red-600"><XCircle className="w-3 h-3" /> -1</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full">
                        <div className="text-base sm:text-lg font-medium text-gray-800 mb-6 sm:mb-8 whitespace-pre-wrap leading-relaxed border-l-4 border-orange-500 pl-4 sm:pl-6">
                            {currentQuestion?.text}
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {currentQuestion?.answers?.map((ans, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleAnswerSelect(idx)}
                                    className={`group flex items-center p-3 sm:p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${responses[currentQuestion.id || currentIndex] === idx
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-100 hover:border-orange-200 bg-white'
                                        }`}
                                >
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-bold mr-3 sm:mr-5 transition-colors ${responses[currentQuestion.id || currentIndex] === idx
                                        ? 'bg-orange-500 border-orange-500 text-white'
                                        : 'border-gray-200 group-hover:border-orange-300 text-gray-500'
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className={`text-sm sm:text-md ${responses[currentQuestion.id || currentIndex] === idx ? 'text-orange-900 font-bold' : 'text-gray-700 font-medium'}`}>
                                        {ans}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <footer className="bg-gray-50 border-t p-3 sm:p-4 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleMarkForReview}
                                className="flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 bg-purple-100 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-200 font-bold transition-all text-[10px] sm:text-sm uppercase tracking-wider"
                            >
                                Review Later
                            </button>
                            <button
                                onClick={handleClearResponse}
                                className="flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-bold transition-all text-[10px] sm:text-sm uppercase tracking-wider"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                                disabled={currentIndex === 0}
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-orange-100 text-orange-600 rounded-lg hover:bg-orange-50 font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-2 text-xs sm:text-sm"
                            >
                                <ChevronLeft className="w-4 h-4" /> Prev
                            </button>
                            <button
                                onClick={handleSaveNext}
                                className="flex-1 sm:flex-none px-6 sm:px-10 py-2 sm:py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold transition-all shadow-md shadow-orange-200 flex items-center justify-center gap-2 text-[10px] sm:text-sm uppercase tracking-wider"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </footer>
                </div>

                {/* Right Panel: Question Palette */}
                <div className={`w-full lg:w-[320px] bg-white border-l transition-all duration-300 transform flex flex-col shadow-2xl z-20 ${isPaletteOpen ? 'translate-x-0 absolute inset-y-0 right-0 lg:static' : 'translate-x-full absolute right-0 inset-y-0 lg:translate-x-0 lg:static hidden lg:flex'}`}>
                    <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-200">
                                <User className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Candidate</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 truncate max-w-[150px]">{user?.name || 'Student'}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsPaletteOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white text-[9px] sm:text-[10px] flex items-center justify-center rounded font-bold">{stats[STATUS.ANSWERED]}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase">Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-[9px] sm:text-[10px] flex items-center justify-center rounded font-bold">{stats[STATUS.NOT_ANSWERED]}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase">Not Ans</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 text-gray-600 text-[9px] sm:text-[10px] flex items-center justify-center rounded font-bold">{stats[STATUS.NOT_VISITED]}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase whitespace-nowrap">Not Visited</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 text-white text-[9px] sm:text-[10px] flex items-center justify-center rounded-full font-bold">{stats[STATUS.MARKED_FOR_REVIEW]}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase leading-none">Review</span>
                            </div>
                            <div className="flex items-center gap-2 col-span-2">
                                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 text-white text-[9px] sm:text-[10px] flex items-center justify-center rounded-full font-bold relative after:content-['✓'] after:absolute after:-bottom-0.5 after:-right-0.5 after:bg-green-500 after:text-[6px] after:w-2 after:h-2 after:flex after:items-center after:justify-center after:rounded-full after:border after:border-white">{stats[STATUS.ANSWERED_MARKED_FOR_REVIEW]}</span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase leading-none truncate">Answered & Marked for review</span>
                            </div>
                        </div>

                        <div className="bg-orange-600 text-white p-2 text-[10px] font-bold rounded mb-4 shadow-sm uppercase tracking-widest text-center">
                            Question Palette
                        </div>

                        <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-5 gap-2">
                            {questions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentIndex(idx);
                                        if (window.innerWidth < 1024) setIsPaletteOpen(false);
                                    }}
                                    className={`w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center text-xs font-black transition-all hover:scale-105 active:scale-90 ${currentIndex === idx ? 'ring-2 ring-orange-500 ring-offset-2' : ''
                                        } ${getStatusColor(statusMap[questions[idx].id || idx])}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border-t mt-auto">
                        <button
                            onClick={() => window.confirm('Exit Exam?') && onExit()}
                            className="w-full py-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest"
                        >
                            Exit Exam
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExamInterface;
