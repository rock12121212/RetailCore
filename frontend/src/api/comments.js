import apiClient from './client.js';

export const listCommentsByVideo = async (videoId) => {
  const response = await apiClient.get(`/comments/video/${videoId}`);
  return response.data?.data || response.data;
};

export const createComment = async (payload) => {
  const response = await apiClient.post('/comments', payload);
  return response.data?.data || response.data;
};

export const deleteComment = async (id) => {
  const response = await apiClient.delete(`/comments/${id}`);
  return response.data?.data || response.data;
};

export const getReplies = async (commentId) => {
  const response = await apiClient.get(`/comments/replies/${commentId}`);
  return response.data?.data || response.data;
};

export const addReply = async (commentId, content) => {
  const response = await apiClient.post(`/comments/reply/${commentId}`, { content });
  return response.data?.data || response.data;
};
