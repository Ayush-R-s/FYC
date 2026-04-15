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

export const uploadNotes = async (file, title, subject, topic, pages, description, contentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    if (topic) formData.append('topic', topic);
    if (pages) formData.append('pages', pages);
    if (description) formData.append('description', description);
    if (contentType) formData.append('contentType', contentType);

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

export const updateNote = async (id, file, title, subject, topic, pages, content, contentType) => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    if (topic) formData.append('topic', topic);
    if (pages) formData.append('pages', pages);
    if (content) formData.append('description', content);
    if (contentType) formData.append('contentType', contentType);

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

export const getPresignedVideoUrl = async (fileName, contentType) => {
    try {
        const response = await axios.post('/admin/content/video/presigned-url', null, {
            params: { fileName, contentType }
        });
        return response.data; // { url, key }
    } catch (error) {
        console.error('Error getting presigned URL:', error);
        throw error;
    }
};

// Vanilla fetch is often better for simple PUT to S3 to avoid Axios interceptors doing weird things
export const uploadVideoDirect = async (url, file) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });
        if (!response.ok) {
           throw new Error(`S3 upload failed: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error('Error uploading video directly to S3:', error);
        throw error;
    }
};

export const uploadVideoMetadata = async (filePath, fileName, title, subject, duration) => {
    const formData = new FormData();
    formData.append('filePath', filePath);
    formData.append('fileName', fileName);
    formData.append('title', title);
    formData.append('subject', subject);
    if (duration) formData.append('duration', duration);

    try {
        const response = await axios.post('/admin/content/video', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error saving video metadata:', error);
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

// ================= QUESTIONS (BANK) =================

export const getAllPoolQuestions = async () => {
    try {
        const response = await axios.get('/admin/content/questions');
        return response.data;
    } catch (error) {
        console.error('Error fetching pool questions:', error);
        throw error;
    }
};

export const addQuestionToPool = async (questionData) => {
    try {
        const response = await axios.post('/admin/content/questions', questionData);
        return response.data;
    } catch (error) {
        console.error('Error adding question to pool:', error);
        throw error;
    }
};

export const updateQuestionInPool = async (id, questionData) => {
    try {
        const response = await axios.put(`/admin/content/questions/${id}`, questionData);
        return response.data;
    } catch (error) {
        console.error(`Error updating pool question ${id}:`, error);
        throw error;
    }
};

export const deleteQuestionFromPool = async (id) => {
    try {
        const response = await axios.delete(`/admin/content/questions/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting pool question ${id}:`, error);
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

export const importQuestionsFromPDF = async (file, subject, chapter, topic) => {
    const formData = new FormData();
    formData.append('file', file);
    if (subject) formData.append('subject', subject);
    if (chapter) formData.append('chapter', chapter);
    if (topic) formData.append('topic', topic);

    try {
        const response = await axios.post('/admin/content/questions/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error importing questions from PDF:', error);
        throw error;
    }
};

export const bulkAddQuestionsToPool = async (questions) => {
    try {
        const response = await axios.post('/admin/content/questions/bulk', questions);
        return response.data;
    } catch (error) {
        console.error('Error in bulk saving questions:', error);
        throw error;
    }
};
