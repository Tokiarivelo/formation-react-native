/**
 * Index du store
 * Export centralisé des stores et configurations
 */

export { useAuthStore, useAuth } from './authStore';
export { queryClient, clearQueryCache, invalidateAllQueries, prefetchQuery, setQueryData, getQueryData } from './queryClient';

// Re-export des types utiles
export type { User, AuthTokens } from './authStore';
export type { LoginRequest, SignupRequest, AuthResponse } from '../modules/auth/api';

