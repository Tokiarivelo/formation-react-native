/**
 * Configuration React Query
 * Client Query avec cache et gestion d'erreurs
 */

import { QueryClient } from '@tanstack/react-query';
import { env } from '../config/env';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps de cache par défaut
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
      
      // Retry par défaut
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs 4xx (sauf 408, 429)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          if (error?.response?.status === 408 || error?.response?.status === 429) {
            return failureCount < 2;
          }
          return false;
        }
        
        // Retry jusqu'à 3 fois pour les autres erreurs
        return failureCount < 3;
      },
      
      // Intervalle de retry avec backoff exponentiel
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch automatique
      refetchOnWindowFocus: false, // Pas de refetch sur focus (mobile)
      refetchOnReconnect: true, // Refetch quand la connexion revient
      refetchOnMount: true, // Refetch au montage du composant
      
      // Gestion des erreurs
      throwOnError: false, // Ne pas throw automatiquement les erreurs
    },
    mutations: {
      // Retry pour les mutations
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        
        // Retry une seule fois pour les mutations
        return failureCount < 1;
      },
      
      // Gestion des erreurs pour les mutations
      throwOnError: false,
    },
  },
});

// Fonction pour nettoyer le cache
export const clearQueryCache = () => {
  queryClient.clear();
};

// Fonction pour invalider toutes les requêtes
export const invalidateAllQueries = () => {
  queryClient.invalidateQueries();
};

// Fonction pour précharger des données
export const prefetchQuery = async <T>(
  queryKey: any[],
  queryFn: () => Promise<T>,
  options?: any
) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    ...options,
  });
};

// Fonction pour mettre à jour le cache de manière optimiste
export const setQueryData = <T>(queryKey: any[], data: T) => {
  queryClient.setQueryData(queryKey, data);
};

// Fonction pour obtenir les données du cache
export const getQueryData = <T>(queryKey: any[]): T | undefined => {
  return queryClient.getQueryData(queryKey);
};

// Configuration pour le mode debug
if (env.DEBUG_MODE) {
  // Logger les requêtes en mode debug
  queryClient.setQueryDefaults(['debug'], {
    onSuccess: (data, query) => {
      console.log(`🔍 Query Success: ${query.queryKey.join(' -> ')}`, data);
    },
    onError: (error, query) => {
      console.log(`❌ Query Error: ${query.queryKey.join(' -> ')}`, error);
    },
  });
}

export default queryClient;

