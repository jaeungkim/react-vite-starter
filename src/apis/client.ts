import axios from 'axios';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
});

client.interceptors.request.use((config) => {
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
