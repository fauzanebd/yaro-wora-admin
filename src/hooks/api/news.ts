import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { NewsCategory, NewsArticle, UseQueryOptions } from "./base";

// Categories
export function useNewsCategories(
  options?: Omit<UseQueryOptions<NewsCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.categories(),
    queryFn: newsAPI.getAllCategories,
    ...options,
  });
}

export function useCreateNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Partial<NewsCategory>) =>
      newsAPI.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.categories() });
    },
  });
}

export function useUpdateNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: number;
      category: Partial<NewsCategory>;
    }) => newsAPI.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.categories() });
    },
  });
}

export function useDeleteNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => newsAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.categories() });
    },
  });
}

// Articles
export function useNewsArticles(
  options?: Omit<UseQueryOptions<NewsArticle[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.articles(),
    queryFn: newsAPI.getAllArticles,
    ...options,
  });
}

export function useNewsArticle(
  id: number,
  options?: Omit<UseQueryOptions<NewsArticle>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.article(id),
    queryFn: () => newsAPI.getArticle(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateNewsArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (article: Partial<NewsArticle>) =>
      newsAPI.createArticle(article),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.articles() });
    },
  });
}

export function useUpdateNewsArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      article,
    }: {
      id: number;
      article: Partial<NewsArticle>;
    }) => newsAPI.updateArticle(id, article),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.articles() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.news.article(variables.id),
      });
    },
  });
}

export function useDeleteNewsArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => newsAPI.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.news.articles() });
    },
  });
}
