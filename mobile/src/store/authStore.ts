/**
 * Store Zustand pour l'état d'authentification
 * Gestion légère et performante de l'état auth
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureTokenStorage } from '../libs/storage/secureStore';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  // État
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setTokens: async (tokens: AuthTokens) => {
        try {
          await secureTokenStorage.saveTokens({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });
        } catch (error) {
          console.error('Erreur lors de la sauvegarde des tokens:', error);
          set({ error: 'Erreur lors de la sauvegarde des tokens' });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      login: async (user: User, tokens: AuthTokens) => {
        try {
          set({ isLoading: true, error: null });

          // Sauvegarde sécurisée des tokens
          await secureTokenStorage.saveTokens({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });

          // Mise à jour de l'état
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          set({
            isLoading: false,
            error: 'Erreur lors de la connexion',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });

          // Suppression des tokens sécurisés
          await secureTokenStorage.clearTokens();

          // Reset de l'état
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
          set({ error: 'Erreur lors de la déconnexion' });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      refreshUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...userData },
          });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Ne persiste que les données non sensibles
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Hydratation personnalisée pour charger les tokens sécurisés
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Vérifier si les tokens existent dans le stockage sécurisé
          secureTokenStorage.hasTokens().then((hasTokens) => {
            if (!hasTokens && state.isAuthenticated) {
              // Si pas de tokens mais état authentifié, déconnecter
              state.logout();
            }
          });
        }
      },
    }
  )
);

// Hook personnalisé pour l'authentification
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    ...store,
    // Helpers utiles
    isLoggedIn: store.isAuthenticated && !!store.user,
    hasError: !!store.error,
    canRetry: !!store.error && !store.isLoading,
  };
};

export default useAuthStore;

