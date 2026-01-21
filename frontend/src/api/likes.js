import apiClient from './client.js';

export const getLikeStats = async (targetType, targetId) => {
  const params = { [`${targetType}Id`]: targetId };
  const response = await apiClient.get('/likes/stats', { params });
  return response.data?.data || response.data;
};

export const toggleLike = async (targetType, targetId) => {
  const payload = { [`${targetType}Id`]: targetId };
  const response = await apiClient.post('/likes/toggle', payload);
  return response.data?.data || response.data;
};
