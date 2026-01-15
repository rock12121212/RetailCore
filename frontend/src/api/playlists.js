import apiClient from './client.js';

export const listPlaylists = async () => {
  const response = await apiClient.get('/playlists');
  return response.data?.data || response.data;
};

export const getPlaylist = async (id) => {
  const response = await apiClient.get(`/playlists/${id}`);
  return response.data?.data || response.data;
};

export const createPlaylist = async (payload) => {
  const response = await apiClient.post('/playlists', payload);
  return response.data?.data || response.data;
};

export const updatePlaylist = async (id, payload) => {
  const response = await apiClient.patch(`/playlists/${id}`, payload);
  return response.data?.data || response.data;
};

export const deletePlaylist = async (id) => {
  const response = await apiClient.delete(`/playlists/${id}`);
  return response.data?.data || response.data;
};
