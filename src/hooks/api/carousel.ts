import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { carouselAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { Carousel, UseQueryOptions } from "./base";

export function useCarousel(
  options?: Omit<UseQueryOptions<Carousel[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.carousel.all(),
    queryFn: carouselAPI.getAll,
    ...options,
  });
}

export function useCreateCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carousel: Partial<Carousel>) => carouselAPI.create(carousel),
    onSuccess: (data) => {
      const currentData = queryClient.getQueryData<Carousel[]>(
        queryKeys.carousel.all()
      );
      const newData = currentData ? [...currentData, data] : [data];
      queryClient.setQueryData(queryKeys.carousel.all(), newData);
      queryClient.invalidateQueries({ queryKey: queryKeys.carousel.all() });
    },
  });
}

export function useUpdateCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      carousel,
    }: {
      id: number;
      carousel: Partial<Carousel>;
    }) => carouselAPI.update(id, carousel),
    onSuccess: (data) => {
      const currentData = queryClient.getQueryData<Carousel[]>(
        queryKeys.carousel.all()
      );
      if (currentData) {
        const updatedData = currentData.map((item) =>
          item.id === data.id ? data : item
        );
        queryClient.setQueryData(queryKeys.carousel.all(), updatedData);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.carousel.all() });
    },
  });
}

export function useDeleteCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => carouselAPI.delete(id),
    onSuccess: (_, variables) => {
      const currentData = queryClient.getQueryData<Carousel[]>(
        queryKeys.carousel.all()
      );
      if (currentData) {
        const updatedData = currentData.filter((item) => item.id !== variables);
        queryClient.setQueryData(queryKeys.carousel.all(), updatedData);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.carousel.all() });
    },
  });
}
