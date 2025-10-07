import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Regulations API
export default {
  // Categories
  getAllCategories: async () => {
    const data = await apiFetch<API.RegulationCategory[]>(
      "/regulations/categories"
    );
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
  },
  createCategory: async (category: Partial<API.RegulationCategory>) => {
    return apiFetch<API.RegulationCategory>("/admin/regulations/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  },
  updateCategory: async (
    id: number,
    category: Partial<API.RegulationCategory>
  ) => {
    return apiFetch<API.RegulationCategory>(
      `/admin/regulations/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(category),
      }
    );
  },
  deleteCategory: async (id: number) => {
    return apiFetch(`/admin/regulations/categories/${id}`, {
      method: "DELETE",
    });
  },

  // Regulations
  getAll: async () => {
    const data = await apiFetch<API.Regulation[]>("/regulations");
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
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
