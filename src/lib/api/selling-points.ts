import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Selling Points API
interface SellingPointsGetAllResponse {
  data: API.SellingPoint[];
  meta: {
    total: number;
  };
}
export default {
  getAll: async () => {
    const res = await apiFetch<SellingPointsGetAllResponse>("/selling-points");
    let result: API.SellingPoint[] = [];
    if (Array.isArray(res.data)) {
      result = res.data;
    }
    return result;
  },
  create: async (sellingPoint: Partial<API.SellingPoint>) => {
    return apiFetch<API.SellingPoint>("/admin/selling-points", {
      method: "POST",
      body: JSON.stringify(sellingPoint),
    });
  },
  update: async (id: number, sellingPoint: Partial<API.SellingPoint>) => {
    return apiFetch<API.SellingPoint>(`/admin/selling-points/${id}`, {
      method: "PUT",
      body: JSON.stringify(sellingPoint),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/selling-points/${id}`, {
      method: "DELETE",
    });
  },
};
