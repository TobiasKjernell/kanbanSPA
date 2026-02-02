import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout as logoutAPI } from "../lib/supabase/queriesClient";

export const useLogout = () => {
    const navigate = useNavigate();
    const ql = useQueryClient();
    const { mutate: logoutHandler, isPending: isLoggingOut } = useMutation({
        mutationFn: logoutAPI,
        onSuccess: () => {
            ql.removeQueries();
            navigate('login', { replace: true })
        },

    })

    return { logoutHandler, isLoggingOut }
}