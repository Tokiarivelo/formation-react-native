/**
 * Hooks React Query + WatermelonDB pour les projets
 * Intégration complète avec synchronisation offline/online
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../store';
import { syncManager } from '../../../sync/syncManager';
import { projectsApi, ProjectResponse, ProjectStatus, ProjectRequest } from '../api';

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
      const params: { status?: ProjectStatus; userId?: string } = {};
      if (filters?.status) params.status = filters.status as ProjectStatus;
      if (filters?.userId || user?.id) params.userId = filters?.userId || user!.id;
      return projectsApi.list(params);
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
      return projectsApi.getById(projectId);
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
    mutationFn: async (projectData: ProjectRequest) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return projectsApi.create(projectData);
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
      updates: Partial<ProjectRequest>;
    }) => {
      return projectsApi.update(projectId, updates);
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
      await projectsApi.remove(projectId);
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
      status: ProjectStatus;
    }) => {
      return projectsApi.update(projectId, { status });
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

      const projects: ProjectResponse[] = await projectsApi.list({ userId: user.id });
      const stats = {
        total: projects.length,
        active: projects.filter((p) => p.status === 'ACTIVE').length,
        completed: projects.filter((p) => p.status === 'COMPLETED').length,
        cancelled: projects.filter((p) => p.status === 'CANCELLED').length,
        onHold: projects.filter((p) => p.status === 'ON_HOLD').length,
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

