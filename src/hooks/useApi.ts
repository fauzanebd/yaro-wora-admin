/**
 * TanStack Query Hooks for Admin Dashboard API
 * All API calls use React Query for better caching, loading states, and data synchronization
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  authAPI,
  carouselAPI,
  sellingPointsAPI,
  attractionsAPI,
  pricingAPI,
  profileAPI,
  contactAPI,
  bookingAPI,
  galleryAPI,
  newsAPI,
  regulationsAPI,
  uploadAPI,
} from "@/lib/api";
import type * as API from "@/types/api";

/**
 * Query Keys Factory
 * Centralized query key management for consistent cache invalidation
 */
export const queryKeys = {
  // Auth
  auth: {
    profile: ["auth", "profile"] as const,
  },

  // Carousel
  carousel: {
    all: () => ["carousel"] as const,
  },

  // Selling Points
  sellingPoints: {
    all: () => ["selling-points"] as const,
  },

  // Attractions
  attractions: {
    all: () => ["attractions"] as const,
  },

  // Pricing
  pricing: {
    all: () => ["pricing"] as const,
  },

  // Profile
  profile: {
    get: () => ["profile"] as const,
  },

  // Contact
  contact: {
    all: (params?: { status?: string; limit?: number; offset?: number }) =>
      ["contacts", params] as const,
    detail: (id: number) => ["contacts", id] as const,
  },

  // Booking
  booking: {
    all: (params?: { status?: string; facility_id?: number }) =>
      ["bookings", params] as const,
  },

  // Gallery
  gallery: {
    categories: () => ["gallery", "categories"] as const,
    images: () => ["gallery", "images"] as const,
  },

  // News
  news: {
    categories: () => ["news", "categories"] as const,
    articles: () => ["news", "articles"] as const,
    article: (id: number) => ["news", "articles", id] as const,
  },

  // Regulations
  regulations: {
    categories: () => ["regulations", "categories"] as const,
    all: () => ["regulations"] as const,
  },
};

// ==================== AUTH HOOKS ====================

export function useAuthProfile(
  options?: Omit<UseQueryOptions<API.AuthUser>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authAPI.getProfile,
    ...options,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => authAPI.login(username, password),
  });
}

// ==================== CAROUSEL HOOKS ====================

export function useCarousel(
  options?: Omit<UseQueryOptions<API.Carousel[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.carousel.all(),
    queryFn: carouselAPI.getAll,
    ...options,
  });
}

export function useCreateCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (carousel: Partial<API.Carousel>) =>
      carouselAPI.create(carousel),
    onSuccess: (data) => {
      // Get current carousel data from cache
      const currentData = queryClient.getQueryData<API.Carousel[]>(
        queryKeys.carousel.all()
      );

      // Update cache with new carousel
      const newData = currentData ? [...currentData, data] : [data];
      queryClient.setQueryData(queryKeys.carousel.all(), newData);

      // Also invalidate to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: queryKeys.carousel.all() });
    },
  });
}

export function useUpdateCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      carousel,
    }: {
      id: number;
      carousel: Partial<API.Carousel>;
    }) => carouselAPI.update(id, carousel),
    onSuccess: (data) => {
      // Get current carousel data from cache
      const currentData = queryClient.getQueryData<API.Carousel[]>(
        queryKeys.carousel.all()
      );

      if (currentData) {
        // Update the specific carousel in the cache
        const updatedData = currentData.map((item) =>
          item.id === data.id ? data : item
        );
        queryClient.setQueryData(queryKeys.carousel.all(), updatedData);
      }

      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.carousel.all() });
    },
  });
}

export function useDeleteCarousel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => carouselAPI.delete(id),
    onSuccess: (_, variables) => {
      // Get current carousel data from cache
      const currentData = queryClient.getQueryData<API.Carousel[]>(
        queryKeys.carousel.all()
      );

      if (currentData) {
        // Remove the deleted carousel from cache
        const updatedData = currentData.filter((item) => item.id !== variables);
        queryClient.setQueryData(queryKeys.carousel.all(), updatedData);
      }

      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.carousel.all() });
    },
  });
}

