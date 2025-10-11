import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/base";
import { queryKeys } from "./base";
import type {
  StorageAnalyticsResponse,
  VisitorAnalyticsResponse,
} from "@/types/api";

/**
 * Hook to fetch storage analytics data
 */
export function useStorageAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.storage(),
    queryFn: async (): Promise<StorageAnalyticsResponse> => {
      return apiFetch("/admin/analytics/storage");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch visitor analytics data
 */
export function useVisitorAnalytics(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.analytics.visitors(days),
    queryFn: async (): Promise<VisitorAnalyticsResponse> => {
      return apiFetch(`/admin/analytics/visitors?days=${days}`);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
