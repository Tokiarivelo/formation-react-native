import { AxiosError } from "axios";
import { apiClient } from "../../services/axiosInstance";
import { User } from "../../types/api";

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

    async getId(id: string): Promise<User> {
        try {
            const response = await apiClient.get<User>(`/users/${id}`);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            throw axiosError.response?.data || { message: 'Fetch users failed.' };
        }
    }

    //async updateMe(): 

}