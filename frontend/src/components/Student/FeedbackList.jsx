import React, { useState } from 'react';
import { Star } from 'lucide-react';
const FeedbackList = ({ darkMode, setFeedbackModalOpen, feedbacks, t }) => {
    const [expandedFeedback, setExpandedFeedback] = useState(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : ''}`}>{t("feedback")}</h2>
                <button
                    onClick={() => setFeedbackModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 sm:px-6 rounded-lg transition-colors text-sm"
                >
                    + {t("submitFeedback")}
                </button>
            </div>

            <div className="space-y-4">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : ''}`}>{t("recentFeedbacks")}</h3>
                {feedbacks.length === 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center`}>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t("noFeedbacks")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedbacks.map(feedback => (
                            <div key={feedback.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : ''}`}>{feedback.facultyName || feedback.faculty}</h4>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feedback.subject}</p>
                                    </div>
                                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{feedback.date || feedback.timestamp}</span>
                                </div>

                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < feedback.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feedback.comments || feedback.comment}</p>

                                <button
                                    onClick={() => setExpandedFeedback(expandedFeedback === feedback.id ? null : feedback.id)}
                                    className="text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors"
                                >
                                    {expandedFeedback === feedback.id ? t("hideDetails") : t("viewDetails")}
                                </button>

                                {expandedFeedback === feedback.id && (
                                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feedback.comments || feedback.comment}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackList;