import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Gallery API
export default {
  // Categories
  getAllCategories: async () => {
    const data = await apiFetch<API.GalleryCategory[]>("/gallery/categories");
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
  },
  createCategory: async (category: Partial<API.GalleryCategory>) => {
    return apiFetch<API.GalleryCategory>("/admin/gallery/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  },
  updateCategory: async (
    id: number,
    category: Partial<API.GalleryCategory>
  ) => {
    return apiFetch<API.GalleryCategory>(`/admin/gallery/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    });
  },
  deleteCategory: async (id: number) => {
    return apiFetch(`/admin/gallery/categories/${id}`, {
      method: "DELETE",
    });
  },

  // Images
  getAllImages: async () => {
    const data = await apiFetch<API.GalleryImage[]>("/gallery/images");
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
  },
  createImage: async (image: Partial<API.GalleryImage>) => {
    return apiFetch<API.GalleryImage>("/admin/gallery/images", {
      method: "POST",
      body: JSON.stringify(image),
    });
  },
  updateImage: async (id: number, image: Partial<API.GalleryImage>) => {
    return apiFetch<API.GalleryImage>(`/admin/gallery/images/${id}`, {
      method: "PUT",
      body: JSON.stringify(image),
    });
  },
  deleteImage: async (id: number) => {
    return apiFetch(`/admin/gallery/images/${id}`, {
      method: "DELETE",
    });
  },
};
