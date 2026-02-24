/**
 * React Query Client Configuration for FixPix
 * 
 * Provides centralized cache management for API data fetching.
 * Benefits:
 * - Automatic caching & background refetching
 * - Request deduplication
 * - Stale-while-revalidate pattern
 * - Optimistic updates support
 */

import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized defaults
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 30 seconds
            staleTime: 30 * 1000,
            // Cache data for 5 minutes
            gcTime: 5 * 60 * 1000,
            // Retry failed requests 2 times
            retry: 2,
            // Refetch when window regains focus
            refetchOnWindowFocus: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: 'always',
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
        },
    },
});

// Query keys - centralized for consistency
export const queryKeys = {
    projects: ['projects'],
    project: (id) => ['project', id],
    user: ['user'],
};

export default queryClient;
