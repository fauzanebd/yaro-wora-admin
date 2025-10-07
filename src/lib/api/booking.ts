import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Booking API
export default {
  getAll: async (params?: { status?: string; facility_id?: number }) => {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    return apiFetch(`/admin/bookings${queryString}`);
  },
  updateStatus: async (id: number, status: string) => {
    return apiFetch<API.Booking>(`/admin/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};
