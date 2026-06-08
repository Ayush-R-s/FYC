import axios from 'axios';

// Centralized API Base URL
// Matches server.servlet.context-path=/api in backend
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://52.66.31.140/api';

const instance = axios.create({
    baseURL: API_BASE_URL
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized - clear token and redirect if not on login page
            localStorage.removeItem('token');
            const path = window.location.pathname;
            const isAuthPage = path === '/login' ||
                path === '/admin-login' ||
                path === '/student-login' ||
                path === '/student-login/register' ||
                path === '/' ||
                path === '/about' ||
                path === '/contact';

            if (!isAuthPage) {
                window.location.href = '/admin-login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