// ==================== SELLING POINTS HOOKS ====================

export function useSellingPoints(
  options?: Omit<UseQueryOptions<API.SellingPoint[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.sellingPoints.all(),
    queryFn: sellingPointsAPI.getAll,
    ...options,
  });
}

export function useCreateSellingPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sellingPoint: Partial<API.SellingPoint>) =>
      sellingPointsAPI.create(sellingPoint),
    onSuccess: (data) => {
      // Get current selling points data from cache
      const currentData = queryClient.getQueryData<API.SellingPoint[]>(
        queryKeys.sellingPoints.all()
      );

      // Update cache with new selling point
      const newData = currentData ? [...currentData, data] : [data];
      queryClient.setQueryData(queryKeys.sellingPoints.all(), newData);

      // Also invalidate to ensure fresh data on next fetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.sellingPoints.all(),
      });
    },
  });
}

export function useUpdateSellingPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      sellingPoint,
    }: {
      id: number;
      sellingPoint: Partial<API.SellingPoint>;
    }) => sellingPointsAPI.update(id, sellingPoint),
    onSuccess: (data) => {
      // Get current selling points data from cache
      const currentData = queryClient.getQueryData<API.SellingPoint[]>(
        queryKeys.sellingPoints.all()
      );

      if (currentData) {
        // Update the specific selling point in the cache
        const updatedData = currentData.map((item) =>
          item.id === data.id ? data : item
        );
        queryClient.setQueryData(queryKeys.sellingPoints.all(), updatedData);
      }

      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: queryKeys.sellingPoints.all(),
      });
    },
  });
}

export function useDeleteSellingPoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sellingPointsAPI.delete(id),
    onSuccess: (_, variables) => {
      // Get current selling points data from cache
      const currentData = queryClient.getQueryData<API.SellingPoint[]>(
        queryKeys.sellingPoints.all()
      );

      if (currentData) {
        // Remove the deleted selling point from cache
        const updatedData = currentData.filter((item) => item.id !== variables);
        queryClient.setQueryData(queryKeys.sellingPoints.all(), updatedData);
      }

      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: queryKeys.sellingPoints.all(),
      });
    },
  });
}

// ==================== ATTRACTIONS HOOKS ====================

export function useAttractions(
  options?: Omit<UseQueryOptions<API.Attraction[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.attractions.all(),
    queryFn: attractionsAPI.getAll,
    ...options,
  });
}

export function useCreateAttraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attraction: Partial<API.Attraction>) =>
      attractionsAPI.create(attraction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attractions.all() });
    },
  });
}

export function useUpdateAttraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      attraction,
    }: {
      id: string;
      attraction: Partial<API.Attraction>;
    }) => attractionsAPI.update(id, attraction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attractions.all() });
    },
  });
}

export function useDeleteAttraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attractionsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attractions.all() });
    },
  });
}

// ==================== PRICING HOOKS ====================

export function usePricing(
  options?: Omit<UseQueryOptions<API.Pricing[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.pricing.all(),
    queryFn: pricingAPI.getAll,
    ...options,
  });
}

export function useUpdatePricing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pricing: Partial<API.Pricing>) => pricingAPI.update(pricing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.all() });
    },
  });
}

// ==================== PROFILE HOOKS ====================

export function useProfile(
  options?: Omit<UseQueryOptions<API.Profile>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.profile.get(),
    queryFn: profileAPI.get,
    ...options,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Partial<API.Profile>) => profileAPI.update(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
    },
  });
}

// ==================== CONTACT HOOKS ====================

export function useContacts(
  params?: { status?: string; limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.contact.all(params),
    queryFn: () => contactAPI.getAll(params),
    ...options,
  });
}

