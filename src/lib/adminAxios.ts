import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('adminApiKey');
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminApiKey');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
