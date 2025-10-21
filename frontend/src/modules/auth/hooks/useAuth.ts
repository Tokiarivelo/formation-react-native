import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser, logoutUser, registerUser } from "../api";
import { clearTokens, saveTokens } from "../tokenStore";
import { useAuthStore } from "../../../store/authStore";

export const useLogin = () => {
    const authLogin = useAuthStore((state) => state.authLogin);
    return useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            await saveTokens(data);
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
    return useMutation({
        mutationFn: registerUser,
        onSuccess: async (data) => {
            await saveTokens(data);
            authLogin(data.user);
        },
        onError: (err: any) => {
            console.error('Login error raw:', err);
        },
    });
}