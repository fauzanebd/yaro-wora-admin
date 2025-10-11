import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  galleryContentAPI,
  galleryCategoriesAPI,
  galleryImagesAPI,
} from "@/lib/api/gallery";
import { queryKeys } from "./base";
import type {
  GalleryCategory,
  GalleryPageContent,
  GalleryImage,
  GalleryImageSummary,
  UseQueryOptions,
} from "./base";

// Content
export function useGalleryContent(
  options?: Omit<UseQueryOptions<GalleryPageContent>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.gallery.content(),
    queryFn: galleryContentAPI.get,
    ...options,
  });
}

export function useUpdateGalleryContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GalleryPageContent) =>
      galleryContentAPI.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.gallery.content(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.content(),
      });
    },
  });
}

// Categories
export function useGalleryCategories(
  options?: Omit<UseQueryOptions<GalleryCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.gallery.categories(),
    queryFn: galleryCategoriesAPI.getAll,
    ...options,
  });
}

export function useCreateGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GalleryCategory>) =>
      galleryCategoriesAPI.create(payload),
    onSuccess: (created) => {
      const current = queryClient.getQueryData<GalleryCategory[]>(
        queryKeys.gallery.categories()
      );
      const next = current ? [...current, created] : [created];
      queryClient.setQueryData(queryKeys.gallery.categories(), next);
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
      payload,
    }: {
      id: number;
      payload: Partial<GalleryCategory>;
    }) => galleryCategoriesAPI.update(id, payload),
    onSuccess: (updated) => {
      const current = queryClient.getQueryData<GalleryCategory[]>(
        queryKeys.gallery.categories()
      );
      if (current) {
        const next = current.map((c) => (c.id === updated.id ? updated : c));
        queryClient.setQueryData(queryKeys.gallery.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.categories(),
      });
    },
  });
}

export function useDeleteGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => galleryCategoriesAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<GalleryCategory[]>(
        queryKeys.gallery.categories()
      );
      if (current) {
        const next = current.filter((c) => c.id !== id);
        queryClient.setQueryData(queryKeys.gallery.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.categories(),
      });
    },
  });
}

// Gallery images list
export function useGalleryImages(
  params: { page?: number; per_page?: number } = {},
  options?: Omit<
    UseQueryOptions<{
      data: GalleryImageSummary[];
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
    queryKey: queryKeys.gallery.allWithParams(params),
    queryFn: () => galleryImagesAPI.getAll(params),
    ...options,
  });
}

// Gallery image detail
export function useGalleryImageDetail(
  id: number,
  options?: Omit<UseQueryOptions<GalleryImage>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.gallery.detail(id),
    queryFn: () => galleryImagesAPI.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Create
export function useCreateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GalleryImage> & { category_id?: number }) =>
      galleryImagesAPI.create(payload),
    onSuccess: (created) => {
      // Convert full GalleryImage to GalleryImageSummary for cache
      const summary: GalleryImageSummary = {
        id: created.id,
        title: created.title,
        title_id: created.title_id,
        short_description: created.short_description,
        short_description_id: created.short_description_id,
        image_url: created.image_url,
        thumbnail_url: created.thumbnail_url,
        category_id: created.category_id,
        gallery_category: created.gallery_category,
        date_uploaded: created.date_uploaded,
      };

      const current = queryClient.getQueryData<GalleryImageSummary[]>(
        queryKeys.gallery.all()
      );
      const next = current ? [...current, summary] : [summary];
      queryClient.setQueryData(queryKeys.gallery.all(), next);
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all() });
    },
  });
}

// Update
export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<GalleryImage> & { category_id?: number };
    }) => galleryImagesAPI.update(id, payload),
    onSuccess: (updated) => {
      // Convert full GalleryImage to GalleryImageSummary for cache
      const summary: GalleryImageSummary = {
        id: updated.id,
        title: updated.title,
        title_id: updated.title_id,
        short_description: updated.short_description,
        short_description_id: updated.short_description_id,
        image_url: updated.image_url,
        thumbnail_url: updated.thumbnail_url,
        category_id: updated.category_id,
        gallery_category: updated.gallery_category,
        date_uploaded: updated.date_uploaded,
      };

      const current = queryClient.getQueryData<GalleryImageSummary[]>(
        queryKeys.gallery.all()
      );
      if (current) {
        const next = current.map((d) => (d.id === updated.id ? summary : d));
        queryClient.setQueryData(queryKeys.gallery.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.detail(updated.id),
      });
    },
  });
}

// Delete
export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => galleryImagesAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<GalleryImageSummary[]>(
        queryKeys.gallery.all()
      );
      if (current) {
        const next = current.filter((d) => d.id !== id);
        queryClient.setQueryData(queryKeys.gallery.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all() });
    },
  });
}
