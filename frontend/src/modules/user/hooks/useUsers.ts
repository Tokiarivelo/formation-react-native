import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import { useAuthStore } from "../../../store/authStore";

export const useAuthUser = () => {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    return useQuery({
        queryFn: () => usersApi.getMe(),
        queryKey: ['auth-user'],
        enabled: !!isLoggedIn,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export const useUsers = () => {
    return useQuery({
        queryFn: () => usersApi.getAll(),
        queryKey: ['users']
    })
}

export const useUserById = (id: string) => {
    return useQuery({
        queryFn: () => usersApi.getById(id),
        queryKey: ['users', id],
        enabled: !!id
    })
}

export const useUpdateAuthUser = () => {
    const queryClient = useQueryClient();
    const setUserState = useAuthStore((state) => state.setUserState);
    return useMutation({
        mutationFn: usersApi.updateMe,
        onSuccess: (data) => {
            queryClient.setQueryData(['auth-user'], data);
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setUserState(data);
        },
        onError: (err: any) => {
            console.error('Update error raw:', err);
        }
    })
}

export const useUpdateUserById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersApi.updateById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (err: any) => {
            console.error('Update error raw:', err);
        }
    })
}

export const useDeleteUserById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersApi.deleteById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (err: any) => {
            console.error('Delete error raw:', err);
        }
    })
}
