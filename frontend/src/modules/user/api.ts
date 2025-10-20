import { AxiosError } from "axios";
import { apiClient } from "../../services/axiosInstance";
import { User } from "../../types/api";

export const getUserMe = async (): Promise<User> => {
    try {
        const response = await apiClient.get('/users/me');
        return response.data;
    }
    catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data || { message: 'Fetch user failed.' };
    }
}