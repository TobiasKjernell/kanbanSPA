import { useMutation } from '@tanstack/react-query';
import { signUp } from '../lib/supabase/queriesClient';

export const useSignup = () => {
    const { mutate: signup, isPending: isSigningUp, error, isSuccess, reset } = useMutation({
        mutationFn: signUp,
    });

    return { signup, isSigningUp, error, isSuccess, reset };
};
