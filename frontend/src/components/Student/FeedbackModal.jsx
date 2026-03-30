import React from 'react';
import { X, Send, Star } from 'lucide-react';

const FeedbackModal = ({
    darkMode,
    setFeedbackModalOpen,
    feedbackData,
    handleFeedbackChange,
    handleRatingClick,
    handleFeedbackSubmit,
    feedbackSubmitted,
    t
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
                <div className={`sticky top-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center p-4 sm:p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : ''}`}>{t("submitFeedback")}</h3>
                    <button
                        onClick={() => setFeedbackModalOpen(false)}
                        className={`transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    {feedbackSubmitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <p className="text-green-800 font-medium">✓ {t("feedbackSubmitted") || "Feedback submitted successfully!"}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{t("faculty")} *</label>
                                <input
                                    type="text"
                                    name="facultyName"
                                    value={feedbackData.facultyName}
                                    onChange={handleFeedbackChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-black'
                                        }`}
                                    placeholder={t("enterFacultyName") || "Enter faculty name"}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{t("subject")} *</label>
                                <select
                                    name="subject"
                                    value={feedbackData.subject}
                                    onChange={handleFeedbackChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-black'
                                        }`}
                                >
                                    <option value="">{t("selectSubject") || "Select Subject"}</option>
                                    <option value="Physics">{t("physics") || "Physics"}</option>
                                    <option value="Chemistry">{t("chemistry") || "Chemistry"}</option>
                                    <option value="Botany">{t("botany") || "Botany"}</option>
                                    <option value="Zoology">{t("zoology") || "Zoology"}</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{t("rating")} *</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingClick(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${feedbackData.rating >= star
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{t("comment")} *</label>
                                <textarea
                                    name="comments"
                                    value={feedbackData.comments}
                                    onChange={handleFeedbackChange}
                                    rows="4"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-black'
                                        }`}
                                    placeholder={t("enterFeedback") || "Enter your feedback..."}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setFeedbackModalOpen(false)}
                                    className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors text-sm ${darkMode
                                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    {t("cancel") || "Cancel"}
                                </button>
                                <button
                                    onClick={handleFeedbackSubmit}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <Send className="w-4 h-4" />
                                    {t("submit")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;