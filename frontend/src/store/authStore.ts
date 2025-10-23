import { create } from "zustand";
import { clearTokens, getAccessToken } from "../modules/auth/tokenStore";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../modules/auth/api";
import { User } from "../types/api";
import { usersApi } from "../modules/user/api";

type AuthState = {
    userState: User | null
    isLoggedIn: boolean,
    isLoading: boolean,

    authLogin: (data: User) => void,
    authLogout: () => void,
    setUserState: (data: User) => void
    checkAuthStatus: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    //state
    isLoggedIn: false,
    isLoading: true,
    userState: null,

    //actions
    authLogin: (data: User) => {
        set({ userState: data, isLoggedIn: true, isLoading: false });
    },

    authLogout: () => {
        set({ isLoggedIn: false, userState: null, isLoading: false });
    },

    setUserState: (data: User) => {
        set({ userState: data });
    },

    checkAuthStatus: async () => {
        try {
            set({ isLoading: true });
            const accessToken = await getAccessToken();
            // Check if access token is valid
            if (accessToken) {
                const payload = jwtDecode<{ exp?: number }>(accessToken);
                if (payload.exp && payload.exp > Math.floor(Date.now() / 1000) + 30) {
                    const user = await usersApi.getMe();
                    set({ isLoggedIn: true, isLoading: false, userState: user });
                    return; // Token is valid, we're done
                }
            }
            // If not, try to refresh
            const data = await refreshAccessToken();
            //update user state
            set({ userState: data.user, isLoggedIn: true, isLoading: false });
            return; // Refresh successful

        } catch {
            // Any error in the process means we are logged out
            await clearTokens();
            set({ isLoggedIn: false, isLoading: false });
        }
    },
}))