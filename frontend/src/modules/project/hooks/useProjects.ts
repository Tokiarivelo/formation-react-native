import { useMutation, useQueryClient } from "@tanstack/react-query"
//import { projectsApi } from "../api"
import { ProjectParams } from "../../../types/api";
import { projectsApi_local } from "../localApi";
import { projectsApi } from "../api";
import { database } from "../../../database";

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (projectParams: ProjectParams) => {
            const project = await projectsApi_local.create(projectParams);

            //sync
            try {
                const remoteProject = await projectsApi.create(projectParams);
                await project.deleteAndCreate(remoteProject);
            }
            catch (error) {
                console.warn('Project sync failed to create, keeping local', error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    })
}

// COMMENTED SINCE WE ARE USING THE OBSERVABLE MODE AND DIRECTLY CALLING LOCAL API
// export const useProjects = () => {
//     return useQuery({
//         queryFn: async () => {
//             return await projectsApi_local.getAll();
//         },
//         queryKey: ['projects'],
//     })
// }

// export const useProjectById = (id: string) => {
//     return useQuery({
//         queryFn: async () => {
//             return await projectsApi_local.get(id);
//         },
//         queryKey: ['project', id],
//         enabled: !!id
//     })
// }

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, projectParams }: { id: string, projectParams: ProjectParams }) => {
            const project = await projectsApi_local.update({ id, projectParams });

            //sync 
            try {
                const remoteProject = await projectsApi.update({ id, projectParams });
                await database.write(async () => {
                    await project.update((p) => {
                        p.updatedAt = new Date(remoteProject.updatedAt);
                        p.isDirty = false;
                    });
                })
            }
            catch (error) {
                console.warn('Project sync failed to update, keeping local', error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (err: any) => {
            console.error('Update error raw:', err);
        }
    })
}

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await projectsApi_local.delete(id, false);

            try {
                await projectsApi.delete(id);
                await projectsApi_local.delete(id, true);
            }
            catch (error) {
                console.warn('Project sync failed to delete, keeping local marked as deleted', error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
        onError: (err: any) => {
            console.error('Delete error raw:', err);
        }
    })
}