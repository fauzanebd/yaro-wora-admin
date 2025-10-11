import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Response interfaces matching backend
interface NewsGetResponse {
  data: API.NewsArticleSummary[];
  meta: API.NewsMeta;
}

interface NewsCategoriesResponse {
  data: API.NewsCategory[];
  meta: API.NewsCategoriesMeta;
}

interface NewsAuthorsResponse {
  data: API.NewsAuthor[];
  meta: API.NewsAuthorsMeta;
}

interface NewsArticleResponse {
  data: API.NewsArticle;
}

interface NewsAuthorResponse {
  data: API.NewsAuthor;
}

interface NewsContentResponse {
  data: API.NewsPageContent;
}

// News Content API
export const newsContentAPI = {
  get: async (): Promise<API.NewsPageContent> => {
    const response = await apiFetch<NewsContentResponse>("/news/content");
    return response.data;
  },
  update: async (
    payload: API.NewsPageContent
  ): Promise<API.NewsPageContent> => {
    const response = await apiFetch<NewsContentResponse>(
      "/admin/news/content",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    return response.data;
  },
};

// News Categories API
export const newsCategoriesAPI = {
  getAll: async (): Promise<API.NewsCategory[]> => {
    const response = await apiFetch<NewsCategoriesResponse>("/news/categories");
    return response.data;
  },
  create: async (
    payload: Partial<API.NewsCategory>
  ): Promise<API.NewsCategory> => {
    const response = await apiFetch<API.NewsCategory>(
      "/admin/news/categories",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return response;
  },
  update: async (
    id: number,
    payload: Partial<API.NewsCategory>
  ): Promise<API.NewsCategory> => {
    const response = await apiFetch<API.NewsCategory>(
      `/admin/news/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    return response;
  },
  delete: async (id: number): Promise<void> => {
    await apiFetch(`/admin/news/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// News Authors API
export const newsAuthorsAPI = {
  getAll: async (): Promise<API.NewsAuthor[]> => {
    const response = await apiFetch<NewsAuthorsResponse>("/news/authors");
    return response.data;
  },
  getById: async (id: number): Promise<API.NewsAuthor> => {
    const response = await apiFetch<NewsAuthorResponse>(`/news/authors/${id}`);
    return response.data;
  },
  create: async (payload: Partial<API.NewsAuthor>): Promise<API.NewsAuthor> => {
    const response = await apiFetch<API.NewsAuthor>("/admin/news/authors", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  },
  update: async (
    id: number,
    payload: Partial<API.NewsAuthor>
  ): Promise<API.NewsAuthor> => {
    const response = await apiFetch<API.NewsAuthor>(
      `/admin/news/authors/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    return response;
  },
  delete: async (id: number): Promise<void> => {
    await apiFetch(`/admin/news/authors/${id}`, {
      method: "DELETE",
    });
  },
};

// News Articles API
export const newsAPI = {
  getAll: async (
    params: { page?: number; per_page?: number } = {}
  ): Promise<{
    data: API.NewsArticleSummary[];
    meta: API.NewsMeta;
  }> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page)
      searchParams.set("per_page", params.per_page.toString());

    const url = `/news${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const response = await apiFetch<NewsGetResponse>(url);
    return response;
  },
  getById: async (id: number): Promise<API.NewsArticle> => {
    const response = await apiFetch<NewsArticleResponse>(`/news/${id}`);
    return response.data;
  },
  create: async (
    payload: Partial<API.NewsArticle>
  ): Promise<API.NewsArticle> => {
    const response = await apiFetch<API.NewsArticle>("/admin/news", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  },
  update: async (
    id: number,
    payload: Partial<API.NewsArticle>
  ): Promise<API.NewsArticle> => {
    const response = await apiFetch<API.NewsArticle>(`/admin/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response;
  },
  delete: async (id: number): Promise<void> => {
    await apiFetch(`/admin/news/${id}`, {
      method: "DELETE",
    });
  },
};
