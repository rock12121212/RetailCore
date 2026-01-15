import axios from 'axios';
import { API_BASE_URL } from './config.js';
import { refresh } from './auth.js';
import { clearAuthTokens, getAccessToken, getCsrfToken } from './tokenStore.js';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const isAuthRequest = (url = '') =>
  url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/register');

let refreshPromise = null;

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  const csrfToken = getCsrfToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (csrfToken) {
    config.headers = config.headers || {};
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error || {};

    if (!response || response.status !== 401 || !config || config._retry) {
      return Promise.reject(error);
    }

    if (isAuthRequest(config.url)) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refresh().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      const newToken = getAccessToken();
      if (newToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newToken}`;
      }
      return apiClient(config);
    } catch (refreshError) {
      clearAuthTokens();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
