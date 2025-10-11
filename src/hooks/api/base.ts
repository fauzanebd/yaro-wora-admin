import { type UseQueryOptions } from "@tanstack/react-query";

/**
 * Shared query keys used across all React Query hooks
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

  // Why Visit
  whyVisit: {
    all: () => ["why-visit"] as const,
  },

  // Why Visit Content
  whyVisitContent: {
    get: () => ["why-visit-content"] as const,
  },

  // Attractions
  attractions: {
    all: () => ["attractions"] as const,
  },

  // Attraction Content
  attractionContent: {
    get: () => ["attraction-content"] as const,
  },

  // Pricing
  pricing: {
    all: () => ["pricing"] as const,
  },

  // General Pricing Content
  generalPricingContent: {
    get: () => ["general-pricing-content"] as const,
  },

  // Profile
  profilePageContent: {
    get: () => ["profile-page-content"] as const,
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
    content: () => ["gallery", "content"] as const,
    categories: () => ["gallery", "categories"] as const,
    all: () => ["gallery", "all"] as const,
    allWithParams: (params: { page?: number; per_page?: number } = {}) =>
      ["gallery", "all", params] as const,
    detail: (id: number) => ["gallery", id] as const,
  },

  // News
  news: {
    content: () => ["news", "content"] as const,
    categories: () => ["news", "categories"] as const,
    authors: () => ["news", "authors"] as const,
    author: (id: number) => ["news", "authors", id] as const,
    all: () => ["news", "all"] as const,
    allWithParams: (params: { page?: number; per_page?: number } = {}) =>
      ["news", "all", params] as const,
    articles: () => ["news", "articles"] as const,
    article: (id: number) => ["news", "articles", id] as const,
  },

  // Regulations
  regulations: {
    content: () => ["regulations", "content"] as const,
    categories: () => ["regulations", "categories"] as const,
    all: () => ["regulations", "all"] as const,
    allWithParams: (params: { page?: number; per_page?: number } = {}) =>
      ["regulations", "all", params] as const,
    detail: (id: number) => ["regulations", id] as const,
  },

  // Destinations
  destinations: {
    content: () => ["destinations", "content"] as const,
    categories: () => ["destinations", "categories"] as const,
    all: () => ["destinations", "all"] as const,
    allWithParams: (params: { page?: number; per_page?: number } = {}) =>
      ["destinations", "all", params] as const,
    featured: () => ["destinations", "featured"] as const,
    detail: (id: number) => ["destinations", id] as const,
  },

  // Facilities
  facilities: {
    content: () => ["facilities", "content"] as const,
    categories: () => ["facilities", "categories"] as const,
    all: () => ["facilities", "all"] as const,
    allWithParams: (params: { page?: number; per_page?: number } = {}) =>
      ["facilities", "all", params] as const,
    featured: () => ["facilities", "featured"] as const,
    detail: (id: number) => ["facilities", id] as const,
  },

  // Heritage
  heritage: {
    content: () => ["heritage", "content"] as const,
    all: () => ["heritage", "all"] as const,
    allWithParams: (params: { page?: number; per_page?: number } = {}) =>
      ["heritage", "all", params] as const,
    detail: (id: number) => ["heritage", id] as const,
  },

  // Analytics
  analytics: {
    storage: () => ["analytics", "storage"] as const,
    visitors: (days?: number) => ["analytics", "visitors", days] as const,
  },
} as const;

// Re-export common types used by hooks for convenience if needed externally
export type { UseQueryOptions };
export type {
  AuthUser,
  Carousel,
  SellingPoint,
  WhyVisit,
  WhyVisitContent,
  Attraction,
  GeneralAttractionContent,
  Pricing,
  GeneralPricingContent,
  ProfilePageContent,
  Destination,
  DestinationSummary,
  DestinationCategory,
  DestinationPageContent,
  GalleryCategory,
  GalleryImage,
  GalleryImageSummary,
  GalleryPageContent,
  NewsCategory,
  NewsAuthor,
  NewsArticle,
  NewsArticleSummary,
  NewsPageContent,
  RegulationCategory,
  Regulation,
  Facility,
  FacilitySummary,
  FacilityCategory,
  FacilityPageContent,
  FacilityDetailSection,
  Heritage,
  HeritageSummary,
  HeritagePageContent,
  HeritageDetailSection,
} from "@/types/api";
