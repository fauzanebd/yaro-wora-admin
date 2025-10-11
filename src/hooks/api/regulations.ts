import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  regulationsContentAPI,
  regulationCategoriesAPI,
  regulationsAPI,
} from "@/lib/api/regulations";
import { queryKeys } from "./base";
import type { RegulationCategory, Regulation, UseQueryOptions } from "./base";
import type { RegulationPageContent } from "@/types/api";

// Content
export function useRegulationContent(
  options?: Omit<UseQueryOptions<RegulationPageContent>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.regulations.content(),
    queryFn: regulationsContentAPI.get,
    ...options,
  });
}

export function useUpdateRegulationContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegulationPageContent) =>
      regulationsContentAPI.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.regulations.content(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.content(),
      });
    },
  });
}

// Categories
export function useRegulationCategories(
  options?: Omit<UseQueryOptions<RegulationCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.regulations.categories(),
    queryFn: regulationCategoriesAPI.getAll,
    ...options,
  });
}

export function useCreateRegulationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<RegulationCategory>) =>
      regulationCategoriesAPI.create(payload),
    onSuccess: (created) => {
      const current = queryClient.getQueryData<RegulationCategory[]>(
        queryKeys.regulations.categories()
      );
      const next = current ? [...current, created] : [created];
      queryClient.setQueryData(queryKeys.regulations.categories(), next);
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.categories(),
      });
    },
  });
}

export function useUpdateRegulationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<RegulationCategory>;
    }) => regulationCategoriesAPI.update(id, payload),
    onSuccess: (updated) => {
      const current = queryClient.getQueryData<RegulationCategory[]>(
        queryKeys.regulations.categories()
      );
      if (current) {
        const next = current.map((c) => (c.id === updated.id ? updated : c));
        queryClient.setQueryData(queryKeys.regulations.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.categories(),
      });
    },
  });
}

export function useDeleteRegulationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => regulationCategoriesAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<RegulationCategory[]>(
        queryKeys.regulations.categories()
      );
      if (current) {
        const next = current.filter((c) => c.id !== id);
        queryClient.setQueryData(queryKeys.regulations.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.categories(),
      });
    },
  });
}

// Regulations list
export function useRegulations(
  params: { page?: number; per_page?: number } = {},
  options?: Omit<
    UseQueryOptions<{
      data: Regulation[];
      meta: {
        total: number;
        pagination: {
          current_page: number;
          per_page: number;
          total_pages: number;
          has_next: boolean;
          has_previous: boolean;
        };
      };
    }>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.regulations.allWithParams(params),
    queryFn: () => regulationsAPI.getAll(params),
    ...options,
  });
}

// Regulation detail
export function useRegulationDetail(
  id: number,
  options?: Omit<UseQueryOptions<Regulation>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.regulations.detail(id),
    queryFn: async () => {
      const response = await regulationsAPI.getById(id);
      return response;
    },
    enabled: !!id,
    ...options,
  });
}

// Create
export function useCreateRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Regulation>) =>
      regulationsAPI.create(payload),
    onSuccess: (created) => {
      const current = queryClient.getQueryData<Regulation[]>(
        queryKeys.regulations.all()
      );
      const next = current ? [...current, created] : [created];
      queryClient.setQueryData(queryKeys.regulations.all(), next);
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
    },
  });
}

// Update
export function useUpdateRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Regulation> & { category_id?: number };
    }) => regulationsAPI.update(id, payload),
    onSuccess: (updated) => {
      const current = queryClient.getQueryData<Regulation[]>(
        queryKeys.regulations.all()
      );
      if (current) {
        const next = current.map((r) => (r.id === updated.id ? updated : r));
        queryClient.setQueryData(queryKeys.regulations.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.detail(updated.id),
      });
    },
  });
}

// Delete
export function useDeleteRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => regulationsAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<Regulation[]>(
        queryKeys.regulations.all()
      );
      if (current) {
        const next = current.filter((r) => r.id !== id);
        queryClient.setQueryData(queryKeys.regulations.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
    },
  });
}
