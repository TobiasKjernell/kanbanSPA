import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type z from "zod";
import { login as loginAPI } from "../lib/supabase/queriesClient";
import type { loginSchema } from "../schemas/schemas";

export const useLogin = () => {
    const navigate = useNavigate();
    const ql = useQueryClient();
    const { mutate: login, isPending: isLoggingIn, error } = useMutation({
        mutationFn: (userDataValues: z.infer<typeof loginSchema>) => loginAPI(userDataValues),
        onSuccess: (user) => {
            navigate('/dashboard', { replace: true })
            ql.setQueryData(['user'], user);
        },
        onError: err => {
            console.log(err);
            // toast.error('Provided email or password is incorrect!');
        }

    })
    return { login, isLoggingIn, error }
}