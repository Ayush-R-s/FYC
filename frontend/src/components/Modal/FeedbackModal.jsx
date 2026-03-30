import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { printFeedback, downloadFeedback } from '../../utils/printUtils'

const FeedbackModal = ({
    selectedFeedback,
    onClose,
    onMarkReviewed,
    isReviewed,
    isDarkMode
}) => {
    if (!selectedFeedback) return null;

    const renderStars = (rating) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (<span key={i} className={i <= rating ? 'text-orange-500' : 'text-gray-300'}>★</span>))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full shadow-xl`}>
                <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Feedback Details</h2>
                    <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Student Name</p><p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedFeedback.studentName}</p></div>
                        <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Student ID</p><p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedFeedback.studentId}</p></div>
                        <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Faculty Name</p><p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedFeedback.facultyName}</p></div>
                        <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Subject</p><p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedFeedback.subject}</p></div>
                        <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Date & Time</p><p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedFeedback.date} at {selectedFeedback.time}</p></div>
                        <div><p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Rating</p><div className="flex gap-1 mt-1">{renderStars(selectedFeedback.rating)}<span className={`ml-2 font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>({selectedFeedback.rating}/5)</span></div></div>
                    </div>

                    <div><p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 font-semibold`}>Student Comments</p><p className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'} p-4 rounded-lg`}>{selectedFeedback.comments}</p></div>
                </div>

                <div className={`flex gap-3 justify-end p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button onClick={onClose} className={`px-6 py-2.5 border rounded-lg font-semibold transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Close</button>
                    <button onClick={() => printFeedback(selectedFeedback)} className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg font-semibold transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}><Printer className="w-4 h-4" /> Print</button>
                    <button onClick={() => downloadFeedback(selectedFeedback)} className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg font-semibold transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}><Download className="w-4 h-4" /> Download</button>
                    <button onClick={() => { onMarkReviewed(selectedFeedback.id); onClose(); }} className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${isReviewed ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`} disabled={isReviewed}>{isReviewed ? 'Marked as Reviewed' : 'Mark as Reviewed'}</button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
