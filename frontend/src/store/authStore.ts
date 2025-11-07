import { create } from "zustand";
import { clearTokens, getAccessToken } from "../modules/auth/tokenStore";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../modules/auth/api";
import { User } from "../types/api";
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Keychain from 'react-native-keychain';
import { Auth } from "../constants";

type AuthState = {
    userState: User | null
    isLoggedIn: boolean,
    isLoading: boolean,
    lastUserState: { id: string, firstName: string, lastName: string, biometricEnabled: boolean } | null,
    biometricEnabled: boolean,

    authLogin: (data: User) => void,
    authLogout: () => void,
    setUserState: (data: User) => void,
    setLastUserState: (data: { id: string, firstName: string, lastName: string, biometricEnabled: boolean } | null) => void,
    setBiometricEnabled: (enabled: boolean) => void,
    checkAuthStatus: () => Promise<void>,
    setIsLoading: (isLoading: boolean) => void,
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            //state
            isLoggedIn: false,
            isLoading: false,
            userState: null,
            lastUserState: null,
            biometricEnabled: false,

            //actions
            authLogin: (data: User) => {
                set({ userState: data, isLoggedIn: true, isLoading: false, lastUserState: null });
            },

            authLogout: () => {
                const { id, firstName, lastName } = useAuthStore.getState().userState!;
                const biometricEnabled = useAuthStore.getState().biometricEnabled;
                set({ lastUserState: { id, firstName, lastName, biometricEnabled } });
                set({ isLoggedIn: false, userState: null, isLoading: false });
            },

            setUserState: (data: User) => {
                set({ userState: data });
            },

            setLastUserState: (data: { id: string, firstName: string, lastName: string, biometricEnabled: boolean } | null) => {
                set({ lastUserState: data });
            },

            setBiometricEnabled: (enabled: boolean) => {
                set({ biometricEnabled: enabled });
            },

            setIsLoading(isLoading: boolean) {
                set({ isLoading: isLoading })
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
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                userState: state.userState,
                biometricEnabled: state.biometricEnabled,
                lastUserState: state.lastUserState,
            }),
        }
    )
)

export const saveCredentials = async ({ username, password }: { username: string, password: string }) => {
    try {
        await Keychain.setGenericPassword(
            username,
            password,
            { service: Auth.KEYCHAIN_SERVICE_CREDENTIALS }
        );

        console.log('Credentials saved successfully to SecureStore.');
    } catch (e) {
        console.error('Error saving credentials to SecureStore:', e);
    }
}

export const getCredentials = async (): Promise<{ username: string; password: string } | null> => {
    try {
        const credentials = await Keychain.getGenericPassword({
            service: Auth.KEYCHAIN_SERVICE_CREDENTIALS
        });

        if (credentials) {
            return {
                username: credentials.username,
                password: credentials.password
            };
        }
        return null;

    } catch (e) {
        console.error('Error retrieving credentials from SecureStore:', e);
        return null;
    }
}

export const clearCredentials = async (): Promise<void> => {
    try {
        await Keychain.resetGenericPassword({
            service: Auth.KEYCHAIN_SERVICE_CREDENTIALS
        });
        console.log('Credentials cleared successfully from SecureStore.');
    } catch (e) {
        console.error('Error clearing credentials from SecureStore:', e);
    }
}