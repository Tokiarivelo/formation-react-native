import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../api";
import { Alert } from "react-native";

export const useLogin = () => {
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log(data);
            Alert.alert('Login Successful', `Welcome! Token: ${data.accessToken.substring(0, 10)}...`);
        },
        onError: (err: any) => {
            console.error('Login error raw:', err);
        },
    });
    return loginMutation
}