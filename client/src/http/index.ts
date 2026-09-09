import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse } from '../types/response/AuthResponse';
import { storage, TOKEN_KEY } from '../utils/storage';

// Адрес API берём от текущего домена: сайт и API живут на одном origin,
// поэтому при смене домена ничего править в коде не нужно.
export const API_URL = `${window.location.origin}/api`;

type RetriableConfig = InternalAxiosRequestConfig & { _isRetry?: boolean };

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
    const token = storage.get(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

$api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableConfig | undefined;

        // Один раз пробуем обновить access-токен по refresh-куке и повторить запрос.
        if (error.response?.status === 401 && originalRequest && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            try {
                const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
                    withCredentials: true,
                });
                storage.set(TOKEN_KEY, response.data.accessToken);
                return $api.request(originalRequest);
            } catch {
                // Сессия не восстановилась — чистим протухший токен, чтобы не долбить сервер.
                storage.remove(TOKEN_KEY);
            }
        }

        return Promise.reject(error);
    }
);

export default $api;
