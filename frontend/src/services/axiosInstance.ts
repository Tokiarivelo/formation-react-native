import axios, { AxiosError } from 'axios';
import { configs } from '../configs/config';
import { getAccessToken } from '../modules/auth/tokenStore';
import { refreshAccessToken, logoutUser } from '../modules/auth/api';
import { triggerLogout } from './navigationService';

// --- Dedicated Axios Instance ---
const API_URL = configs.apiUrl;
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// A boolean flag to prevent multiple refresh calls simultaneously
let isRefreshing = false;
// A queue of deferred requests waiting for the token refresh to complete
let failedRequestsQueue: Array<{ resolve: (value?: any) => void; reject: (error: any) => void }> = [];

// 1. REQUEST INTERCEPTOR: Inject the Access Token
apiClient.interceptors.request.use(async (config) => {
    // Get the current token
    const accessToken = await getAccessToken();

    // If a token exists and the request is NOT the refresh endpoint itself
    if (accessToken && !config.url?.endsWith('/auth/refresh')) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// 2. RESPONSE INTERCEPTOR: Handle 401 Unauthorized errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Check for 401 status and ensure it's NOT the refresh endpoint itself
        if (error.response?.status === 401 && !originalRequest?.url?.endsWith('/auth/refresh')) {

            if (isRefreshing) {
                // If a refresh is already in progress, queue the request
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                }).then(() => apiClient(originalRequest!));
            }

            isRefreshing = true;

            try {
                // Call the token refresh logic
                const newTokens = await refreshAccessToken();
                const newAccessToken = newTokens.accessToken;

                // Update the original request with new token
                originalRequest!.headers!.Authorization = `Bearer ${newAccessToken}`;

                // Resolve all queued requests
                failedRequestsQueue.forEach(({ resolve }) => resolve());
                failedRequestsQueue = [];

                return apiClient(originalRequest!);
            } catch (refreshError) {
                // If token refresh fails, trigger a full application logout
                console.error('Token refresh failed. Logging out.', refreshError);

                // Clear queued requests with a rejection so callers don't hang
                failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
                failedRequestsQueue = [];

                // Attempt local logout cleanup (clears tokens)
                try {
                    await logoutUser();
                } catch (e) {
                    console.warn('logoutUser failed during refresh failure handling', e);
                }

                // Notify app to redirect to login
                try {
                    triggerLogout();
                } catch (e) {
                    console.warn('triggerLogout failed', e);
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);