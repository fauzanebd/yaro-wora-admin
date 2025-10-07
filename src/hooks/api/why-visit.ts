import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { whyVisitAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { WhyVisit, UseQueryOptions } from "./base";

export function useWhyVisit(
  options?: Omit<UseQueryOptions<WhyVisit[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.whyVisit.all(),
    queryFn: whyVisitAPI.getAll,
    ...options,
  });
}

export function useCreateWhyVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (whyVisit: Partial<WhyVisit>) => whyVisitAPI.create(whyVisit),
    onSuccess: (data) => {
      const currentData = queryClient.getQueryData<WhyVisit[]>(
        queryKeys.whyVisit.all()
      );
      const newData = currentData ? [...currentData, data] : [data];
      queryClient.setQueryData(queryKeys.whyVisit.all(), newData);
      queryClient.invalidateQueries({
        queryKey: queryKeys.whyVisit.all(),
      });
    },
  });
}

export function useUpdateWhyVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      whyVisit,
    }: {
      id: number;
      whyVisit: Partial<WhyVisit>;
    }) => whyVisitAPI.update(id, whyVisit),
    onSuccess: (data) => {
      const currentData = queryClient.getQueryData<WhyVisit[]>(
        queryKeys.whyVisit.all()
      );
      if (currentData) {
        const updatedData = currentData.map((item) =>
          item.id === data.id ? data : item
        );
        queryClient.setQueryData(queryKeys.whyVisit.all(), updatedData);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.whyVisit.all(),
      });
    },
  });
}

export function useDeleteWhyVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => whyVisitAPI.delete(id),
    onSuccess: (_, variables) => {
      const currentData = queryClient.getQueryData<WhyVisit[]>(
        queryKeys.whyVisit.all()
      );
      if (currentData) {
        const updatedData = currentData.filter((item) => item.id !== variables);
        queryClient.setQueryData(queryKeys.whyVisit.all(), updatedData);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.whyVisit.all(),
      });
    },
  });
}
