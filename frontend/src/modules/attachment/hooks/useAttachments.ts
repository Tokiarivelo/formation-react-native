import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attachmentsApi } from "../api";

export const useCreateAttachment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: attachmentsApi.upload,
        onSuccess: () => {
            console.log('Attachment uploaded successfully');
            queryClient.invalidateQueries({ queryKey: ['attachments'] });
        },
        onError: (error) => {
            console.error('Error uploading attachment:', error);
        }
    });
}

export const useAttachments = (projectId: string, taskId: string) => {
    return useQuery({
        queryKey: ['attachments', projectId, taskId],
        queryFn: () => attachmentsApi.getAll({ projectId, taskId }),
        enabled: !!projectId && !!taskId,
    });
}

export const useAttachmentById = (id: string) => {
    return useQuery({
        queryKey: ['attachment', id],
        queryFn: () => attachmentsApi.getById(id),
        enabled: !!id,
    });
}

export const useDeleteAttachmentById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: attachmentsApi.deleteById,
        onSuccess: () => {
            console.log('Attachment deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['attachments'] });
        },
        onError: (error) => {
            console.error('Error deleting attachment:', error);
        }
    });
}

export const useDownloadAttachment = () => {
    return useMutation({
        mutationFn: attachmentsApi.downloadById,
        onSuccess: () => {
            console.log('Attachment downloaded successfully');
        },
        onError: (error) => {
            console.error('Error downloading attachment:', error);
        }
    });
}
