import type * as API from "@/types/api";
import { apiFetch } from "./base";

interface GalleryContentGetResponse {
  data: API.GalleryPageContent;
}

interface GalleryCategoriesGetResponse {
  data: API.GalleryCategory[];
  meta: API.GalleryMeta;
}

interface GalleryImagesGetResponse {
  data: API.GalleryImageSummary[];
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

interface GalleryImageGetResponse {
  data: API.GalleryImage;
}

export const galleryContentAPI = {
  get: async () => {
    const response = await apiFetch<GalleryContentGetResponse>(
      "/gallery/content"
    );
    return response.data;
  },
  update: async (data: API.GalleryPageContent) => {
    const response = await apiFetch<GalleryContentGetResponse>(
      "/admin/gallery/content",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },
};

export const galleryCategoriesAPI = {
  getAll: async () => {
    const response = await apiFetch<GalleryCategoriesGetResponse>(
      "/gallery/categories"
    );
    return Array.isArray(response.data) ? response.data : [];
  },
  create: async (payload: Partial<API.GalleryCategory>) => {
    return apiFetch<API.GalleryCategory>("/admin/gallery/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update: async (id: number, payload: Partial<API.GalleryCategory>) => {
    return apiFetch<API.GalleryCategory>(`/admin/gallery/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/gallery/categories/${id}`, {
      method: "DELETE",
    });
  },
};

export const galleryImagesAPI = {
  // Public
  getAll: async (params?: { page?: number; per_page?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));
    return apiFetch<GalleryImagesGetResponse>(
      `/gallery${query.toString() ? `?${query.toString()}` : ""}`
    );
  },
  getById: async (id: number) => {
    const response = await apiFetch<GalleryImageGetResponse>(`/gallery/${id}`);
    return response.data;
  },

  // Admin
  create: async (
    payload: Partial<API.GalleryImage> & { category_id?: number }
  ) => {
    const response = await apiFetch<API.GalleryImage>("/admin/gallery", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  },
  update: async (
    id: number,
    payload: Partial<API.GalleryImage> & { category_id?: number }
  ) => {
    const response = await apiFetch<API.GalleryImage>(`/admin/gallery/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response;
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/gallery/${id}`, { method: "DELETE" });
  },
};

export default {
  galleryContentAPI,
  galleryCategoriesAPI,
  galleryImagesAPI,
};
