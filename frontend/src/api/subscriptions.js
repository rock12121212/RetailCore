import apiClient from './client.js';

export const listSubscriptions = async () => {
  const response = await apiClient.get('/subscriptions');
  return response.data?.data || response.data;
};

export const createSubscription = async (payload) => {
  const response = await apiClient.post('/subscriptions', payload);
  return response.data?.data || response.data;
};

export const deleteSubscription = async (channelId) => {
  const response = await apiClient.delete(`/subscriptions/channel/${channelId}`);
  return response.data?.data || response.data;
};
