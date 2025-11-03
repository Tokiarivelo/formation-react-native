/**
 * Hooks React Query + WatermelonDB pour les tâches
 * Intégration complète avec synchronisation offline/online
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../store';
import { TaskPriority, TaskRequest, TaskResponse, tasksApi, TaskStatus } from '../api';

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
      const params: { projectId?: string; status?: TaskStatus; priority?: TaskPriority; userId?: string } = {};
      if (filters?.projectId) params.projectId = filters.projectId;
      if (filters?.status) params.status = filters.status as TaskStatus;
      if (filters?.priority) params.priority = filters.priority as TaskPriority;
      if (filters?.userId || user?.id) params.userId = filters?.userId || user!.id;
      return tasksApi.list(params);
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
      return tasksApi.list({ projectId, userId: user?.id });
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
      return tasksApi.getById(taskId);
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
    mutationFn: async (taskData: TaskRequest) => {
      if (!user) throw new Error('Utilisateur non connecté');
      return tasksApi.create(taskData);
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
      updates: Partial<TaskRequest>;
    }) => {
      return tasksApi.update(taskId, updates);
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
      await tasksApi.remove(taskId);
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
      const task = await tasksApi.getById(taskId);
      const next = task.status === 'DONE' ? 'TODO' : 'DONE';
      return tasksApi.update(taskId, { status: next });
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
      return tasksApi.update(taskId, { status: 'DONE' });
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
      priority: TaskPriority;
    }) => {
      return tasksApi.update(taskId, { priority });
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
      dueDate: string;
    }) => {
      return tasksApi.update(taskId, { dueDate });
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
      const tasks: TaskResponse[] = await tasksApi.list({ userId: user.id, projectId });
      const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'TODO').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        done: tasks.filter(t => t.status === 'DONE').length,
        cancelled: tasks.filter(t => t.status === 'CANCELLED').length,
        overdue: tasks.filter(t => t.dueDate ? new Date(t.dueDate) < new Date() && t.status !== 'DONE' : false).length,
        dueSoon: tasks.filter(t => t.dueDate ? (new Date(t.dueDate).getTime() - Date.now()) / (1000*60*60*24) <= 3 : false).length,
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

