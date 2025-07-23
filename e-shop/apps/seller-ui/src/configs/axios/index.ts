import axios from 'axios';

const headers = {};

console.log({ 'api url': process.env.NEXT_PUBLIC_API_BASE_URL });

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const handleLogOut = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

axiosInstance.interceptors.request.use((config) => {
  console.log('Request Interceptor', config);
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh(() => {
        resolve(config);
      });
    });
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post('/refress_token', {});
        if (response.status === 200) {
          // No need to attach any Authorization header
          onRefreshSuccess();
          isRefreshing = false;

          // Retry original request as-is
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogOut();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
