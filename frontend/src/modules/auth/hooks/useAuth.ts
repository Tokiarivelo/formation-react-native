import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser, logoutUser, registerUser } from "../api";
import { clearTokens, saveTokens } from "../tokenStore";
import { clearCredentials, saveCredentials, useAuthStore } from "../../../store/authStore";
import { upsertAuthUser } from "../../../services/syncService";

export const useLogin = () => {
    const authLogin = useAuthStore((state) => state.authLogin);
    const setBiometricEnabled = useAuthStore((state) => state.setBiometricEnabled);
    return useMutation({
        mutationFn: loginUser,
        onSuccess: async (data, variables) => {
            await saveTokens(data);
            await saveCredentials({ username: variables.email, password: variables.password });
            await upsertAuthUser();
            setBiometricEnabled(false);
            authLogin(data.user);
        },
        onError: (err: any) => {
            console.error('Login error raw:', err);
        },
    });
}

export const useLogout = () => {
    const authLogout = useAuthStore((state) => state.authLogout);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,
        onMutate: async () => {
            // cancel outgoing queries so they don't update after we clear state
            await queryClient.cancelQueries();
            await clearTokens();
            await clearCredentials();
            authLogout();
        },
        onSettled: () => {
            // a safe final step: ensure queries are removed and client state is reset
            queryClient.removeQueries();
        },
        onError: async (err: any) => {
            console.error('Logout failed', err);
        },
    })
}

export const useRegister = () => {
    const authLogin = useAuthStore((state) => state.authLogin);
    const setBiometricEnabled = useAuthStore((state) => state.setBiometricEnabled);
    return useMutation({
        mutationFn: registerUser,
        onSuccess: async (data, variables) => {
            await saveTokens(data);
            await saveCredentials({ username: variables.email, password: variables.password });
            await upsertAuthUser();
            authLogin(data.user);
            setBiometricEnabled(false);
        },
        onError: (err: any) => {
            console.error('Login error raw:', err);
        },
    });
}