import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attractionsAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { Attraction, UseQueryOptions } from "./base";

export function useAttractions(
  options?: Omit<UseQueryOptions<Attraction[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.attractions.all(),
    queryFn: attractionsAPI.getAll,
    ...options,
  });
}

export function useCreateAttraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attraction: Partial<Attraction>) =>
      attractionsAPI.create(attraction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attractions.all() });
    },
  });
}

export function useUpdateAttraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      attraction,
    }: {
      id: number;
      attraction: Partial<Attraction>;
    }) => attractionsAPI.update(id, attraction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attractions.all() });
    },
  });
}

export function useDeleteAttraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => attractionsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attractions.all() });
    },
  });
}
