/**
 * useProjects Hook - React Query powered projects fetching
 * 
 * Automatically caches project list and handles:
 * - Loading states
 * - Error handling
 * - Background refetching
 * - Cache invalidation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { apiEndpoints } from '../lib/api';
import { queryKeys } from '../lib/queryClient';

// Fetch all projects for the current user
const fetchProjects = async (authTokens) => {
    const response = await fetch(apiEndpoints.images, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + (authTokens?.access || '')
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }

    return response.json();
};

// Delete a project
const deleteProject = async ({ projectId, authTokens }) => {
    const response = await fetch(apiEndpoints.imageDetail(projectId), {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + (authTokens?.access || '')
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete project');
    }

    return { success: true };
};

/**
 * Hook to fetch and cache user's projects
 */
export const useProjects = () => {
    const { authTokens } = useContext(AuthContext);

    return useQuery({
        queryKey: queryKeys.projects,
        queryFn: () => fetchProjects(authTokens),
        enabled: !!authTokens?.access, // Only fetch if authenticated
        staleTime: 60 * 1000, // Consider data fresh for 1 minute
    });
};

/**
 * Hook to delete a project with cache invalidation
 */
export const useDeleteProject = () => {
    const { authTokens } = useContext(AuthContext);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectId) => deleteProject({ projectId, authTokens }),
        onSuccess: () => {
            // Invalidate projects cache to trigger refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.projects });
        },
    });
};

/**
 * Hook to manually refresh projects
 */
export const useRefreshProjects = () => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    };
};

export default useProjects;
