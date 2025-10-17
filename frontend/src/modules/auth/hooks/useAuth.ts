import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser, logoutUser } from "../api";
import { Alert } from "react-native";
import { clearTokens, saveTokens } from "../tokenStore";
import { clearOnLogout, setOnLogout } from "../../../services/navigationService";
import { useAuthStore } from "../../../store/authStore";
import { useEffect } from "react";


export const useAuth = () => {
    const authLogin = useAuthStore((state) => state.authLogin);
    const authLogout = useAuthStore((state) => state.authLogout);
    const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            console.log(data);
            await saveTokens(data);
            checkAuthStatus();
            authLogin(data.user);
        },
        onError: (err: any) => {
            console.error('Login error raw:', err);
        },
    })

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
        },
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
            Alert.alert('Logout failed', 'Please try again.');
        },
    })

    //setOnLogOut that is called when a logout is triggered
    useEffect(() => {
        setOnLogout(() => logoutMutation.mutateAsync);
        return () => clearOnLogout();
    }, [logoutMutation]);

    return {
        login: loginMutation,
        logout: logoutMutation
    }
}