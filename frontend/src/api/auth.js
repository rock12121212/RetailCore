import axios from 'axios';
import { API_BASE_URL } from './config.js';
import { clearAuthTokens, setAuthTokens } from './tokenStore.js';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const unwrap = (response) => response?.data?.data || response?.data;

export const login = async (payload) => {
  const response = await authClient.post('/auth/login', payload);
  const data = unwrap(response);
  setAuthTokens(data);
  return data;
};

export const register = async (payload) => {
  // If payload is FormData, axios will automatically set the correct headers
  const response = await authClient.post('/auth/register', payload);
  return unwrap(response);
};

export const refresh = async () => {
  const response = await authClient.post('/auth/refresh');
  const data = unwrap(response);
  setAuthTokens(data);
  return data;
};

export const logout = async () => {
  await authClient.post('/auth/logout');
  clearAuthTokens();
};
