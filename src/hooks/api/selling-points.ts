import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sellingPointsAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { SellingPoint, UseQueryOptions } from "./base";

export function useSellingPoints(
  options?: Omit<UseQueryOptions<SellingPoint[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.sellingPoints.all(),
    queryFn: sellingPointsAPI.getAll,
    ...options,
  });
}

export function useCreateSellingPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sellingPoint: Partial<SellingPoint>) =>
      sellingPointsAPI.create(sellingPoint),
    onSuccess: (data) => {
      const currentData = queryClient.getQueryData<SellingPoint[]>(
        queryKeys.sellingPoints.all()
      );
      const newData = currentData ? [...currentData, data] : [data];
      queryClient.setQueryData(queryKeys.sellingPoints.all(), newData);
      queryClient.invalidateQueries({
        queryKey: queryKeys.sellingPoints.all(),
      });
    },
  });
}

export function useUpdateSellingPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      sellingPoint,
    }: {
      id: number;
      sellingPoint: Partial<SellingPoint>;
    }) => sellingPointsAPI.update(id, sellingPoint),
    onSuccess: (data) => {
      const currentData = queryClient.getQueryData<SellingPoint[]>(
        queryKeys.sellingPoints.all()
      );
      if (currentData) {
        const updatedData = currentData.map((item) =>
          item.id === data.id ? data : item
        );
        queryClient.setQueryData(queryKeys.sellingPoints.all(), updatedData);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.sellingPoints.all(),
      });
    },
  });
}

export function useDeleteSellingPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sellingPointsAPI.delete(id),
    onSuccess: (_, variables) => {
      const currentData = queryClient.getQueryData<SellingPoint[]>(
        queryKeys.sellingPoints.all()
      );
      if (currentData) {
        const updatedData = currentData.filter((item) => item.id !== variables);
        queryClient.setQueryData(queryKeys.sellingPoints.all(), updatedData);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.sellingPoints.all(),
      });
    },
  });
}
