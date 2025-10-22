import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { tasksApi } from "../api"

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tasksApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    })
}

export const useTasks = () => {
    return useQuery({
        queryFn: () => tasksApi.getAll(),
        queryKey: ['tasks'],
    })
}

export const useTaskById = (id: string) => {
    return useQuery({
        queryFn: () => tasksApi.getById(id),
        queryKey: ['task', id],
        enabled: !!id
    })
}

export const useUpdateTaskById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tasksApi.updateById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (err: any) => {
            console.error('Update error raw:', err);
        }
    })
}

export const useDeleteTaskById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tasksApi.deleteById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (err: any) => {
            console.error('Delete error raw:', err);
        }
    })
}