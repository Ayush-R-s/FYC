import React from 'react';
import { Lock } from 'lucide-react';
import { getSubjectColor, isVideoCompleted, isTestUnlocked } from '../../utils/helpers';

const TestCard = ({ tests, videos, darkMode, onViewResults, onStartTest, t, title }) => {
    return (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="mb-6">
                <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {title || t("availableTests")}
                </h2>
                <div className="mt-2 h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
            </div>
            {tests.length === 0 ? (
                <div className={`col-span-full text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="text-lg">{t("noTests")}</p>
                    <p className="text-sm mt-2">{t("checkBack")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {tests.map(test => {
                        const isUnlocked = isTestUnlocked(videos, test);
                        const lockedVideos = test.videos ? test.videos.filter(v => !isVideoCompleted(videos, v.id)) : [];

                        return (
                            <div key={test.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 sm:p-6 shadow-sm relative ${!isUnlocked ? 'overflow-hidden' : ''}`}>
                                {!isUnlocked && (
                                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center z-10 p-4">
                                        <Lock className="w-8 h-8 text-white mb-2" />
                                        <p className="text-white text-xs font-bold text-center mb-1">{t("locked")}</p>
                                        <p className="text-white/80 text-[10px] text-center">
                                            {t("watchRequired")}
                                        </p>
                                        <div className="mt-2 max-w-full overflow-hidden">
                                            {lockedVideos.slice(0, 2).map(v => (
                                                <div key={v.id} className="text-[10px] text-orange-300 truncate px-2">• {v.title}</div>
                                            ))}
                                            {lockedVideos.length > 2 && <div className="text-[10px] text-orange-300 px-2">{t("andMore").replace("...", "")} {lockedVideos.length - 2} {t("more")}</div>}
                                        </div>
                                    </div>
                                )}
                                <div className={`inline-block ${getSubjectColor(test.subject)} px-3 py-1 rounded-full text-xs font-medium mb-3`}>
                                    {test.subject}
                                </div>
                                <h3 className={`font-bold text-lg mb-4 ${darkMode ? 'text-white' : ''}`}>{test.title}</h3>
                                <div className={`space-y-2 text-sm mb-4 ${darkMode ? 'text-gray-300' : ''}`}>
                                    <div className="flex justify-between">
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t("questions")}</span>
                                        <span className="font-medium">{Array.isArray(test.questions) ? test.questions.length : test.questions}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t("duration")}</span>
                                        <span className="font-medium">{test.duration}</span>
                                    </div>
                                    {test.videos && test.videos.length > 0 && (
                                        <div className="flex justify-between pt-2">
                                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{test.videos.length} {t("requiredVideos")}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => test.completed ? onViewResults(test) : onStartTest(test)}
                                    disabled={!isUnlocked}
                                    className={`w-full font-medium py-2 px-4 rounded-lg transition-colors text-sm ${isUnlocked
                                        ? (test.completed ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer' : 'bg-orange-600 hover:bg-orange-700 text-white cursor-pointer')
                                        : darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {test.completed ? `👁️ ${t("viewResults")}` : `▶️ ${t("startTest")}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TestCard;