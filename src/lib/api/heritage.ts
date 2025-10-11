import type * as API from "@/types/api";
import { apiFetch } from "./base";

interface HeritageContentGetResponse {
  data: API.HeritagePageContent;
}

interface HeritageGetResponse {
  data: API.HeritageSummary[];
}

interface HeritageByIdGetResponse {
  data: API.Heritage;
}

// Heritage Content API
export const heritageContentAPI = {
  get: async (): Promise<API.HeritagePageContent> => {
    const response = await apiFetch<HeritageContentGetResponse>(
      "/heritage/content"
    );
    return response.data;
  },
  update: async (
    content: API.HeritagePageContent
  ): Promise<API.HeritagePageContent> => {
    return apiFetch<API.HeritagePageContent>("/admin/heritage/content", {
      method: "PUT",
      body: JSON.stringify(content),
    });
  },
};

// Heritage API
export const heritageAPI = {
  getAll: async (params: { page?: number; per_page?: number } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/heritage?${queryString}` : "/heritage";

    return apiFetch<HeritageGetResponse>(url);
  },
  getById: async (id: number) => {
    const response = await apiFetch<HeritageByIdGetResponse>(`/heritage/${id}`);
    return response.data;
  },
  create: async (heritage: Partial<API.Heritage>) => {
    return apiFetch<API.Heritage>("/admin/heritage", {
      method: "POST",
      body: JSON.stringify(heritage),
    });
  },
  update: async (id: number, heritage: Partial<API.Heritage>) => {
    return apiFetch<API.Heritage>(`/admin/heritage/${id}`, {
      method: "PUT",
      body: JSON.stringify(heritage),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/heritage/${id}`, {
      method: "DELETE",
    });
  },
};
