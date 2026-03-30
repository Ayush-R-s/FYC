import axios from './axiosInstance';

// Helper to create FormData
const createFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });
    return formData;
};

// ================= CONTENT (NOTES & VIDEOS) =================

export const getAllContent = async () => {
    try {
        const response = await axios.get('/admin/content');
        return response.data;
    } catch (error) {
        console.error('Error fetching all content:', error);
        throw error;
    }
};

export const deleteContent = async (id) => {
    try {
        const response = await axios.delete(`/admin/content/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting content ${id}:`, error);
        throw error;
    }
};

// --- NOTES ---

export const uploadNotes = async (file, title, subject, topic, pages, description) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    if (topic) formData.append('topic', topic);
    if (pages) formData.append('pages', pages);
    if (description) formData.append('description', description);

    try {
        const response = await axios.post('/admin/content/notes', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading notes:', error);
        throw error;
    }
};

export const updateNote = async (id, file, title, subject, topic, pages, content) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    if (topic) formData.append('topic', topic);
    if (pages) formData.append('pages', pages);
    if (content) formData.append('description', content);

    try {
        const response = await axios.put(`/admin/content/notes/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating note ${id}:`, error);
        throw error;
    }
};

// --- VIDEOS ---

export const uploadVideo = async (file, title, subject, duration) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    if (duration) formData.append('duration', duration);

    try {
        const response = await axios.post('/admin/content/video', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

export const updateVideoApi = async (id, file, title, subject, duration) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    if (duration) formData.append('duration', duration);

    try {
        const response = await axios.put(`/admin/content/video/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating video ${id}:`, error);
        throw error;
    }
};

export const getAllVideosApi = async () => {
    try {
        const response = await axios.get('/admin/content/videos');
        return response.data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        throw error;
    }
};

// ================= TESTS =================

export const getAllTests = async () => {
    try {
        const response = await axios.get('/admin/content/tests');
        return response.data;
    } catch (error) {
        console.error('Error fetching tests:', error);
        throw error;
    }
};

export const getTestById = async (id) => {
    try {
        const response = await axios.get(`/admin/content/tests/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching test ${id}:`, error);
        throw error;
    }
};

export const createTest = async (testData) => {
    try {
        const response = await axios.post('/admin/content/tests', testData);
        return response.data;
    } catch (error) {
        console.error('Error creating test:', error);
        throw error;
    }
};

export const updateTestApi = async (id, testData) => {
    try {
        const response = await axios.put(`/admin/content/tests/${id}`, testData);
        return response.data;
    } catch (error) {
        console.error(`Error updating test ${id}:`, error);
        throw error;
    }
};

export const deleteTest = async (id) => {
    try {
        const response = await axios.delete(`/admin/content/tests/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting test ${id}:`, error);
        throw error;
    }
};

export const generateAIQuestions = async (file, numQuestions, difficulty) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('numberOfQuestions', numQuestions); // Backend expected name
    formData.append('difficulty', difficulty);

    try {
        const response = await axios.post('/admin/content/ai/generate', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error generating AI questions:', error);
        throw error;
    }
};
