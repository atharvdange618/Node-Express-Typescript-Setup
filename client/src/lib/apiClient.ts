// src/lib/apiClient.ts
import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Retry setup
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: (count) => count * 1000,
  retryCondition: (error: AxiosError) =>
    axiosRetry.isNetworkError(error) ||
    axiosRetry.isRetryableError(error) ||
    (error.response?.status ? error.response.status >= 500 : false),
});

// Request interceptor (attach token)
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle 401 globally)
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        if (error.config && newToken) {
          error.config.headers = {
            ...error.config.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return apiClient.request(error.config);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

// Token refresh
async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axios.post("/auth/refresh-token", { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data;

  useAuthStore.getState().setTokens(accessToken, newRefreshToken);
  return accessToken;
}

// Helpers
export const get = async <T>(
  url: string,
  options?: { signal?: AbortSignal }
): Promise<T> => {
  const response = await apiClient.get<T>(url, { signal: options?.signal });
  return response.data;
};

export const post = async <T>(
  url: string,
  data: any,
  options?: { signal?: AbortSignal }
): Promise<T> => {
  const response = await apiClient.post<T>(url, data, {
    signal: options?.signal,
  });
  return response.data;
};

export default apiClient;
