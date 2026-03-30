import axios from './axiosInstance';

const authService = {
    // Admin Login
    adminLogin: async (email, password) => {
        try {
            const response = await axios.post('/auth/admin-login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    // Student Login (if needed by admin app for testing, or general auth)
    studentLogin: async (email, password) => {
        try {
            const response = await axios.post('/auth/student-login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    // Student Registration
    registerStudent: async (studentData) => {
        try {
            console.log('Sending registration request with data:', studentData);
            const response = await axios.post('/auth/register', studentData);
            console.log('Registration response status:', response.status);
            console.log('Registration response data:', response.data);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Registration failed error object:', error);
            if (error.response) {
                console.error('Server responded with 400 Bad Request. Details:', error.response.data);
                const errorMessage = error.response.data.error || 'Registration failed. Please try again.';
                return { success: false, error: errorMessage };
            }
            return { success: false, error: 'Registration failed. Connection error.' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('userRole');
        // window.location.href = '/login'; // Optional: Redirect
    },

    // Get Current User
    getCurrentUser: () => {
        return {
            name: localStorage.getItem('adminName'),
            email: localStorage.getItem('adminEmail'),
            role: localStorage.getItem('userRole'),
        };
    }
};

export default authService;
