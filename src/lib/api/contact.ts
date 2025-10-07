import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Contact API
export default {
  getAll: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    return apiFetch(`/admin/contacts${queryString}`);
  },
  getById: async (id: number) => {
    return apiFetch(`/admin/contacts/${id}`);
  },
  updateStatus: async (id: number, status: string, admin_notes?: string) => {
    return apiFetch<API.ContactSubmission>(`/admin/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, admin_notes }),
    });
  },
};
