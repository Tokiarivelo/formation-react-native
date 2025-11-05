import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TaskParams } from "../../../types/api";
import { tasksApi_local } from "../localApi";
import { tasksApi } from "../api";
import { database } from "../../../database";

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (taskParams: TaskParams) => {
            const task = await tasksApi_local.create(taskParams);

            //sync 
            try {
                const remoteTask = await tasksApi.create(taskParams);
                await task.deleteAndCreate(remoteTask);
            }
            catch (error) {
                console.warn('Task sync failed to created, keeping local', error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    })
}


// COMMENTED SINCE WE ARE USING THE OBSERVABLE MODE AND DIRECTLY CALLING LOCAL API
// export const useTasks = () => {
//     return useQuery({
//         queryFn: async () => {
//             return await tasksApi_local.getAll();
//             //tasksApi.getAll()
//         },
//         queryKey: ['tasks'],
//     })
// }

// export const useTaskById = (id: string) => {
//     return useQuery({
//         queryFn: async () => {
//             return await tasksApi_local.get(id);
//             //tasksApi.get(id)
//         },
//         queryKey: ['task', id],
//         enabled: !!id
//     })
// }

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, taskParams }: { id: string, taskParams: TaskParams }) => {
            const task = await tasksApi_local.update({ id, taskParams });

            //sync
            try {
                const remoteTask = await tasksApi.update({ id, taskParams });
                await database.write(async () => {
                    await task.update((t) => {
                        t.updatedAt = new Date(remoteTask.updatedAt);
                        t.isDirty = false;
                        t._raw._status = "synced";
                    })
                })
            }
            catch (error) {
                console.warn('Task sync failed to update, keeping local', error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (err: any) => {
            console.error('Update error raw:', err);
        }
    })
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await tasksApi_local.delete(id, false);

            try {
                await tasksApi.delete(id);
                await tasksApi_local.delete(id, true);
            }
            catch (error) {
                console.warn('Project sync failed to delete, keeping local', error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (err: any) => {
            console.error('Delete error raw:', err);
        }
    })
}