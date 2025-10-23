/**
 * Hooks React Query pour l'authentification
 * Intégration avec Zustand store et gestion des états
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginRequest, SignupRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../api';
import { useAuthStore } from '../../../store/authStore';
import { secureTokenStorage } from '../../../libs/storage/secureStore';

// Clés de requête
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  verify: () => [...authKeys.all, 'verify'] as const,
};

/**
 * Hook pour la connexion
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login: loginStore, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await authApi.login(credentials);
        return response;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async (data) => {
      try {
        // Sauvegarder dans le store Zustand
        await loginStore(data.user, {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        // Invalider les requêtes liées à l'auth
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        
        console.log('✅ Connexion réussie');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des données de connexion:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('❌ Erreur de connexion:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
      setError(errorMessage);
    },
  });
};

/**
 * Hook pour l'inscription
 */
export const useSignup = () => {
  const queryClient = useQueryClient();
  const { login: loginStore, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (userData: SignupRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await authApi.signup(userData);
        return response;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async (data) => {
      try {
        // Sauvegarder dans le store Zustand
        await loginStore(data.user, {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        // Invalider les requêtes liées à l'auth
        queryClient.invalidateQueries({ queryKey: authKeys.all });
        
        console.log('✅ Inscription réussie');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des données d\'inscription:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('❌ Erreur d\'inscription:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
    },
  });
};

/**
 * Hook pour la déconnexion
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout: logoutStore, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Appel API pour invalider le token côté serveur
        await authApi.logout();
      } catch (error) {
        // Même si l'API échoue, on continue la déconnexion locale
        console.warn('Erreur lors de la déconnexion API, déconnexion locale:', error);
      }
    },
    onSuccess: async () => {
      try {
        // Déconnexion locale
        await logoutStore();

        // Nettoyer le cache React Query
        queryClient.clear();
        
        console.log('✅ Déconnexion réussie');
      } catch (error) {
        console.error('Erreur lors de la déconnexion locale:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('❌ Erreur de déconnexion:', error);
      setError('Erreur lors de la déconnexion');
    },
  });
};

/**
 * Hook pour mot de passe oublié
 */
export const useForgotPassword = () => {
  const { setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (email: ForgotPasswordRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await authApi.forgotPassword(email);
        return response;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      console.log('✅ Email de réinitialisation envoyé');
    },
    onError: (error: any) => {
      console.error('❌ Erreur mot de passe oublié:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email';
      setError(errorMessage);
    },
  });
};

/**
 * Hook pour réinitialiser le mot de passe
 */
export const useResetPassword = () => {
  const { setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (resetData: ResetPasswordRequest) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await authApi.resetPassword(resetData);
        return response;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la réinitialisation';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      console.log('✅ Mot de passe réinitialisé');
    },
    onError: (error: any) => {
      console.error('❌ Erreur réinitialisation mot de passe:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la réinitialisation';
      setError(errorMessage);
    },
  });
};

/**
 * Hook pour obtenir le profil utilisateur
 */
export const useProfile = () => {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authApi.getProfile,
    enabled: isAuthenticated && !user, // Seulement si pas déjà en cache
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Ne pas retry sur 401 (non authentifié)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook pour vérifier la validité du token
 */
export const useVerifyToken = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.verify(),
    queryFn: authApi.verifyToken,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // Pas de retry pour la vérification
  });
};

/**
 * Hook pour mettre à jour le profil
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { refreshUser, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (updates: Partial<any>) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await authApi.updateProfile(updates);
        return response;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      // Mettre à jour le store Zustand
      refreshUser(data);
      
      // Invalider le cache du profil
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      
      console.log('✅ Profil mis à jour');
    },
    onError: (error: any) => {
      console.error('❌ Erreur mise à jour profil:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour';
      setError(errorMessage);
    },
  });
};

/**
 * Hook pour changer le mot de passe
 */
export const useChangePassword = () => {
  const { setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await authApi.changePassword(currentPassword, newPassword);
        return response;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      console.log('✅ Mot de passe changé');
    },
    onError: (error: any) => {
      console.error('❌ Erreur changement mot de passe:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
    },
  });
};

/**
 * Hook pour supprimer le compte
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { logout: logoutStore, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await authApi.deleteAccount();
        return response;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression du compte';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: async () => {
      try {
        // Déconnexion après suppression
        await logoutStore();

        // Nettoyer le cache React Query
        queryClient.clear();
        
        console.log('✅ Compte supprimé');
      } catch (error) {
        console.error('Erreur lors de la déconnexion après suppression:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('❌ Erreur suppression compte:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression du compte';
      setError(errorMessage);
    },
  });
};

