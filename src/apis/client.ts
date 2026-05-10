import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

export const client = axios.create({
  baseURL,
});

client.interceptors.request.use((config) => {
  // TODO: attach auth header here, e.g.
  //   config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Request failed';
    toast.error(message);
    return Promise.reject(error);
  },
);
