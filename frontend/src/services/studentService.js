import axios from './axiosInstance';

export const getAllStudents = async () => {
    try {
        const response = await axios.get('/admin/students');
        // Handle cases where response might be wrapped in data object or direct array
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await axios.get(`/admin/students/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching student ${id}:`, error);
        throw error;
    }
};

export const createStudent = async (studentData) => {
    try {
        const response = await axios.post('/admin/students', studentData);
        return response.data;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
};

export const updateStudent = async (id, studentData) => {
    try {
        const response = await axios.put(`/admin/students/${id}`, studentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating student ${id}:`, error);
        throw error;
    }
};

export const deleteStudent = async (id) => {
    try {
        const response = await axios.delete(`/admin/students/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting student ${id}:`, error);
        throw error;
    }
};

export default {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
