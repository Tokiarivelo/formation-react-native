import { useMutation, useQuery } from '@tanstack/react-query';
import { BiometricAuthService } from '../../../services/biometricAuth';
import { useAuthStore } from '../../../store/authStore';
import { triggerLogout } from '../../../services/navigationService';
import { loginUser } from '../api';
import { saveTokens } from '../tokenStore';
import { AuthResponse } from '../../../types/api';

export const useBiometricAvailability = () => {
    return useQuery({
        queryKey: ['biometric-availability'],
        queryFn: () => BiometricAuthService.isAvailable(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useEnableBiometric = () => {
    const userState = useAuthStore((s) => s.userState);
    const setBiometricEnabled = useAuthStore((s) => s.setBiometricEnabled);

    return useMutation({
        mutationFn: async () => {
            if (!userState) throw new Error('User not authenticated');
            return await BiometricAuthService.enableBiometric(userState.id);
        },
        onSuccess: (success) => {
            if (success) {
                setBiometricEnabled(true);
                console.log("biometric Auth enabled");
            }
        },
        onError: (error) => {
            console.error('Enable biometric failed:', error);
        },
    });
};

export const useBiometricLogin = () => {
    const setIsLoading = useAuthStore((s) => s.setIsLoading);
    const authLogin = useAuthStore((state) => state.authLogin);
    return useMutation({
        mutationFn: async (userId: string): Promise<AuthResponse> => {
            setIsLoading(true);
            // Authentification biométrique
            const authResult = await BiometricAuthService.authenticate(userId);
            if (!authResult.success) {
                throw new Error(authResult.error || 'Biometric auth failed');
            }

            const { username, password } = authResult.credentials!;
            setIsLoading(false);
            return loginUser({ email: username, password })

        },
        onSuccess: async (data) => {
            await saveTokens(data);
            authLogin(data.user);
        },
        onError: (error) => {
            console.error('Biometric login failed:', error);
            triggerLogout();
            setIsLoading(false);
        },
    });
};

export const useDisableBiometric = () => {
    const userState = useAuthStore((s) => s.userState);
    const setBiometricEnabled = useAuthStore((s) => s.setBiometricEnabled);

    return useMutation({
        mutationFn: async () => {
            if (!userState) throw new Error('User not authenticated');
            await BiometricAuthService.disableBiometric(userState.id);
        },
        onSuccess: () => {
            setBiometricEnabled(false);
            console.log("biometric auth disabled");
        },
    });
};