import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  destinationsContentAPI,
  destinationCategoriesAPI,
  destinationsAPI,
} from "@/lib/api/destinations";
import { queryKeys } from "./base";
import type {
  DestinationCategory,
  DestinationPageContent,
  Destination,
  DestinationSummary,
  UseQueryOptions,
} from "./base";

// Content
export function useDestinationContent(
  options?: Omit<
    UseQueryOptions<DestinationPageContent>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.destinations.content(),
    queryFn: destinationsContentAPI.get,
    ...options,
  });
}

export function useUpdateDestinationContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DestinationPageContent) =>
      destinationsContentAPI.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.destinations.content(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.content(),
      });
    },
  });
}

// Categories
export function useDestinationCategories(
  options?: Omit<UseQueryOptions<DestinationCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.destinations.categories(),
    queryFn: destinationCategoriesAPI.getAll,
    ...options,
  });
}

export function useCreateDestinationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<DestinationCategory>) =>
      destinationCategoriesAPI.create(payload),
    onSuccess: (created) => {
      const current = queryClient.getQueryData<DestinationCategory[]>(
        queryKeys.destinations.categories()
      );
      const next = current ? [...current, created] : [created];
      queryClient.setQueryData(queryKeys.destinations.categories(), next);
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.categories(),
      });
    },
  });
}

export function useUpdateDestinationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<DestinationCategory>;
    }) => destinationCategoriesAPI.update(id, payload),
    onSuccess: (updated) => {
      const current = queryClient.getQueryData<DestinationCategory[]>(
        queryKeys.destinations.categories()
      );
      if (current) {
        const next = current.map((c) => (c.id === updated.id ? updated : c));
        queryClient.setQueryData(queryKeys.destinations.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.categories(),
      });
    },
  });
}

export function useDeleteDestinationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => destinationCategoriesAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<DestinationCategory[]>(
        queryKeys.destinations.categories()
      );
      if (current) {
        const next = current.filter((c) => c.id !== id);
        queryClient.setQueryData(queryKeys.destinations.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.categories(),
      });
    },
  });
}

// Destinations list (unfeatured)
export function useDestinations(
  params: { page?: number; per_page?: number } = {},
  options?: Omit<
    UseQueryOptions<{
      data: DestinationSummary[];
      meta: {
        total: number;
        categories: DestinationCategory[];
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
    queryKey: queryKeys.destinations.allWithParams(params),
    queryFn: () => destinationsAPI.getAll(params),
    ...options,
  });
}

// Destination detail
export function useDestinationDetail(
  id: number,
  options?: Omit<UseQueryOptions<Destination>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.destinations.detail(id),
    queryFn: () => destinationsAPI.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Create
export function useCreateDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Destination> & { category_id?: number }) =>
      destinationsAPI.create(payload),
    onSuccess: (created) => {
      // Convert full Destination to DestinationSummary for cache
      const summary: DestinationSummary = {
        id: created.id,
        title: created.title,
        title_id: created.title_id,
        short_description: created.short_description,
        short_description_id: created.short_description_id,
        image_url: created.image_url,
        thumbnail_url: created.thumbnail_url,
        highlights: created.highlights,
        highlights_id: created.highlights_id,
        is_featured: created.is_featured,
        sort_order: created.sort_order,
        category_id: created.category_id,
        destination_category: created.destination_category,
      };

      const current = queryClient.getQueryData<DestinationSummary[]>(
        queryKeys.destinations.all()
      );
      const next = current ? [...current, summary] : [summary];
      queryClient.setQueryData(queryKeys.destinations.all(), next);
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.featured(),
      });
    },
  });
}

// Update
export function useUpdateDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Destination> & { category_id?: number };
    }) => destinationsAPI.update(id, payload),
    onSuccess: (updated) => {
      // Convert full Destination to DestinationSummary for cache
      const summary: DestinationSummary = {
        id: updated.id,
        title: updated.title,
        title_id: updated.title_id,
        short_description: updated.short_description,
        short_description_id: updated.short_description_id,
        image_url: updated.image_url,
        thumbnail_url: updated.thumbnail_url,
        highlights: updated.highlights,
        highlights_id: updated.highlights_id,
        is_featured: updated.is_featured,
        sort_order: updated.sort_order,
        category_id: updated.category_id,
        destination_category: updated.destination_category,
      };

      const current = queryClient.getQueryData<DestinationSummary[]>(
        queryKeys.destinations.all()
      );
      if (current) {
        const next = current.map((d) => (d.id === updated.id ? summary : d));
        queryClient.setQueryData(queryKeys.destinations.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.featured(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.detail(updated.id),
      });
    },
  });
}

// Delete
export function useDeleteDestination() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => destinationsAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<DestinationSummary[]>(
        queryKeys.destinations.all()
      );
      if (current) {
        const next = current.filter((d) => d.id !== id);
        queryClient.setQueryData(queryKeys.destinations.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.featured(),
      });
    },
  });
}
