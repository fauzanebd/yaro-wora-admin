import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  facilitiesContentAPI,
  facilityCategoriesAPI,
  facilitiesAPI,
} from "@/lib/api/facilities";
import { queryKeys } from "./base";
import type {
  FacilityCategory,
  FacilityPageContent,
  Facility,
  FacilitySummary,
  UseQueryOptions,
} from "./base";

// Content
export function useFacilityContent(
  options?: Omit<UseQueryOptions<FacilityPageContent>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.facilities.content(),
    queryFn: facilitiesContentAPI.get,
    ...options,
  });
}

export function useUpdateFacilityContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FacilityPageContent) =>
      facilitiesContentAPI.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.facilities.content(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.facilities.content(),
      });
    },
  });
}

// Categories
export function useFacilityCategories(
  options?: Omit<UseQueryOptions<FacilityCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.facilities.categories(),
    queryFn: facilityCategoriesAPI.getAll,
    ...options,
  });
}

export function useCreateFacilityCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<FacilityCategory>) =>
      facilityCategoriesAPI.create(payload),
    onSuccess: (created) => {
      const current = queryClient.getQueryData<FacilityCategory[]>(
        queryKeys.facilities.categories()
      );
      const next = current ? [...current, created] : [created];
      queryClient.setQueryData(queryKeys.facilities.categories(), next);
      queryClient.invalidateQueries({
        queryKey: queryKeys.facilities.categories(),
      });
    },
  });
}

export function useUpdateFacilityCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<FacilityCategory>;
    }) => facilityCategoriesAPI.update(id, payload),
    onSuccess: (updated) => {
      const current = queryClient.getQueryData<FacilityCategory[]>(
        queryKeys.facilities.categories()
      );
      if (current) {
        const next = current.map((c) => (c.id === updated.id ? updated : c));
        queryClient.setQueryData(queryKeys.facilities.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.facilities.categories(),
      });
    },
  });
}

export function useDeleteFacilityCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => facilityCategoriesAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<FacilityCategory[]>(
        queryKeys.facilities.categories()
      );
      if (current) {
        const next = current.filter((c) => c.id !== id);
        queryClient.setQueryData(queryKeys.facilities.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.facilities.categories(),
      });
    },
  });
}

// Facilities list
export function useFacilities(
  params: { page?: number; per_page?: number } = {},
  options?: Omit<
    UseQueryOptions<{
      data: FacilitySummary[];
      meta: {
        total_categories: number;
        total_facilities: number;
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
    queryKey: queryKeys.facilities.allWithParams(params),
    queryFn: () => facilitiesAPI.getAll(params),
    ...options,
  });
}

// Facility detail
export function useFacilityDetail(
  id: number,
  options?: Omit<UseQueryOptions<Facility>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.facilities.detail(id),
    queryFn: () => facilitiesAPI.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Create
export function useCreateFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Facility>) => facilitiesAPI.create(payload),
    onSuccess: (created) => {
      // Convert full Facility to FacilitySummary for cache
      const summary: FacilitySummary = {
        id: created.id,
        name: created.name,
        name_id: created.name_id,
        short_description: created.short_description,
        short_description_id: created.short_description_id,
        image_url: created.image_url,
        thumbnail_url: created.thumbnail_url,
        highlights: created.highlights,
        highlights_id: created.highlights_id,
        is_featured: created.is_featured,
        sort_order: created.sort_order,
        category_id: created.category_id,
        facility_category: created.facility_category,
        duration: created.duration,
        capacity: created.capacity,
        price: created.price,
        duration_id: created.duration_id,
        capacity_id: created.capacity_id,
        price_id: created.price_id,
      };

      const current = queryClient.getQueryData<FacilitySummary[]>(
        queryKeys.facilities.all()
      );
      const next = current ? [...current, summary] : [summary];
      queryClient.setQueryData(queryKeys.facilities.all(), next);
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.facilities.featured(),
      });
    },
  });
}

// Update
export function useUpdateFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Facility> & { category_id?: number };
    }) => facilitiesAPI.update(id, payload),
    onSuccess: (updated) => {
      // Convert full Facility to FacilitySummary for cache
      const summary: FacilitySummary = {
        id: updated.id,
        name: updated.name,
        name_id: updated.name_id,
        short_description: updated.short_description,
        short_description_id: updated.short_description_id,
        image_url: updated.image_url,
        thumbnail_url: updated.thumbnail_url,
        highlights: updated.highlights,
        highlights_id: updated.highlights_id,
        is_featured: updated.is_featured,
        sort_order: updated.sort_order,
        category_id: updated.category_id,
        facility_category: updated.facility_category,
        duration: updated.duration,
        capacity: updated.capacity,
        price: updated.price,
        duration_id: updated.duration_id,
        capacity_id: updated.capacity_id,
        price_id: updated.price_id,
      };

      const current = queryClient.getQueryData<FacilitySummary[]>(
        queryKeys.facilities.all()
      );
      if (current) {
        const next = current.map((f) => (f.id === updated.id ? summary : f));
        queryClient.setQueryData(queryKeys.facilities.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.facilities.featured(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.facilities.detail(updated.id),
      });
    },
  });
}

// Delete
export function useDeleteFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => facilitiesAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<FacilitySummary[]>(
        queryKeys.facilities.all()
      );
      if (current) {
        const next = current.filter((f) => f.id !== id);
        queryClient.setQueryData(queryKeys.facilities.all(), next);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.facilities.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.facilities.featured(),
      });
    },
  });
}
