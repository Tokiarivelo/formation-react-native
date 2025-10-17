import { create } from "zustand";
import { clearTokens, getAccessToken, getRefreshToken } from "../modules/auth/tokenStore";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../modules/auth/api";

interface User {
    id: number;
    email: string;
    username: String,
    firstName: String,
    lastName: String,
    isActive: boolean,
    role: String,
    createdAt: String,
    updatedAt: String,
}

type AuthState = {
    userState: User | null
    isLoggedIn: boolean,
    isLoading: boolean,
    authLogin: (data: User) => void,
    authLogout: () => void,
    checkAuthStatus: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    //state
    isLoggedIn: false,
    isLoading: true,
    userState: null,

    //actions
    authLogin: (data: User) => {
        set({ userState: data })
    },

    authLogout: () => {
        set({ isLoggedIn: false, userState: null })
    },


    checkAuthStatus: async () => {
        try {
            set({ isLoading: true });
            const accessToken = await getAccessToken();

            // Check if access token is valid
            if (accessToken) {
                const payload = jwtDecode<{ exp?: number }>(accessToken);
                if (payload.exp && payload.exp > Math.floor(Date.now() / 1000) + 30) {
                    set({ isLoggedIn: true, isLoading: false });
                    return; // Token is valid, we're done
                }
            }

            // If not, try to refresh
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                const data = await refreshAccessToken();
                //update user state
                set({ userState: data.user })
                set({ isLoggedIn: true, isLoading: false });
                return; // Refresh successful
            }

            // If all else fails, we are logged out
            set({ isLoggedIn: false, isLoading: false });
        } catch {
            // Any error in the process means we are logged out
            await clearTokens();
            set({ isLoggedIn: false, isLoading: false });
        }
    },
}))