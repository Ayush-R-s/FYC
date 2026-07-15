import React, { useState, useEffect, useCallback } from 'react';
import { Play, CheckCircle, XCircle, ArrowLeft, ArrowRight, Save, Target, AlertCircle } from 'lucide-react';
import axios from '../../services/axiosInstance';
import { useAppContext } from '../../context/AppContext';

export default function PracticePage() {
  const { darkMode } = useAppContext();

  const [status, setStatus] = useState('idle'); // idle, loading, practicing, results
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionEndTime, setSessionEndTime] = useState(null);

  const startPractice = async () => {
    setStatus('loading');
    try {
      const response = await axios.get('/student/practice/questions');
      if (response.data && response.data.length > 0) {
        setQuestions(response.data);
        setStatus('practicing');
        setCurrentIndex(0);
        setAnswers({});
        setSessionStartTime(Date.now());
      } else {
        alert("No questions available for practice right now.");
        setStatus('idle');
      }
    } catch (error) {
      console.error("Error fetching practice questions:", error);
      alert("Failed to load questions. Please try again.");
      setStatus('idle');
    }
  };

  const endPractice = () => {
    if (window.confirm("Are you sure you want to end this practice session?")) {
      setSessionEndTime(Date.now());
      setStatus('results');
    }
  };

  const finishPractice = useCallback(() => {
    setSessionEndTime(Date.now());
    setStatus('results');
  }, []);

  const handleOptionSelect = (qId, optionKey) => {
    setAnswers(prev => ({ ...prev, [qId]: optionKey }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  useEffect(() => {
    if (status !== 'practicing') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        alert("Warning: You switched tabs or minimized the window. The practice session will now end.");
        finishPractice();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      alert("Right-click is disabled during practice.");
    };

    const handleCopyPaste = (e) => {
      e.preventDefault();
      alert("Copy/Paste is disabled during practice.");
    };

    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert("Screenshots are not allowed!");
      }
      if (e.ctrlKey || e.metaKey) {
        const forbiddenKeys = ['c', 'v', 'x', 'p', 's'];
        if (forbiddenKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          alert("Keyboard shortcuts are disabled during practice.");
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert("Screenshots are not allowed!");
      }
    };

    const handleWindowBlur = () => {
      finishPractice();
      // Use setTimeout so the UI updates to 'results' before showing the alert
      setTimeout(() => {
        alert("Warning: Window lost focus. This could be due to taking a screenshot, screen recording, or opening another app. The practice session has ended.");
      }, 0);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [status, finishPractice]);

  const renderIdle = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className={`p-6 rounded-full ${darkMode ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
        <Target size={64} className="text-orange-500" />
      </div>
      <div className="max-w-md">
        <h1 className="text-3xl font-bold mb-4">Self-Paced Practice</h1>
        <p className={`mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Sharpen your skills with randomized questions from the Jest question bank.
          There is no time limit—start and stop whenever you want.
        </p>
        <button
          onClick={startPractice}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 w-full sm:w-auto mx-auto"
        >
          <Play size={20} />
          Start Practicing
        </button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
      <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Loading your questions...</p>
    </div>
  );

  const renderPracticing = () => {
    if (!questions.length) return null;
    const q = questions[currentIndex];

    // Safety check in case options are null
    const options = [
      { key: 'A', text: q.optionA || 'Option A' },
      { key: 'B', text: q.optionB || 'Option B' },
      { key: 'C', text: q.optionC || 'Option C' },
      { key: 'D', text: q.optionD || 'Option D' }
    ];

    const currentAnswer = answers[q.id];

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 select-none">
        {/* Header */}
        <div className={`p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
              {q.subject || 'General'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-xs font-medium flex gap-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-500" /> +{q.correctMarks || 4}</span>
              <span className="flex items-center gap-1"><XCircle size={14} className="text-red-500" /> {q.negativeMarks || -1}</span>
            </div>
            <button
              onClick={endPractice}
              className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <AlertCircle size={16} />
              End Practice
            </button>
          </div>
        </div>

        {/* Question Area */}
        <div className={`p-6 md:p-8 rounded-xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="prose prose-slate dark:prose-invert max-w-none mb-8 whitespace-pre-wrap font-medium">
            {q.text}
          </div>

          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = currentAnswer === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleOptionSelect(q.id, opt.key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${isSelected
                    ? (darkMode ? 'bg-orange-500/20 border-orange-500' : 'bg-orange-50 border-orange-500')
                    : (darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100')
                    }`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected
                    ? 'bg-orange-500 text-white'
                    : (darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700')
                    }`}>
                    {opt.key}
                  </div>
                  <div className={`pt-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {opt.text}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${currentIndex === 0
              ? 'opacity-50 cursor-not-allowed text-slate-500 bg-slate-100 dark:bg-slate-800 dark:border-slate-800 border'
              : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'
              }`}
          >
            <ArrowLeft size={18} />
            Previous
          </button>

          <button
            onClick={currentIndex === questions.length - 1 ? finishPractice : handleNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${currentIndex === questions.length - 1
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25'
              }`}
          >
            {currentIndex === questions.length - 1 ? (
              <>Finish Practice <Save size={18} /></>
            ) : (
              <>Next Question <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;
    let maxPossibleScore = 0;

    const questionsToShow = questions.slice(0, currentIndex + 1);

    questionsToShow.forEach(q => {
      const correctMarks = q.correctMarks || 4;
      const negativeMarks = q.negativeMarks || -1;
      maxPossibleScore += correctMarks;

      const answer = answers[q.id];
      if (!answer) {
        unattemptedCount++;
      } else if (answer === q.correctOption) {
        correctCount++;
        totalScore += correctMarks;
      } else {
        incorrectCount++;
        // If negativeMarks is already negative, we add it. If it's positive, we subtract.
        totalScore += (negativeMarks <= 0 ? negativeMarks : -negativeMarks);
      }
    });

    const accuracy = (correctCount + incorrectCount) > 0
      ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
      : 0;

    const timeSpentMs = sessionEndTime - sessionStartTime;
    const minutes = Math.floor(timeSpentMs / 60000);
    const seconds = Math.floor((timeSpentMs % 60000) / 1000);

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Practice Summary</h2>
          <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>
            Great job! Here is how you performed in this session.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-6 rounded-xl border text-center shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="text-sm font-medium text-slate-500 mb-1">Total Score</div>
            <div className="text-3xl font-black text-orange-500">{totalScore}</div>
            <div className="text-xs text-slate-400 mt-1">out of {maxPossibleScore}</div>
          </div>
          <div className={`p-6 rounded-xl border text-center shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="text-sm font-medium text-slate-500 mb-1">Accuracy</div>
            <div className="text-3xl font-black text-blue-500">{accuracy}%</div>
            <div className="text-xs text-slate-400 mt-1">{correctCount} correct</div>
          </div>
          <div className={`p-6 rounded-xl border text-center shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="text-sm font-medium text-slate-500 mb-1">Attempted</div>
            <div className="text-3xl font-black text-purple-500">{correctCount + incorrectCount}</div>
            <div className="text-xs text-slate-400 mt-1">out of {questionsToShow.length}</div>
          </div>
          <div className={`p-6 rounded-xl border text-center shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="text-sm font-medium text-slate-500 mb-1">Time Spent</div>
            <div className="text-3xl font-black text-green-500">{minutes}m {seconds}s</div>
            <div className="text-xs text-slate-400 mt-1">Total duration</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className={`p-6 md:p-8 rounded-xl border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="text-xl font-bold mb-6">Question Breakdown</h3>
          <div className="space-y-4">
            {questionsToShow.map((q, idx) => {
              const answer = answers[q.id];
              const isCorrect = answer === q.correctOption;
              const isUnattempted = !answer;

              let statusColor = 'bg-slate-100 text-slate-500 border-slate-200';
              let statusIcon = <Target size={16} />;
              if (!isUnattempted) {
                if (isCorrect) {
                  statusColor = 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/20 dark:text-green-400';
                  statusIcon = <CheckCircle size={16} />;
                } else {
                  statusColor = 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20 dark:text-red-400';
                  statusIcon = <XCircle size={16} />;
                }
              }

              return (
                <div key={q.id} className={`p-4 md:p-6 rounded-lg border ${darkMode ? 'border-slate-800 bg-slate-800/30' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${statusColor}`}>
                          {statusIcon}
                          {isUnattempted ? 'Unattempted' : (isCorrect ? 'Correct' : 'Incorrect')}
                        </span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Q{idx + 1}</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'} ml-auto`}>
                          {isUnattempted ? '0' : (isCorrect ? `+${q.correctMarks || 4}` : `${q.negativeMarks || -1}`)} marks
                        </span>
                      </div>
                      <p className={`text-sm font-medium line-clamp-3 mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{q.text}</p>

                      <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg space-y-2 border border-slate-200/50 dark:border-slate-700/50 text-sm">
                        {!isUnattempted && !isCorrect && (
                          <div className="flex gap-4">
                            <span className="text-red-500 font-semibold w-24 shrink-0">Your answer:</span>
                            <span className="text-slate-700 dark:text-slate-300">Option {answer}</span>
                          </div>
                        )}
                        <div className="flex gap-4">
                          <span className="text-green-500 font-semibold w-24 shrink-0">Correct answer:</span>
                          <span className="text-slate-700 dark:text-slate-300">Option {q.correctOption}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pt-4 pb-12">
          <button
            onClick={() => setStatus('idle')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="py-6">
      {status === 'idle' && renderIdle()}
      {status === 'loading' && renderLoading()}
      {status === 'practicing' && renderPracticing()}
      {status === 'results' && renderResults()}
    </div>
  );
}
