import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { GalleryCategory, GalleryImage, UseQueryOptions } from "./base";

// Categories
export function useGalleryCategories(
  options?: Omit<UseQueryOptions<GalleryCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.gallery.categories(),
    queryFn: galleryAPI.getAllCategories,
    ...options,
  });
}

export function useCreateGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Partial<GalleryCategory>) =>
      galleryAPI.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.categories(),
      });
    },
  });
}

export function useUpdateGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: number;
      category: Partial<GalleryCategory>;
    }) => galleryAPI.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.categories(),
      });
    },
  });
}

export function useDeleteGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => galleryAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.categories(),
      });
    },
  });
}

// Images
export function useGalleryImages(
  options?: Omit<UseQueryOptions<GalleryImage[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.gallery.images(),
    queryFn: galleryAPI.getAllImages,
    ...options,
  });
}

export function useCreateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (image: Partial<GalleryImage>) => galleryAPI.createImage(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.images() });
    },
  });
}

export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, image }: { id: number; image: Partial<GalleryImage> }) =>
      galleryAPI.updateImage(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.images() });
    },
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => galleryAPI.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.images() });
    },
  });
}
