import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Carousel API
interface CarouselGetAllResponse {
  data: API.Carousel[];
  meta: {
    total: number;
    auto_play_interval: number;
  };
}
export default {
  getAll: async () => {
    const res = await apiFetch<CarouselGetAllResponse>("/carousel");
    let result: API.Carousel[] = [];
    if (Array.isArray(res.data)) {
      result = res.data;
    }
    return result;
  },
  create: async (carousel: Partial<API.Carousel>) => {
    return apiFetch<API.Carousel>("/admin/carousel", {
      method: "POST",
      body: JSON.stringify(carousel),
    });
  },
  update: async (id: number, carousel: Partial<API.Carousel>) => {
    return apiFetch<API.Carousel>(`/admin/carousel/${id}`, {
      method: "PUT",
      body: JSON.stringify(carousel),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/carousel/${id}`, {
      method: "DELETE",
    });
  },
};
