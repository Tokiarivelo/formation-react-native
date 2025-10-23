/**
 * Hooks React Query + WatermelonDB pour les tâches
 * Intégration complète avec synchronisation offline/online
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { database, Task } from '../../../database';
import { useAuth } from '../../../store';
import { createTaskWithOutbox, updateTaskWithOutbox, deleteTaskWithOutbox } from '../../../sync/outbox';
import { syncManager } from '../../../sync/syncManager';

// Clés de requête
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: any) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  byProject: (projectId: string) => [...taskKeys.all, 'byProject', projectId] as const,
};

/**
 * Hook pour obtenir toutes les tâches
 */
export const useTasks = (filters?: { 
  projectId?: string; 
  status?: string; 
  priority?: string; 
  userId?: string;
}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      let query = database.collections.get<Task>('tasks').query();

      // Filtrer par utilisateur si pas spécifié
      if (filters?.userId || user?.id) {
        query = query.where('user_id', filters?.userId || user!.id);
      }

      // Filtrer par projet
      if (filters?.projectId) {
        query = query.where('project_id', filters.projectId);
      }

      // Filtrer par statut
      if (filters?.status) {
        query = query.where('status', filters.status);
      }

      // Filtrer par priorité
      if (filters?.priority) {
        query = query.where('priority', filters.priority);
      }

      return query.fetch();
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour obtenir les tâches d'un projet
 */
export const useTasksByProject = (projectId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: taskKeys.byProject(projectId),
    queryFn: async () => {
      let query = database.collections.get<Task>('tasks').query();

      if (user?.id) {
        query = query.where('user_id', user.id);
      }

      query = query.where('project_id', projectId);

      return query.fetch();
    },
    enabled: !!user && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour obtenir une tâche spécifique
 */
export const useTask = (taskId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: async () => {
      const task = await database.collections.get<Task>('tasks').find(taskId);
      return task;
    },
    enabled: !!user && !!taskId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour créer une tâche
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (taskData: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: Date;
      projectId: string;
    }) => {
      if (!user) throw new Error('Utilisateur non connecté');

      const data = {
        ...taskData,
        userId: user.id,
      };

      // Créer avec outbox pour la synchronisation
      const task = await createTaskWithOutbox(data);
      return task;
    },
    onSuccess: (_, variables) => {
      // Invalider les requêtes de tâches
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.byProject(variables.projectId) });
    },
  });
};

/**
 * Hook pour mettre à jour une tâche
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: {
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: Date;
      };
    }) => {
      const task = await database.collections.get<Task>('tasks').find(taskId);
      
      // Mettre à jour localement avec outbox
      await updateTaskWithOutbox(taskId, updates);
      
      return task;
    },
    onSuccess: (_, { taskId }) => {
      // Invalider les requêtes de cette tâche et la liste
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Hook pour supprimer une tâche
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const task = await database.collections.get<Task>('tasks').find(taskId);
      
      // Supprimer avec outbox
      await deleteTaskWithOutbox(taskId);
      
      return task;
    },
    onSuccess: () => {
      // Invalider toutes les requêtes de tâches
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
};

/**
 * Hook pour basculer le statut d'une tâche
 */
export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const task = await database.collections.get<Task>('tasks').find(taskId);
      
      // Basculer le statut avec outbox
      await updateTaskWithOutbox(taskId, {});
      
      return task;
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Hook pour marquer une tâche comme terminée
 */
export const useMarkTaskAsDone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const task = await database.collections.get<Task>('tasks').find(taskId);
      
      // Marquer comme terminée avec outbox
      await updateTaskWithOutbox(taskId, { status: 'DONE' });
      
      return task;
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Hook pour changer la priorité d'une tâche
 */
export const useChangeTaskPriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      priority,
    }: {
      taskId: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    }) => {
      const task = await database.collections.get<Task>('tasks').find(taskId);
      
      // Changer la priorité avec outbox
      await updateTaskWithOutbox(taskId, { priority });
      
      return task;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Hook pour définir une échéance
 */
export const useSetTaskDueDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      dueDate,
    }: {
      taskId: string;
      dueDate: Date;
    }) => {
      const task = await database.collections.get<Task>('tasks').find(taskId);
      
      // Définir l'échéance avec outbox
      await updateTaskWithOutbox(taskId, { dueDate });
      
      return task;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Hook pour obtenir les statistiques des tâches
 */
export const useTaskStats = (projectId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...taskKeys.all, 'stats', projectId],
    queryFn: async () => {
      if (!user) return null;

      let query = database.collections.get<Task>('tasks').query().where('user_id', user.id);

      if (projectId) {
        query = query.where('project_id', projectId);
      }

      const tasks = await query.fetch();

      const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.isTodo).length,
        inProgress: tasks.filter(t => t.isInProgress).length,
        done: tasks.filter(t => t.isDone).length,
        cancelled: tasks.filter(t => t.isCancelled).length,
        overdue: tasks.filter(t => t.isOverdue).length,
        dueSoon: tasks.filter(t => t.isDueSoon).length,
      };

      return stats;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour obtenir les tâches en retard
 */
export const useOverdueTasks = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...taskKeys.all, 'overdue'],
    queryFn: async () => {
      if (!user) return [];

      const tasks = await database.collections
        .get<Task>('tasks')
        .query()
        .where('user_id', user.id)
        .where('status', 'TODO')
        .fetch();

      return tasks.filter(task => task.isOverdue);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook pour obtenir les tâches dues bientôt
 */
export const useDueSoonTasks = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...taskKeys.all, 'dueSoon'],
    queryFn: async () => {
      if (!user) return [];

      const tasks = await database.collections
        .get<Task>('tasks')
        .query()
        .where('user_id', user.id)
        .where('status', 'TODO')
        .fetch();

      return tasks.filter(task => task.isDueSoon);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

