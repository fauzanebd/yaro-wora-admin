import type * as API from "@/types/api";
import { apiFetch } from "./base";

interface RegulationContentGetResponse {
  data: API.RegulationPageContent;
}

interface RegulationCategoriesGetResponse {
  data: API.RegulationCategory[];
  meta: API.RegulationsMeta;
}

interface RegulationsGetResponse {
  data: API.Regulation[];
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
}

interface RegulationGetResponse {
  data: API.Regulation;
}

// Regulation Categories API
export const regulationCategoriesAPI = {
  getAll: async () => {
    const response = await apiFetch<RegulationCategoriesGetResponse>(
      "/regulations/categories"
    );
    return response.data;
  },
  create: async (category: Partial<API.RegulationCategory>) => {
    return apiFetch<API.RegulationCategory>("/admin/regulations/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  },
  update: async (id: number, category: Partial<API.RegulationCategory>) => {
    return apiFetch<API.RegulationCategory>(
      `/admin/regulations/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(category),
      }
    );
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/regulations/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// Regulations API
export const regulationsAPI = {
  getAll: async (params: { page?: number; per_page?: number } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/regulations?${queryString}` : "/regulations";

    return apiFetch<RegulationsGetResponse>(url);
  },
  getById: async (id: number) => {
    const response = await apiFetch<RegulationGetResponse>(
      `/regulations/${id}`
    );
    return response.data;
  },
  create: async (regulation: Partial<API.Regulation>) => {
    return apiFetch<API.Regulation>("/admin/regulations", {
      method: "POST",
      body: JSON.stringify(regulation),
    });
  },
  update: async (id: number, regulation: Partial<API.Regulation>) => {
    return apiFetch<API.Regulation>(`/admin/regulations/${id}`, {
      method: "PUT",
      body: JSON.stringify(regulation),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/regulations/${id}`, {
      method: "DELETE",
    });
  },
};

// Regulation Content API

export const regulationsContentAPI = {
  get: async () => {
    const response = await apiFetch<RegulationContentGetResponse>(
      "/regulations/content"
    );
    return response.data;
  },
  update: async (content: API.RegulationPageContent) => {
    return apiFetch<API.RegulationPageContent>("/admin/regulations/content", {
      method: "PUT",
      body: JSON.stringify(content),
    });
  },
};
