import React from 'react';
import { Lock } from 'lucide-react';
import { getSubjectColor, isVideoCompleted } from '../../utils/helpers';

const MockTestCard = ({ mockTests, videos, darkMode, onViewResults }) => {
    return (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="mb-6">
                <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Mock Tests
                </h2>
                <div className="mt-2 h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
            </div>
            {mockTests.length === 0 ? (
                <div className={`col-span-full text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="text-lg">No mock tests available yet.</p>
                    <p className="text-sm mt-2">Check back later for new tests!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {mockTests.map(test => {
                        const isUnlocked = test.requiredVideoIds
                            ? test.requiredVideoIds.every(vid => isVideoCompleted(videos, vid))
                            : true;
                        return (
                            <div key={test.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 sm:p-6 shadow-sm relative`}>
                                {!isUnlocked && (
                                    <div className="absolute inset-0 bg-gray-400 bg-opacity-50 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm z-10">
                                        <Lock className="w-8 h-8 text-white mb-2" />
                                        <p className="text-white text-xs font-medium text-center px-4">
                                            Complete required videos
                                        </p>
                                    </div>
                                )}
                                <div className={`inline-block ${getSubjectColor(test.subject)} px-3 py-1 rounded-full text-xs font-medium mb-3`}>
                                    {test.subject}
                                </div>
                                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : ''}`}>{test.title}</h3>
                                <div className={`space-y-2 text-sm mb-4 ${darkMode ? 'text-gray-300' : ''}`}>
                                    <div className="flex justify-between">
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Questions</span>
                                        <span className="font-medium">{Array.isArray(test.questions) ? test.questions.length : test.questions}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Duration</span>
                                        <span className="font-medium">{test.duration} min</span>
                                    </div>
                                    {test.completed && (
                                        <div className="flex justify-between">
                                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your Score</span>
                                            <span className="font-medium text-green-600">{test.score}%</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => test.completed ? onViewResults(test) : alert(`Starting mock test: ${test.title}`)}
                                    disabled={!isUnlocked}
                                    className={`w-full font-medium py-2 px-4 rounded-lg transition-colors text-sm ${isUnlocked
                                        ? (test.completed ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer' : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer')
                                        : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {test.completed ? '👁️ View Results' : '▶️ Start Test'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MockTestCard;