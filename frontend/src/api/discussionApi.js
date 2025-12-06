
import api from './api';

export const getDiscussion = (problemId) => api.get(`/api/discussion/${problemId}`);
export const addComment = (problemId, commentData) => api.post(`/api/discussion/${problemId}`, commentData);
export const likeComment = (commentId) => api.put(`/api/discussion/like/${commentId}`);
