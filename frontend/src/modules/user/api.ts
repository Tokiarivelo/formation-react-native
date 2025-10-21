import { AxiosError } from "axios";
import { apiClient } from "../../services/axiosInstance";
import { User, UserParams } from "../../types/api";

export const usersApi = {
    async getAll(): Promise<User[]> {
        try {
            const response = await apiClient.get<User[]>('/users');
            return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch users failed.' };
        }
    },

    async getMe(): Promise<User> {
        try {
            const response = await apiClient.get<User>('/users/me');
            return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch users failed.' };
        }
    },

    async getById(id: string): Promise<User> {
        try {
            const response = await apiClient.get<User>(`/users/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch users failed.' };
        }
    },

    async updateMe(userParams: UserParams): Promise<User> {
        try {
            const response = await apiClient.put<User>(`/users/me`, userParams);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Update user failed.' };
        }
    },

    async updateById({ id, userParams }: { id: string, userParams: UserParams }): Promise<User> {
        try {
            const response = await apiClient.put<User>(`/users/${id}`, userParams);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Update user failed.' };
        }
    },

    async deleteById(id: string): Promise<string> {
        try {
            const response = await apiClient.delete<string>(`/users/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Delete user failed.' };
        }
    }

}