/**
 * Hooks React Query + WatermelonDB pour les projets
 * Intégration complète avec synchronisation offline/online
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { database, Project } from '../../../database';
import { useAuth } from '../../../store';
import { createProjectWithOutbox, updateTaskWithOutbox } from '../../../sync/outbox';
import { syncManager } from '../../../sync/syncManager';

// Clés de requête
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: any) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

/**
 * Hook pour obtenir tous les projets
 */
export const useProjects = (filters?: { status?: string; userId?: string }) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: async () => {
      let query = database.collections.get<Project>('projects').query();

      // Filtrer par utilisateur si pas spécifié
      if (filters?.userId || user?.id) {
        query = query.where('user_id', filters?.userId || user!.id);
      }

      // Filtrer par statut
      if (filters?.status) {
        query = query.where('status', filters.status);
      }

      return query.fetch();
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour obtenir un projet spécifique
 */
export const useProject = (projectId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: async () => {
      const project = await database.collections.get<Project>('projects').find(projectId);
      return project;
    },
    enabled: !!user && !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour créer un projet
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (projectData: {
      name: string;
      description?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
    }) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const data = {
        ...projectData,
        userId: user.id,
      };

      // Créer avec outbox pour la synchronisation
      const project = await createProjectWithOutbox(data);
      return project;
    },
    onSuccess: () => {
      // Invalider les requêtes de projets
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};

/**
 * Hook pour mettre à jour un projet
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      updates,
    }: {
      projectId: string;
      updates: {
        name?: string;
        description?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
      };
    }) => {
      const project = await database.collections.get<Project>('projects').find(projectId);
      
      // Mettre à jour localement avec outbox
      await updateTaskWithOutbox(projectId, updates);
      
      return project;
    },
    onSuccess: (_, { projectId }) => {
      // Invalider les requêtes de ce projet et la liste
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

/**
 * Hook pour supprimer un projet
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const project = await database.collections.get<Project>('projects').find(projectId);
      
      // Supprimer avec outbox
      await updateTaskWithOutbox(projectId, {});
      
      return project;
    },
    onSuccess: () => {
      // Invalider toutes les requêtes de projets
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};

/**
 * Hook pour changer le statut d'un projet
 */
export const useChangeProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      status,
    }: {
      projectId: string;
      status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
    }) => {
      const project = await database.collections.get<Project>('projects').find(projectId);
      
      // Mettre à jour avec outbox
      await updateTaskWithOutbox(projectId, { status });
      
      return project;
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

/**
 * Hook pour obtenir les statistiques des projets
 */
export const useProjectStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...projectKeys.all, 'stats'],
    queryFn: async () => {
      if (!user) return null;

      const projects = await database.collections
        .get<Project>('projects')
        .query()
        .where('user_id', user.id)
        .fetch();

      const stats = {
        total: projects.length,
        active: projects.filter(p => p.isActive).length,
        completed: projects.filter(p => p.isCompleted).length,
        cancelled: projects.filter(p => p.isCancelled).length,
        onHold: projects.filter(p => p.isOnHold).length,
      };

      return stats;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour la synchronisation des projets
 */
export const useSyncProjects = () => {
  return useMutation({
    mutationFn: async () => {
      return syncManager.forceSync();
    },
  });
};

/**
 * Hook pour obtenir le statut de synchronisation
 */
export const useSyncStatus = () => {
  return useQuery({
    queryKey: ['sync', 'status'],
    queryFn: () => syncManager.getSyncStatus(),
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
  });
};

