import React, { useState, useEffect } from 'react';
import FeedbackList from '../../components/Student/FeedbackList';
import FeedbackModal from '../../components/Student/FeedbackModal';
import * as api from '../../utils/api';

import { useAppContext } from '../../context/AppContext';

const FeedbackPage = ({ darkMode }) => {
    const { t } = useAppContext();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [expandedFeedback, setExpandedFeedback] = useState(null);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackData, setFeedbackData] = useState({
        facultyName: '',
        subject: '',
        rating: 0,
        comments: ''
    });

    useEffect(() => {
        const loadFeedbacks = async () => {
            try {
                setLoading(true);
                // Get current student info from localStorage to filter feedback
                const studentData = (() => {
                    try {
                        const s = localStorage.getItem('student');
                        if (s) return JSON.parse(s);
                        const u = localStorage.getItem('user');
                        if (u) return JSON.parse(u);
                    } catch (e) {
                        console.error('Error parsing student data from localStorage:', e);
                    }
                    return {};
                })();

                const studentId = studentData.studentId || (studentData.id ? String(studentData.id) : null) || studentData.email || 'unknown';
                const data = await api.fetchFeedbacks(studentId);
                setFeedbacks(data);
            } catch (error) {
                console.error('Error loading feedbacks:', error);
            } finally {
                setLoading(false);
            }
        };
        loadFeedbacks();
    }, []);

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingClick = (rating) => {
        setFeedbackData(prev => ({
            ...prev,
            rating: rating
        }));
    };

    const handleFeedbackSubmit = async () => {
        const { facultyName, subject, rating, comments } = feedbackData;

        if (facultyName && subject && rating && comments) {
            try {
                // Get current student info from localStorage (checking both 'student' and 'user' keys)
                const studentData = (() => {
                    try {
                        const s = localStorage.getItem('student');
                        if (s) return JSON.parse(s);
                        const u = localStorage.getItem('user');
                        if (u) return JSON.parse(u);
                    } catch (e) {
                        console.error('Error parsing student data from localStorage:', e);
                    }
                    return {};
                })();

                const payload = {
                    ...feedbackData,
                    studentName: studentData.name || 'Anonymous Student',
                    studentId: studentData.studentId || (studentData.id ? String(studentData.id) : null) || studentData.email || 'unknown'
                };

                const newFeedback = await api.submitFeedback(payload);
                setFeedbacks([newFeedback, ...feedbacks]);
                setFeedbackSubmitted(true);
                setTimeout(() => {
                    setFeedbackSubmitted(false);
                    setFeedbackData({ facultyName: '', subject: '', rating: 0, comments: '' });
                    setFeedbackModalOpen(false);
                }, 2000);
            } catch (error) {
                console.error('Error submitting feedback:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <>
            <FeedbackList
                darkMode={darkMode}
                setFeedbackModalOpen={setFeedbackModalOpen}
                feedbacks={feedbacks}
                expandedFeedback={expandedFeedback}
                setExpandedFeedback={setExpandedFeedback}
                t={t}
            />

            {feedbackModalOpen && (
                <FeedbackModal
                    darkMode={darkMode}
                    feedbackModalOpen={feedbackModalOpen}
                    setFeedbackModalOpen={setFeedbackModalOpen}
                    feedbackData={feedbackData}
                    handleFeedbackChange={handleFeedbackChange}
                    handleRatingClick={handleRatingClick}
                    handleFeedbackSubmit={handleFeedbackSubmit}
                    feedbackSubmitted={feedbackSubmitted}
                    t={t}
                />
            )}
        </>
    );
};

export default FeedbackPage;
