import type * as API from "@/types/api";
import { apiFetch } from "./base";

// News API
export default {
  // Categories
  getAllCategories: async () => {
    const data = await apiFetch<API.NewsCategory[]>("/news/categories");
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
  },
  createCategory: async (category: Partial<API.NewsCategory>) => {
    return apiFetch<API.NewsCategory>("/admin/news/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  },
  updateCategory: async (id: number, category: Partial<API.NewsCategory>) => {
    return apiFetch<API.NewsCategory>(`/admin/news/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    });
  },
  deleteCategory: async (id: number) => {
    return apiFetch(`/admin/news/categories/${id}`, {
      method: "DELETE",
    });
  },

  // Articles
  getAllArticles: async () => {
    const data = await apiFetch<API.NewsArticle[]>("/news");
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
  },
  getArticle: async (id: number) => {
    return apiFetch<API.NewsArticle>(`/news/${id}`);
  },
  createArticle: async (article: Partial<API.NewsArticle>) => {
    return apiFetch<API.NewsArticle>("/admin/news", {
      method: "POST",
      body: JSON.stringify(article),
    });
  },
  updateArticle: async (id: number, article: Partial<API.NewsArticle>) => {
    return apiFetch<API.NewsArticle>(`/admin/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(article),
    });
  },
  deleteArticle: async (id: number) => {
    return apiFetch(`/admin/news/${id}`, {
      method: "DELETE",
    });
  },
};