export function useContact(
  id: number,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.contact.detail(id),
    queryFn: () => contactAPI.getById(id),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      admin_notes,
    }: {
      id: number;
      status: string;
      admin_notes?: string;
    }) => contactAPI.updateStatus(id, status, admin_notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

// ==================== BOOKING HOOKS ====================

export function useBookings(
  params?: { status?: string; facility_id?: number },
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.booking.all(params),
    queryFn: () => bookingAPI.getAll(params),
    ...options,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      bookingAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

// ==================== GALLERY HOOKS ====================

// Gallery Categories
export function useGalleryCategories(
  options?: Omit<UseQueryOptions<API.GalleryCategory[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.gallery.categories(),
    queryFn: galleryAPI.getAllCategories,
    ...options,
  });
}

export function useCreateGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Partial<API.GalleryCategory>) =>
      galleryAPI.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.categories(),
      });
    },
  });
}

export function useUpdateGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: number;
      category: Partial<API.GalleryCategory>;
    }) => galleryAPI.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.categories(),
      });
    },
  });
}

export function useDeleteGalleryCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => galleryAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.gallery.categories(),
      });
    },
  });
}

// Gallery Images
export function useGalleryImages(
  options?: Omit<UseQueryOptions<API.GalleryImage[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.gallery.images(),
    queryFn: galleryAPI.getAllImages,
    ...options,
  });
}

export function useCreateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (image: Partial<API.GalleryImage>) =>
      galleryAPI.createImage(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.images() });
    },
  });
}

export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      image,
    }: {
      id: number;
      image: Partial<API.GalleryImage>;
    }) => galleryAPI.updateImage(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.images() });
    },
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => galleryAPI.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.images() });
    },
  });
}

// ==================== NEWS HOOKS ====================

// News Categories
export function useNewsCategories(
  options?: Omit<UseQueryOptions<API.NewsCategory[]>, "queryKey" | "queryFn">
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
    mutationFn: (category: Partial<API.NewsCategory>) =>
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
      category: Partial<API.NewsCategory>;
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

// News Articles
export function useNewsArticles(
  options?: Omit<UseQueryOptions<API.NewsArticle[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.news.articles(),
    queryFn: newsAPI.getAllArticles,
    ...options,
  });
}

export function useNewsArticle(
  id: number,
  options?: Omit<UseQueryOptions<API.NewsArticle>, "queryKey" | "queryFn">
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
    mutationFn: (article: Partial<API.NewsArticle>) =>
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
      article: Partial<API.NewsArticle>;
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

// ==================== REGULATIONS HOOKS ====================

// Regulation Categories
export function useRegulationCategories(
  options?: Omit<
    UseQueryOptions<API.RegulationCategory[]>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.regulations.categories(),
    queryFn: regulationsAPI.getAllCategories,
    ...options,
  });
}

export function useCreateRegulationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Partial<API.RegulationCategory>) =>
      regulationsAPI.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.categories(),
      });
    },
  });
}

export function useUpdateRegulationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: number;
      category: Partial<API.RegulationCategory>;
    }) => regulationsAPI.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.categories(),
      });
    },
  });
}

export function useDeleteRegulationCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => regulationsAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.regulations.categories(),
      });
    },
  });
}

// Regulations
export function useRegulations(
  options?: Omit<UseQueryOptions<API.Regulation[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.regulations.all(),
    queryFn: regulationsAPI.getAll,
    ...options,
  });
}

export function useCreateRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (regulation: Partial<API.Regulation>) =>
      regulationsAPI.create(regulation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
    },
  });
}

export function useUpdateRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      regulation,
    }: {
      id: number;
      regulation: Partial<API.Regulation>;
    }) => regulationsAPI.update(id, regulation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
    },
  });
}

export function useDeleteRegulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => regulationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.regulations.all() });
    },
  });
}

// ==================== UPLOAD HOOKS ====================

export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, folder }: { file: File; folder?: string }) =>
      uploadAPI.upload(file, folder),
  });
}
