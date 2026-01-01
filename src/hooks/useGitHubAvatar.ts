"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch GitHub avatar URL.
 * Uses the avatars.githubusercontent.com endpoint with user ID.
 */
export function useGitHubAvatar(userId: string, size: number = 260) {
    return useQuery({
        queryKey: ["github-avatar", userId, size],
        queryFn: async () => {
            // GitHub avatars are publicly accessible via this URL pattern
            const url = `https://avatars.githubusercontent.com/u/${userId}?v=4&s=${size}`;

            // Verify the URL is valid by doing a HEAD request
            const response = await fetch(url, { method: "HEAD" });
            if (!response.ok) {
                throw new Error("Failed to fetch avatar");
            }

            return url;
        },
        staleTime: Infinity, // Avatar URLs don't change
        gcTime: Infinity,
    });
}
