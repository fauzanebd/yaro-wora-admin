import type * as API from "@/types/api";
import { apiFetch } from "./base";

interface DestinationContentGetResponse {
  data: API.DestinationPageContent;
}

interface DestinationCategoriesGetResponse {
  data: API.DestinationCategory[];
  meta?: { total?: number };
}

export const destinationsContentAPI = {
  get: async () => {
    const response = await apiFetch<DestinationContentGetResponse>(
      "/destinations/content"
    );
    return response.data;
  },
  update: async (data: API.DestinationPageContent) => {
    const response = await apiFetch<DestinationContentGetResponse>(
      "/admin/destinations/content",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },
};

export const destinationCategoriesAPI = {
  getAll: async () => {
    const response = await apiFetch<DestinationCategoriesGetResponse>(
      "/destinations/categories"
    );
    return Array.isArray(response.data) ? response.data : [];
  },
  create: async (payload: Partial<API.DestinationCategory>) => {
    return apiFetch<API.DestinationCategory>("/admin/destinations/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update: async (id: number, payload: Partial<API.DestinationCategory>) => {
    return apiFetch<API.DestinationCategory>(
      `/admin/destinations/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/destinations/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// Destinations (list/featured/detail + admin CRUD)
interface DestinationsGetResponse {
  data: API.DestinationSummary[];
  meta: API.DestinationsMeta;
}

interface DestinationGetResponse {
  data: API.Destination;
}

export const destinationsAPI = {
  // Public
  getAll: async (params?: { page?: number; per_page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));
    return apiFetch<DestinationsGetResponse>(
      `/destinations${query.toString() ? `?${query.toString()}` : ""}`
    );
  },
  getById: async (id: number) => {
    const response = await apiFetch<DestinationGetResponse>(
      `/destinations/${id}`
    );
    return response.data;
  },

  // Admin
  create: async (
    payload: Partial<API.Destination> & { category_id?: number }
  ) => {
    const response = await apiFetch<API.Destination>("/admin/destinations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  },
  update: async (
    id: number,
    payload: Partial<API.Destination> & { category_id?: number }
  ) => {
    const response = await apiFetch<API.Destination>(
      `/admin/destinations/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    return response;
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/destinations/${id}`, { method: "DELETE" });
  },
};

export default {
  destinationsContentAPI,
  destinationCategoriesAPI,
  destinationsAPI,
};
