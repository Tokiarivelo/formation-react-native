import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { projectsApi } from "../api"

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: projectsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}

export const useProjects = () => {
    return useQuery({
        queryFn: () => projectsApi.getAll(),
        queryKey: ['projects'],
    })
}

export const useProjectById = (id: string) => {
    return useQuery({
        queryFn: () => projectsApi.getById(id),
        queryKey: ['project', id],
        enabled: !!id
    })
}

export const useUpdateProjectById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.updateById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (err: any) => {
            console.error('Update error raw:', err);
        }
    })
}

export const useDeleteProjectById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.deleteById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (err: any) => {
            console.error('Delete error raw:', err);
        }
    })
}