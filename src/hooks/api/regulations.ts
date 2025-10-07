import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { regulationsAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { RegulationCategory, Regulation, UseQueryOptions } from "./base";

// Categories
export function useRegulationCategories(
  options?: Omit<UseQueryOptions<RegulationCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.regulations.categories(),
    queryFn: regulationsAPI.getAllCategories,
    ...options,
  });
}

export function useCreateRegulationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Partial<RegulationCategory>) =>
      regulationsAPI.createCategory(category),
    onSuccess: () => {
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
      category,
    }: {
      id: number;
      category: Partial<RegulationCategory>;
    }) => regulationsAPI.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.categories(),
      });
    },
  });
}

export function useDeleteRegulationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => regulationsAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.categories(),
      });
    },
  });
}

// Regulations
export function useRegulations(
  options?: Omit<UseQueryOptions<Regulation[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.regulations.all(),
    queryFn: regulationsAPI.getAll,
    ...options,
  });
}

export function useCreateRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (regulation: Partial<Regulation>) =>
      regulationsAPI.create(regulation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
    },
  });
}

export function useUpdateRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      regulation,
    }: {
      id: number;
      regulation: Partial<Regulation>;
    }) => regulationsAPI.update(id, regulation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
    },
  });
}

export function useDeleteRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => regulationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
    },
  });
}
