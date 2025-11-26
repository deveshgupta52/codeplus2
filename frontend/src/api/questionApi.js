import api from './api';

export const getQuestions = () => api.get('/api/questions');
export const getQuestionById = (id) => api.get(`/api/questions/${id}`);
export const deleteQuestion = (id) => api.delete(`/api/questions/${id}`);

export const createQuestion = (questionData) => {
    const formData = new FormData();
    for (const key in questionData) {
        if (key === 'starterCode' || key === 'driverCode') {
             formData.append(key, JSON.stringify(questionData[key]));
        } else if (questionData[key] !== null) {
            formData.append(key, questionData[key]);
        }
    }
    return api.post('/api/questions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const updateQuestion = (id, questionData) => {
    const formData = new FormData();
    for (const key in questionData) {
        if (key === 'image' && questionData[key] instanceof File) {
             formData.append(key, questionData[key]);
        } else if (key === 'starterCode' || key === 'driverCode') {
             formData.append(key, JSON.stringify(questionData[key]));
        } else if (key !== 'image' && questionData[key] !== null) {
            formData.append(key, questionData[key]);
        }
    }
    return api.put(`/api/questions/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};