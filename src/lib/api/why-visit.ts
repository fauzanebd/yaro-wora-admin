import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Why Visit API
interface WhyVisitGetAllResponse {
  data: API.WhyVisit[];
  meta: {
    total: number;
  };
}
export const whyVisitAPI = {
  getAll: async () => {
    const data = await apiFetch<WhyVisitGetAllResponse>("/why-visit");

    let result: API.WhyVisit[] = [];

    if (Array.isArray(data.data)) {
      result = data.data;
    } else {
      result = [];
    }

    return result;
  },
  create: async (whyVisit: Partial<API.WhyVisit>) => {
    return apiFetch<API.WhyVisit>("/admin/why-visit", {
      method: "POST",
      body: JSON.stringify(whyVisit),
    });
  },
  update: async (id: number, whyVisit: Partial<API.WhyVisit>) => {
    return apiFetch<API.WhyVisit>(`/admin/why-visit/${id}`, {
      method: "PUT",
      body: JSON.stringify(whyVisit),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/why-visit/${id}`, {
      method: "DELETE",
    });
  },
};

// Why Visit Content API
interface WhyVisitContentGetResponse {
  data: API.WhyVisitContent;
}
export const whyVisitContentAPI = {
  get: async () => {
    const response = await apiFetch<WhyVisitContentGetResponse>(
      "/why-visit-content"
    );
    return response.data;
  },
  update: async (content: Partial<API.WhyVisitContent>) => {
    const response = await apiFetch<WhyVisitContentGetResponse>(
      "/admin/why-visit-content",
      {
        method: "PUT",
        body: JSON.stringify(content),
      }
    );
    return response.data;
  },
};
