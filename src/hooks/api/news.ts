import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  newsContentAPI,
  newsCategoriesAPI,
  newsAuthorsAPI,
  newsAPI,
} from "@/lib/api/news";
import { queryKeys } from "./base";
import type {
  NewsCategory,
  NewsAuthor,
  NewsArticle,
  NewsArticleSummary,
  NewsPageContent,
  UseQueryOptions,
} from "./base";

// Content
export function useNewsContent(
  options?: Omit<UseQueryOptions<NewsPageContent>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.content(),
    queryFn: newsContentAPI.get,
    ...options,
  });
}

export function useUpdateNewsContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewsPageContent) => newsContentAPI.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.news.content(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.content(),
      });
    },
  });
}

// Categories
export function useNewsCategories(
  options?: Omit<UseQueryOptions<NewsCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.categories(),
    queryFn: newsCategoriesAPI.getAll,
    ...options,
  });
}

export function useCreateNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<NewsCategory>) =>
      newsCategoriesAPI.create(payload),
    onSuccess: (created) => {
      const current = queryClient.getQueryData<NewsCategory[]>(
        queryKeys.news.categories()
      );
      const next = current ? [...current, created] : [created];
      queryClient.setQueryData(queryKeys.news.categories(), next);
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.categories(),
      });
    },
  });
}

export function useUpdateNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<NewsCategory>;
    }) => newsCategoriesAPI.update(id, payload),
    onSuccess: (updated) => {
      const current = queryClient.getQueryData<NewsCategory[]>(
        queryKeys.news.categories()
      );
      if (current) {
        const next = current.map((c) => (c.id === updated.id ? updated : c));
        queryClient.setQueryData(queryKeys.news.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.categories(),
      });
    },
  });
}

export function useDeleteNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => newsCategoriesAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<NewsCategory[]>(
        queryKeys.news.categories()
      );
      if (current) {
        const next = current.filter((c) => c.id !== id);
        queryClient.setQueryData(queryKeys.news.categories(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.categories(),
      });
    },
  });
}

// Authors
export function useNewsAuthors(
  options?: Omit<UseQueryOptions<NewsAuthor[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.authors(),
    queryFn: newsAuthorsAPI.getAll,
    ...options,
  });
}

export function useNewsAuthor(
  id: number,
  options?: Omit<UseQueryOptions<NewsAuthor>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.author(id),
    queryFn: () => newsAuthorsAPI.getById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateNewsAuthor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<NewsAuthor>) =>
      newsAuthorsAPI.create(payload),
    onSuccess: (created) => {
      const current = queryClient.getQueryData<NewsAuthor[]>(
        queryKeys.news.authors()
      );
      const next = current ? [...current, created] : [created];
      queryClient.setQueryData(queryKeys.news.authors(), next);
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.authors(),
      });
    },
  });
}

export function useUpdateNewsAuthor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<NewsAuthor>;
    }) => newsAuthorsAPI.update(id, payload),
    onSuccess: (updated) => {
      const current = queryClient.getQueryData<NewsAuthor[]>(
        queryKeys.news.authors()
      );
      if (current) {
        const next = current.map((a) => (a.id === updated.id ? updated : a));
        queryClient.setQueryData(queryKeys.news.authors(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.authors(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.author(updated.id),
      });
    },
  });
}

export function useDeleteNewsAuthor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => newsAuthorsAPI.delete(id),
    onSuccess: (_, id) => {
      const current = queryClient.getQueryData<NewsAuthor[]>(
        queryKeys.news.authors()
      );
      if (current) {
        const next = current.filter((a) => a.id !== id);
        queryClient.setQueryData(queryKeys.news.authors(), next);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.authors(),
      });
    },
  });
}

// News Articles
export function useNews(
  params: { page?: number; per_page?: number } = {},
  options?: Omit<
    UseQueryOptions<{
      data: NewsArticleSummary[];
      meta: {
        total: number;
        categories: NewsCategory[];
        authors: NewsAuthor[];
        pagination: {
          current_page: number;
          per_page: number;
          total_pages: number;
          has_next: boolean;
          has_previous: boolean;
        };
      };
    }>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.news.allWithParams(params),
    queryFn: () => newsAPI.getAll(params),
    ...options,
  });
}

export function useNewsArticle(
  id: number,
  options?: Omit<UseQueryOptions<NewsArticle>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.article(id),
    queryFn: () => newsAPI.getById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateNewsArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Partial<NewsArticle> & { author_id: number; category_id: number }
    ) => newsAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.all() });
    },
  });
}

export function useUpdateNewsArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<NewsArticle> & {
        author_id?: number;
        category_id?: number;
      };
    }) => newsAPI.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.article(updated.id),
      });
    },
  });
}

export function useDeleteNewsArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => newsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.all() });
    },
  });
}
