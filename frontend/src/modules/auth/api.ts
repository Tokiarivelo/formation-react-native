import axios, { AxiosError } from 'axios';
import { configs } from '../../configs/config';
import { AuthTokens, getRefreshToken, saveTokens } from './tokenStore';

// --- CONFIGURATION ---
const API_URL = configs.apiUrl;

interface UserCredentials {
    email: string;
    password: string;
}

// Response when logging in or registering
interface AuthResponse extends AuthTokens {
    user: {
        createdAt: String,
        email: string;
        firstName: String,
        id: number;
        isActive: boolean,
        lastName: String,
        role: String,
        updatedAt: String,
        username: String,
    };
}

/**
 * POST /auth/login - User login
 */
export const loginUser = async (credentials: UserCredentials): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data || { message: 'Login failed.' };
    }
};

/**
 * POST /auth/refresh - Refresh access token
 */
export const refreshAccessToken = async (): Promise<AuthTokens> => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
        throw new Error('No refresh token found. User must log in again.');
    }

    try {
        const response = await axios.post<AuthTokens>(`${API_URL}/auth/refresh`, {
            refreshToken
        });

        await saveTokens(response.data);
        console.log("Successfully refreshed access token : ", response.data);
        return response.data;
    } catch (error) {
        // If refresh fails, tokens are fully expired/invalid. 
        // The calling interceptor/hook should trigger a full logout.
        const axiosError = error as AxiosError;
        throw axiosError.response?.data || { message: 'Token refresh failed.' };
    }
};

/**
 * POST /auth/logout - Logout user
 * * NOTE: We clear local tokens regardless of server response for immediate UX signout.
 */
export const logoutUser = async (): Promise<void> => {
    try {
        const refreshToken = await getRefreshToken();
        // 2. Notify the server to invalidate the token (optional but recommended)
        if (refreshToken) {
            await axios.post(`${API_URL}/logout`, { refreshToken });
        }
    } catch (error) {
        console.warn('Server side logout failed or token already invalid, proceeding with local cleanup.', error);
    }
};