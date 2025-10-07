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
  Profile,
  GalleryCategory,
  GalleryImage,
  NewsCategory,
  NewsArticle,
  RegulationCategory,
  Regulation,
} from "@/types/api";
