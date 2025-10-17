import { create } from "zustand";
import { clearTokens, getAccessToken, getRefreshToken } from "../modules/auth/tokenStore";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../modules/auth/api";

type AuthState = {
    isLoggedIn: boolean,
    isLoading: boolean,
    authLogout: () => void
    checkAuthStatus: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    //state
    isLoggedIn: false,
    isLoading: true,

    //actions
    authLogout: () => {
        set({ isLoggedIn: false })
    },
    // 3. Async logic from your useEffect, now as an action
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
                await refreshAccessToken();
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