import { AxiosError } from "axios";
import { apiClient } from "../../services/axiosInstance";
import { Attachment } from "../../types/api";

export const attachmentsApi = {

    async upload({ file, projectId, taskId }: { file: any, projectId?: string, taskId?: string }): Promise<Attachment> {
        try {
            const formData = new FormData();

            // Append the file from react-native-image-picker
            formData.append('file', {
                uri: file.uri,
                type: file.type || 'image/jpeg', // fallback to jpeg if type not provided
                name: file.fileName || `photo_${Date.now()}.jpg`,
            } as any);

            // Append optional parameters
            if (projectId) {
                formData.append('projectId', projectId);
            }
            if (taskId) {
                formData.append('taskId', taskId);
            }

            const response = await apiClient.post<Attachment>('/attachments/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Upload attachment failed.' };
        }
    },

    async getAll({ projectId, taskId }: { projectId: string, taskId: string }): Promise<Attachment[]> {
        try {
            const response = await apiClient.get<Attachment[]>('/attachments', { params: { projectId, taskId } });
            return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch attachment failed.' };
        }
    },

    async getById(id: string): Promise<Attachment> {
        try {
            const response = await apiClient.get<Attachment>(`/attachments/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch attachment failed.' };
        }
    },

    async deleteById(id: string): Promise<string> {
        try {
            const response = await apiClient.delete<string>(`/attachments/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Delete attachment failed.' };
        }
    },

    // async downloadById(id: string): Promise<void> {
    //     try {
    //         return await apiClient.get<void>(`/attachments/${id}/download`);
    //     } catch (error) {
    //         const axiosError = error as AxiosError;
    //         throw axiosError.response?.data || { message: 'Fetch attachment failed.' };
    //     }
    // },
}