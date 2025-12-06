import api from './api';

export const getGlobalDiscussions = () => api.get('/api/discussion/all');
export const getSingleGlobalDiscussion = (discussionId) => api.get(`/api/discussion/global/${discussionId}`);
export const createGlobalDiscussion = (discussionData) => api.post('/api/discussion/all', discussionData);
export const addGlobalComment = (discussionId, commentData) => api.post(`/api/discussion/global/${discussionId}`, commentData);
export const getProblemDiscussion = (problemId) => api.get(`/api/discussion/${problemId}`);
export const addProblemComment = (problemId, commentData) => api.post(`/api/discussion/${problemId}`, commentData);
export const deleteComment = (commentId) => api.delete(`/api/discussion/comment/${commentId}`);
export const likeComment = (commentId) => api.put(`/api/discussion/like/${commentId}`);
export const editComment = (commentId, commentData) => api.put(`/api/discussion/comment/${commentId}`, commentData);