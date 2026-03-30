import axios from "../services/axiosInstance";

// This file adapts the new service layer to match the expected structure in AppContext.jsx

export const fetchDashboardData = async () => {
    try {
        const response = await axios.get('/dashboard');
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return {
            overallProgress: 0,
            accuracy: 0,
            speed: 0,
            tutorialCompletion: { completed: 0, total: 0, percentage: 0 },
            dailyMockScores: [],
            weeklyTestScores: [],
            subjectProgress: []
        };
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await axios.get('/user/profile');
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const fetchNotes = async () => {
    try {
        const response = await axios.get('/notes');
        return response.data;
    } catch (error) {
        console.error("Error fetching notes:", error);
        return [];
    }
};

export const fetchActivities = async () => {
    try {
        const response = await axios.get('/activities');
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        return [];
    }
};

export const fetchVideos = async () => {
    try {
        const response = await axios.get('/videos');
        return response.data;
    } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
};

export const fetchVideoProgress = async (email) => {
    try {
        const response = await axios.get(`/video-progress/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching video progress:", error);
        return [];
    }
};

export const addActivity = async (activity) => {
    try {
        const response = await axios.post('/activities', activity);
        return response.data;
    } catch (error) {
        console.error("Error adding activity:", error);
        throw error;
    }
};

export const fetchNotifications = async () => {
    try {
        const response = await axios.get('/notifications');
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const markAllNotificationsAsRead = async () => {
    try {
        const response = await axios.post('/notifications/mark-all-read');
        return response.data;
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return { success: false };
    }
};

export const fetchTests = async () => {
    try {
        const response = await axios.get('/tests');
        return response.data;
    } catch (error) {
        console.error("Error fetching tests:", error);
        return [];
    }
};

export const fetchTestHistory = async (email) => {
    try {
        const response = await axios.get(`/test-history/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching test history:", error);
        return [];
    }
};

export const submitTestHistory = async (testData) => {
    try {
        const response = await axios.post('/test-history', testData);
        return response.data;
    } catch (error) {
        console.error("Error submitting test history:", error);
        throw error;
    }
};

export const fetchFeedbacks = async (studentId) => {
    try {
        const response = await axios.get(`/feedbacks/${studentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
    }
};

export const submitFeedback = async (feedbackData) => {
    try {
        const response = await axios.post('/feedbacks', feedbackData);
        return response.data;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        throw error;
    }
};

export const fetchActivityFeed = async () => {
    try {
        const response = await axios.get('/activity/feed');
        return response.data;
    } catch (error) {
        console.error("Error fetching activity feed:", error);
        return [];
    }
};

export const saveVideoProgress = async (progressData) => {
    try {
        const response = await axios.post('/video-progress', progressData);
        return response.data;
    } catch (error) {
        console.error("Error saving video progress:", error);
        throw error;
    }
};

export const fetchTestLeaderboard = async (testTitle, subject, timeRange = 'all') => {
    try {
        const response = await axios.get('/leaderboard/test', {
            params: { testTitle, subject, timeRange }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching test leaderboard:", error);
        return [];
    }
};

export const fetchWeeklyLeaderboard = async () => {
    try {
        const response = await axios.get('/leaderboard/weekly');
        return response.data;
    } catch (error) {
        console.error("Error fetching weekly leaderboard:", error);
        return [];
    }
};

export const fetchSchoolLeaderboard = async (timeRange) => {
    try {
        const response = await axios.get('/leaderboard/school', {
            params: { timeRange }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching school leaderboard:", error);
        return [];
    }
};

// Gamification Endpoints
export const fetchStreak = async (email) => {
    try {
        const response = await axios.get('/gamification/streak', { params: { email } });
        return response.data;
    } catch (error) {
        console.error("Error fetching streak:", error);
        return null;
    }
};

export const fetchBadges = async (email) => {
    try {
        const response = await axios.get('/gamification/badges', { params: { email } });
        return response.data;
    } catch (error) {
        console.error("Error fetching badges:", error);
        return [];
    }
};

export const fetchLeaderboard = async (schoolName) => {
    try {
        const response = await axios.get('/gamification/leaderboard', { params: { schoolName } });
        return response.data;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};

// Report Endpoints
export const downloadSchoolReport = async (schoolName, from, to) => {
    try {
        const response = await axios.get('/reports/school', {
            params: { schoolName, from, to },
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `School_Report_${schoolName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return true;
    } catch (error) {
        console.error("Error downloading school report:", error);
        return false;
    }
};

export const fetchSchools = async () => {
    try {
        const response = await axios.get('/admin/students/schools');
        return response.data;
    } catch (error) {
        console.error("Error fetching schools:", error);
        return [];
    }
};

