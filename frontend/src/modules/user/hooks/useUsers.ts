import { useQuery } from "@tanstack/react-query"
import { getUserMe } from "../api"

export const useAuthUser = () => {
    return useQuery({
        queryFn: getUserMe,
        queryKey: ['auth-user'],
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}