import React, { useState, useEffect } from 'react';
import TestAnalyticsView from '../../components/Student/TestAnalyticsView';
import TestCard from '../../components/Student/TestCard';
import TestHistoryView from '../../components/Student/TestHistoryView';
import ExamInterface from './ExamInterface';
import * as api from '../../utils/api';
import { LayoutGrid, History } from 'lucide-react';
import { getCurrentUser } from '../../utils/helpers';

import { useAppContext } from '../../context/AppContext';

const TestsPage = () => {
    const { darkMode, refreshData, t } = useAppContext();
    const [tests, setTests] = useState([]);
    const [mockTests, setMockTests] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTestForResult, setSelectedTestForResult] = useState(null);
    const [activeTest, setActiveTest] = useState(null);
    const [viewMode, setViewMode] = useState('available'); // 'available' | 'history'

    useEffect(() => {
        const loadTests = async () => {
            try {
                setLoading(true);
                const userData = getCurrentUser();
                const [tData, vData, hData, pData] = await Promise.all([
                    api.fetchTests(),
                    api.fetchVideos(),
                    userData ? api.fetchTestHistory(userData.email) : Promise.resolve([]),
                    userData ? api.fetchVideoProgress(userData.email) : Promise.resolve([])
                ]);

                // Merge progress into videos
                const mergedVideos = vData.map(video => {
                    const progress = pData.find(p => String(p.videoId) == String(video.id));
                    return {
                        ...video,
                        completed: progress ? progress.completed : false
                    };
                });

                // Merge history into tests
                const mergedTests = tData.map(test => {
                    const history = hData.find(h => h.test === test.title && h.subject === test.subject);
                    if (history) {
                        return {
                            ...test,
                            completed: true,
                            score: history.score,
                            totalPoints: history.totalPoints,
                            correctCount: history.correctCount,
                            wrongCount: history.wrongCount,
                            completedAt: history.date,
                            responsesJson: history.responsesJson,
                            analytics: history.analytics
                        };
                    }
                    return test;
                });

                setTests(mergedTests);
                setVideos(mergedVideos);
            } catch (error) {
                console.error('Error loading tests:', error);
            } finally {
                setLoading(false);
            }
        };
        loadTests();
    }, []);

    const handleTestResultView = (test) => {
        // Find the original test to get questions and other meta data
        const baseTest = tests.find(t => t.title === (test.title || test.test) && t.subject === test.subject);
        setSelectedTestForResult({
            ...test,
            title: test.title || test.test,
            questionsList: baseTest?.questions || [],
            topicBreakdown: baseTest?.topicBreakdown || test.topicBreakdown || []
        });
    };

    const handleStartTest = (test) => {
        setActiveTest(test);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (activeTest) {
        return (
            <div className="fixed inset-0 z-50 bg-white overflow-hidden">
                <ExamInterface
                    test={activeTest}
                    onExit={() => setActiveTest(null)}
                    onComplete={async (updatedTest) => {
                        try {
                            const userData = getCurrentUser();
                            if (userData) {
                                await api.submitTestHistory({
                                    email: userData.email,
                                    testTitle: updatedTest.title,
                                    subject: updatedTest.subject,
                                    category: updatedTest.category,
                                    score: updatedTest.score,
                                    totalPoints: updatedTest.totalPoints,
                                    correctCount: updatedTest.correctCount,
                                    wrongCount: updatedTest.wrongCount,
                                    responsesJson: updatedTest.responsesJson,
                                    timeTaken: updatedTest.timeTaken,
                                    date: new Date().toISOString().split('T')[0],
                                    status: 'Completed',
                                    analytics: updatedTest.analytics || {}
                                });
                                // Trigger global context refresh to update dashboard metrics
                                if (refreshData) await refreshData();
                            }
                            setTests(prev => prev.map(t => t.id === updatedTest.id ? { ...updatedTest, completed: true } : t));
                        } catch (error) {
                            console.error('Error submitting test history:', error);
                        } finally {
                            setActiveTest(null);
                        }
                    }}
                    darkMode={darkMode}
                />
            </div>
        );
    }

    if (selectedTestForResult) {
        return (
            <TestAnalyticsView
                test={selectedTestForResult}
                setSelectedTestForResult={setSelectedTestForResult}
                darkMode={darkMode}
            />
        );
    }

    return (
        <div className="space-y-12">
            {/* View Toggle */}
            <div className="flex justify-center sm:justify-start">
                <div className={`flex p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <button
                        onClick={() => setViewMode('available')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'available'
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                            : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Available Tests
                    </button>
                    <button
                        onClick={() => setViewMode('history')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'history'
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                            : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        My History
                    </button>
                </div>
            </div>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {viewMode === 'available' ? (
                    <div className="space-y-12">
                        {/* Available Tests */}
                        <TestCard
                            tests={tests.filter(t => !t.completed)}
                            videos={videos}
                            darkMode={darkMode}
                            onViewResults={handleTestResultView}
                            onStartTest={handleStartTest}
                            t={t}
                            title={t("availableTests")}
                        />

                        {/* Completed Tests */}
                        {tests.some(t => t.completed) && (
                            <TestCard
                                tests={tests.filter(t => t.completed)}
                                videos={videos}
                                darkMode={darkMode}
                                onViewResults={handleTestResultView}
                                onStartTest={handleStartTest}
                                t={t}
                                title={t("completedTests")}
                            />
                        )}
                    </div>
                ) : (
                    <TestHistoryView
                        tests={tests}
                        onTestClick={handleTestResultView}
                        darkMode={darkMode}
                    />
                )}
            </section>
        </div>
    );
};

export default TestsPage;
