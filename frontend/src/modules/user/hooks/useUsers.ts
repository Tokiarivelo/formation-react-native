import { useQuery } from "@tanstack/react-query"
import { usersApi } from "../api"
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