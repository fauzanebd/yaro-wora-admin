import { apiFetch } from "./base";
import type {
  Facility,
  FacilitySummary,
  FacilityCategory,
  FacilityPageContent,
  FacilitiesMeta,
} from "@/types/api";

interface FacilitiesGetResponse {
  data: FacilitySummary[];
  meta: FacilitiesMeta;
}

interface FacilityCategoriesResponse {
  data: FacilityCategory[];
  meta: {
    total_categories: number;
    total_facilities: number;
  };
}

interface FacilityDetailResponse {
  data: Facility;
}

interface FacilityContentResponse {
  data: FacilityPageContent;
}

// Content API
export const facilitiesContentAPI = {
  get: async (): Promise<FacilityPageContent> => {
    const response = await apiFetch<FacilityContentResponse>(
      "/facilities/content"
    );
    return response.data;
  },
  update: async (
    payload: FacilityPageContent
  ): Promise<FacilityPageContent> => {
    const res = await apiFetch<FacilityPageContent>(
      "/admin/facilities/content",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    return res;
  },
};

// Categories API
export const facilityCategoriesAPI = {
  getAll: async (): Promise<FacilityCategory[]> => {
    const response = await apiFetch<FacilityCategoriesResponse>(
      "/facilities/categories"
    );
    return response.data;
  },
  create: async (
    payload: Partial<FacilityCategory>
  ): Promise<FacilityCategory> => {
    const res = await apiFetch<FacilityCategory>(
      "/admin/facilities/categories",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return res;
  },
  update: async (
    id: number,
    payload: Partial<FacilityCategory>
  ): Promise<FacilityCategory> => {
    const res = await apiFetch<FacilityCategory>(
      `/admin/facilities/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    return res;
  },
  delete: async (id: number): Promise<void> => {
    await apiFetch(`/admin/facilities/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// Facilities API
export const facilitiesAPI = {
  getAll: async (
    params: { page?: number; per_page?: number } = {}
  ): Promise<FacilitiesGetResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const response = await apiFetch<FacilitiesGetResponse>(
      `/facilities${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
    return response;
  },
  getById: async (id: number): Promise<Facility> => {
    const response = await apiFetch<FacilityDetailResponse>(
      `/facilities/${id}`
    );
    return response.data;
  },
  create: async (
    payload: Partial<Facility> & { category_id?: number }
  ): Promise<Facility> => {
    const res = await apiFetch<Facility>("/admin/facilities", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  },
  update: async (
    id: number,
    payload: Partial<Facility> & { category_id?: number }
  ): Promise<Facility> => {
    const res = await apiFetch<Facility>(`/admin/facilities/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res;
  },
  delete: async (id: number): Promise<void> => {
    await apiFetch(`/admin/facilities/${id}`, {
      method: "DELETE",
    });
  },
};
