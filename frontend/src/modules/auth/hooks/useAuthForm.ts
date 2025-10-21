import { useState, useCallback } from 'react';
import { useLogin, useRegister } from './useAuth';

export const useAuthForm = (signUp: boolean) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        firstName: "",
        lastName: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const {
        mutate: login,
        error: loginError,
        isPending: loginLoading,
        isError: loginIsError
    } = useLogin();

    const {
        mutate: register,
        error: registerError,
        isPending: registerLoading,
        isError: registerIsError
    } = useRegister();

    const updateField = useCallback((field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const toggleShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleSubmit = useCallback(() => {
        if (signUp) {
            register(formData);
        } else {
            const { email, password } = formData;
            login({ email, password });
        }
    }, [signUp, formData, login, register]);

    const isLoading = loginLoading || registerLoading;
    const error = signUp ? registerError : loginError;
    const isError = signUp ? registerIsError : loginIsError;

    return {
        formData,
        updateField,
        showPassword,
        toggleShowPassword,
        handleSubmit,
        isLoading,
        error,
        isError,
    };
};