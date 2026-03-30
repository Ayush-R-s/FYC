import axios from './axiosInstance';

const feedbackService = {
    getAllFeedback: async () => {
        try {
            const response = await axios.get('/admin/feedback');
            return response.data; // Expecting array of feedback objects
        } catch (error) {
            console.error('Error fetching feedback:', error);
            throw error;
        }
    },

    markAsReviewed: async (id) => {
        try {
            const response = await axios.patch(`/admin/feedback/${id}/review`);
            return response.data;
        } catch (error) {
            console.error(`Error marking feedback ${id} as reviewed:`, error);
            throw error;
        }
    }
};

export default feedbackService;
