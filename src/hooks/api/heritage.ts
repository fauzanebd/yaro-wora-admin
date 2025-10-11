import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { heritageContentAPI, heritageAPI } from "@/lib/api/heritage";
import { queryKeys } from "./base";
import type {
  Heritage,
  HeritageSummary,
  HeritagePageContent,
  UseQueryOptions,
} from "./base";

// Content
export function useHeritageContent(
  options?: Omit<UseQueryOptions<HeritagePageContent>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.heritage.content(),
    queryFn: heritageContentAPI.get,
    ...options,
  });
}

export function useUpdateHeritageContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: HeritagePageContent) =>
      heritageContentAPI.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.heritage.content(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.heritage.content(),
      });
    },
  });
}

// Heritage list
export function useHeritage(
  params: { page?: number; per_page?: number } = {},
  options?: Omit<
    UseQueryOptions<{
      data: HeritageSummary[];
    }>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.heritage.allWithParams(params),
    queryFn: () => heritageAPI.getAll(params),
    ...options,
  });
}

// Heritage detail
export function useHeritageDetail(
  id: number,
  options?: Omit<UseQueryOptions<Heritage>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.heritage.detail(id),
    queryFn: () => heritageAPI.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Create
export function useCreateHeritage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Heritage>) => heritageAPI.create(payload),
    onSuccess: (created) => {
      // Convert full Heritage to HeritageSummary for cache
      const summary: HeritageSummary = {
        id: created.id,
        title: created.title,
        title_id: created.title_id,
        short_description: created.short_description,
        short_description_id: created.short_description_id,
        image_url: created.image_url,
        thumbnail_url: created.thumbnail_url,
        sort_order: created.sort_order,
      };

      const current = queryClient.getQueryData<HeritageSummary[]>(
        queryKeys.heritage.all()
      );
      const next = current ? [...current, summary] : [summary];
      queryClient.setQueryData(queryKeys.heritage.all(), next);
      queryClient.invalidateQueries({ queryKey: queryKeys.heritage.all() });
    },
  });
}

// Update
export function useUpdateHeritage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Heritage> }) =>
      heritageAPI.update(id, payload),
    onSuccess: (updated) => {
      // Convert full Heritage to HeritageSummary for cache
      const summary: HeritageSummary = {
        id: updated.id,
        title: updated.title,
        title_id: updated.title_id,
        short_description: updated.short_description,
        short_description_id: updated.short_description_id,
        image_url: updated.image_url,
        thumbnail_url: updated.thumbnail_url,
        sort_order: updated.sort_order,
      };

      const current = queryClient.getQueryData<HeritageSummary[]>(
        queryKeys.heritage.all()
      );
      if (current) {
        const next = current.map((h) => (h.id === updated.id ? summary : h));
        queryClient.setQueryData(queryKeys.heritage.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.heritage.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.heritage.detail(updated.id),
      });
    },
  });
}

// Delete
export function useDeleteHeritage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => heritageAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<HeritageSummary[]>(
        queryKeys.heritage.all()
      );
      if (current) {
        const next = current.filter((h) => h.id !== id);
        queryClient.setQueryData(queryKeys.heritage.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.heritage.all() });
    },
  });
}
