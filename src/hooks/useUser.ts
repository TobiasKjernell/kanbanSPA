import { useQuery } from "@tanstack/react-query"
import { getUser } from "../lib/supabase/queriesClient"

/**
 * A custom hook that fetches and manages the current user's authentication state.
 * Uses React Query for caching and automatic refetching.
 *
 * @returns An object containing:
 *   - `isLoading` - Whether the user data is being fetched
 *   - `user` - The current user object or undefined if not authenticated
 *   - `isAuth` - Whether the user is authenticated (has 'authenticated' role)
 *
 * @example
 * ```tsx
 * const UserProfile = () => {
 *   const { isLoading, user, isAuth } = useUser();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!isAuth) return <Redirect to="/login" />;
 *
 *   return <div>Welcome, {user?.email}</div>;
 * };
 * ```
 */
export const useUser = () => {
    const { isPending: isLoading, data: user } = useQuery({
        queryKey: ['user'],
        queryFn: getUser
    });

    return { isLoading, user, isAuth: user?.role === 'authenticated' };
};