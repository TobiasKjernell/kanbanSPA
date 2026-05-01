import { useQuery } from '@tanstack/react-query';
import { getCrew } from '../lib/supabase/queriesClient';

export const useCrew = () => {
    const { data, isPending, error } = useQuery({
        queryFn: getCrew,
        queryKey: ['crew'],
    });

    return { crew: data ?? [], isPending, error };
};
