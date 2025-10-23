import { AxiosError } from "axios";
import { apiClient } from "../../services/axiosInstance";
import { TaskParams, TaskResponseCount, TaskResponseDetail } from "../../types/api";

export const tasksApi = {

    async create(taskParams: TaskParams): Promise<TaskResponseCount> {
        try {
            const response = await apiClient.post<TaskResponseCount>('/tasks', taskParams);
            return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Create task failed.' };
        }
    },

    async getAll(): Promise<TaskResponseCount[]> {
        try {
            const response = await apiClient.get<TaskResponseCount[]>('/tasks');
            return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch tasks failed.' };
        }
    },

    async getById(id: string): Promise<TaskResponseDetail> {
        try {
            const response = await apiClient.get<TaskResponseDetail>(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch task failed.' };
        }
    },

    async updateById({ id, taskParams }: { id: string, taskParams: TaskParams }): Promise<TaskResponseCount> {
        try {
            const response = await apiClient.put<TaskResponseCount>(`/tasks/${id}`, taskParams);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Update task failed.' };
        }
    },

    async deleteById(id: string): Promise<string> {
        try {
            const response = await apiClient.delete<string>(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Delete tasks failed.' };
        }
    }

}