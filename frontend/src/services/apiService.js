import axios from './axiosInstance';

export const apiService = {
    getStudentTestHistory: async (studentId) => {
        try {
            // First try fetching by studentId (string) which returns full student details including history
            const response = await axios.get(`/admin/students/${studentId}`);
            if (response.data && response.data.detailedTestHistory) {
                return response.data.detailedTestHistory;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching test history for student ${studentId}:`, error);
            return [];
        }
    },

    getStudentTutorials: async (studentId) => {
        try {
            // For now, using the tutorials list which returns videos as tutorials
            const response = await axios.get('/videos');
            return response.data;
        } catch (error) {
            console.error(`Error fetching tutorials for student ${studentId}:`, error);
            return [];
        }
    },

    getVideos: async () => {
        try {
            const response = await axios.get('/videos');
            return response.data;
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    },

    getVideoProgress: async (email) => {
        try {
            const response = await axios.get(`/video-progress/${email}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching video progress for ${email}:`, error);
            return [];
        }
    }
};

export default apiService;
