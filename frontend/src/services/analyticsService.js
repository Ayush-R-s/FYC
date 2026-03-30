import axios from './axiosInstance';

export const analyticsService = {
    getOverallStats: async () => {
        try {
            const response = await axios.get('/admin/stats/overall');
            return response.data;
        } catch (error) {
            console.error('Error fetching overall stats:', error);
            return null;
        }
    },

    getEngagementData: async () => {
        try {
            const response = await axios.get('/admin/stats/engagement');
            return response.data;
        } catch (error) {
            console.error('Error fetching engagement data:', error);
            return [];
        }
    },

    getPerformanceData: async () => {
        try {
            const response = await axios.get('/admin/analytics/performance');
            return response.data;
        } catch (error) {
            console.error('Error fetching performance data:', error);
            return [];
        }
    },

    getCompletionData: async (dateRange) => {
        try {
            const response = await axios.get('/admin/analytics/completion', {
                params: {
                    range: dateRange || 'all',
                    subject: 'all'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching completion data:', error);
            return [];
        }
    },

    getVideoAnalytics: async () => {
        try {
            const response = await axios.get('/admin/analytics/videos');
            return response.data;
        } catch (error) {
            console.error('Error fetching video analytics:', error);
            return [];
        }
    },

    getVideoStudents: async (videoId) => {
        try {
            const response = await axios.get(`/admin/analytics/videos/${videoId}/students`);
            return response.data;
        } catch (error) {
            console.error('Error fetching students for video:', error);
            return [];
        }
    },

    getStudents: async () => {
        try {
            const response = await axios.get('/admin/analytics/students');
            return response.data;
        } catch (error) {
            console.error('Error fetching students for analytics:', error);
            return [];
        }
    }
};

export default analyticsService;
