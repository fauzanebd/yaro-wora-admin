import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Attractions API
interface AttractionsGetAllResponse {
  data: API.Attraction[];
  meta: {
    active_count: number;
    total: number;
  };
}
export const attractionsAPI = {
  getAll: async () => {
    const data = await apiFetch<AttractionsGetAllResponse>("/attractions");
    let result: API.Attraction[] = [];
    if (Array.isArray(data.data)) {
      result = data.data;
    }
    return result;
  },
  create: async (attraction: Partial<API.Attraction>) => {
    return apiFetch<API.Attraction>("/admin/attractions", {
      method: "POST",
      body: JSON.stringify(attraction),
    });
  },
  update: async (id: number, attraction: Partial<API.Attraction>) => {
    return apiFetch<API.Attraction>(`/admin/attractions/${id}`, {
      method: "PUT",
      body: JSON.stringify(attraction),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/attractions/${id}`, {
      method: "DELETE",
    });
  },
};

// Attraction Content API
interface AttractionContentGetResponse {
  data: API.GeneralAttractionContent;
}
export const attractionContentAPI = {
  get: async () => {
    const response = await apiFetch<AttractionContentGetResponse>(
      "/attraction-content"
    );
    return response.data;
  },
  update: async (content: Partial<API.GeneralAttractionContent>) => {
    const response = await apiFetch<AttractionContentGetResponse>(
      "/admin/attraction-content",
      {
        method: "PUT",
        body: JSON.stringify(content),
      }
    );
    return response.data;
  },
};
