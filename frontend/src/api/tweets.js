import apiClient from './client.js';

export const listTweets = async () => {
  const response = await apiClient.get('/tweets');
  return response.data?.data || response.data;
};

export const createTweet = async (payload) => {
  const response = await apiClient.post('/tweets', payload);
  return response.data?.data || response.data;
};

export const deleteTweet = async (id) => {
  const response = await apiClient.delete(`/tweets/${id}`);
  return response.data?.data || response.data;
};
