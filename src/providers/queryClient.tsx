import { QueryClient, QueryClientProvider as OriginalClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react";

const makeQueryClient = (): QueryClient => { return new QueryClient() }
let browserQueryClient: QueryClient | undefined = undefined;

// eslint-disable-next-line react-refresh/only-export-components
export const getQueryClient = () => {
    if (typeof window === 'undefined')
        browserQueryClient = makeQueryClient();
    else
        if (!browserQueryClient)
            browserQueryClient = makeQueryClient();
    
    return browserQueryClient;
}

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = getQueryClient();

    return <OriginalClientProvider client={queryClient!} >
        {children}
    </OriginalClientProvider>
}    