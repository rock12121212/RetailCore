import apiClient from './client.js';

export const getCurrentUser = async () => {
  const response = await apiClient.get('/users/me');
  return response.data?.data || response.data;
};

export const updateProfile = async (payload) => {
  // If payload is FormData, axios will automatically set the correct headers
  const response = await apiClient.patch('/users/profile', payload);
  return response.data?.data || response.data;
};
