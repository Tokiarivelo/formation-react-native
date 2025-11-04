import { AxiosError } from "axios";
import { apiClient } from "../../services/axiosInstance";
import { ProjectParams, ProjectResponseCount, ProjectResponseDetail } from "../../types/api";

export const projectsApi = {

    async create(projectParams: ProjectParams): Promise<ProjectResponseCount> {
        try {
            const response = await apiClient.post<ProjectResponseCount>('/projects', projectParams);
            return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Create project failed.' };
        }
    },

    async getAll(): Promise<ProjectResponseCount[]> {
        try {
            const response = await apiClient.get<ProjectResponseCount[]>('/projects');
            return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch projects failed.' };
        }
    },

    async get(id: string): Promise<ProjectResponseDetail> {
        try {
            const response = await apiClient.get<ProjectResponseDetail>(`/projects/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch project failed.' };
        }
    },

    async update({ id, projectParams }: { id: string, projectParams: ProjectParams }): Promise<ProjectResponseCount> {
        try {
            const response = await apiClient.put<ProjectResponseCount>(`/projects/${id}`, projectParams);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Update project failed.' };
        }
    },

    async delete(id: string): Promise<string> {
        try {
            const response = await apiClient.delete<string>(`/projects/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Delete project failed.' };
        }
    },
}