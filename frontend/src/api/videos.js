import apiClient from './client.js';

export const listVideos = async () => {
  const response = await apiClient.get('/videos');
  return response.data?.data || response.data;
};

export const getVideo = async (id) => {
  const response = await apiClient.get(`/videos/${id}`);
  return response.data?.data || response.data;
};

export const createVideo = async (payload) => {
  const response = await apiClient.post('/videos', payload);
  return response.data?.data || response.data;
};

export const updateVideo = async (id, payload) => {
  const response = await apiClient.patch(`/videos/${id}`, payload);
  return response.data?.data || response.data;
};

export const deleteVideo = async (id) => {
  const response = await apiClient.delete(`/videos/${id}`);
  return response.data?.data || response.data;
};
