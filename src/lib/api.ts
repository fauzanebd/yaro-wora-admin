import type * as API from "@/types/api";

// Get the API URL from environment variable or use default
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

// Fetch wrapper with auth and error handling
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Add auth token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Add Content-Type for JSON requests (except FormData)
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 errors globally
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new ApiError(401, "Unauthorized");
  }

  // Parse response
  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  // Throw error for non-OK responses
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, data);
  }

  return data;
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    return apiFetch<API.LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  getProfile: async () => {
    return apiFetch<API.AuthUser>("/admin/profile");
  },
};

// Carousel API
export const carouselAPI = {
  getAll: async () => {
    try {
      const data = await apiFetch<any>("/carousel");

      // Handle the API response format: { data: [...], meta: {...} }
      let result: API.Carousel[] = [];

      if (Array.isArray(data)) {
        // Direct array response
        result = data;
      } else if (data && typeof data === "object" && Array.isArray(data.data)) {
        // Wrapped response with data property
        result = data.data;
      } else {
        result = [];
      }

      return result;
    } catch (error) {
      console.error("Error fetching carousels from /carousel:", error);

      // Try admin endpoint as fallback
      try {
        const adminData = await apiFetch<any>("/admin/carousel");

        let result: API.Carousel[] = [];
        if (Array.isArray(adminData)) {
          result = adminData;
        } else if (
          adminData &&
          typeof adminData === "object" &&
          Array.isArray(adminData.data)
        ) {
          result = adminData.data;
        } else {
          result = [];
        }

        return result;
      } catch (adminError) {
        console.error(
          "Error fetching carousels from /admin/carousel:",
          adminError
        );
        throw error; // Throw original error
      }
    }
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

// Selling Points API
export const sellingPointsAPI = {
  getAll: async () => {
    try {
      const data = await apiFetch<any>("/selling-points");

      // Handle the API response format: { data: [...], meta: {...} }
      let result: API.SellingPoint[] = [];

      if (Array.isArray(data)) {
        // Direct array response
        result = data;
      } else if (data && typeof data === "object" && Array.isArray(data.data)) {
        // Wrapped response with data property
        result = data.data;
      } else {
        result = [];
      }

      return result;
    } catch (error) {
      console.error(
        "Error fetching selling points from /selling-points:",
        error
      );

      // Try admin endpoint as fallback
      try {
        const adminData = await apiFetch<any>("/admin/selling-points");

        let result: API.SellingPoint[] = [];
        if (Array.isArray(adminData)) {
          result = adminData;
        } else if (
          adminData &&
          typeof adminData === "object" &&
          Array.isArray(adminData.data)
        ) {
          result = adminData.data;
        } else {
          result = [];
        }

        return result;
      } catch (adminError) {
        console.error(
          "Error fetching selling points from /admin/selling-points:",
          adminError
        );
        throw error; // Throw original error
      }
    }
  },
  create: async (sellingPoint: Partial<API.SellingPoint>) => {
    return apiFetch<API.SellingPoint>("/admin/selling-points", {
      method: "POST",
      body: JSON.stringify(sellingPoint),
    });
  },
  update: async (id: number, sellingPoint: Partial<API.SellingPoint>) => {
    return apiFetch<API.SellingPoint>(`/admin/selling-points/${id}`, {
      method: "PUT",
      body: JSON.stringify(sellingPoint),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/selling-points/${id}`, {
      method: "DELETE",
    });
  },
};

// Why Visit API
export const whyVisitAPI = {
  getAll: async () => {
    try {
      const data = await apiFetch<any>("/why-visit");

      // Handle the API response format: { data: [...], meta: {...} }
      let result: API.WhyVisit[] = [];

      if (Array.isArray(data)) {
        // Direct array response
        result = data;
      } else if (data && typeof data === "object" && Array.isArray(data.data)) {
        // Wrapped response with data property
        result = data.data;
      } else {
        result = [];
      }

      return result;
    } catch (error) {
      console.error("Error fetching why visit from /why-visit:", error);

      // Try admin endpoint as fallback
      try {
        const adminData = await apiFetch<any>("/admin/why-visit");

        let result: API.WhyVisit[] = [];
        if (Array.isArray(adminData)) {
          result = adminData;
        } else if (
          adminData &&
          typeof adminData === "object" &&
          Array.isArray(adminData.data)
        ) {
          result = adminData.data;
        } else {
          result = [];
        }

        return result;
      } catch (adminError) {
        console.error(
          "Error fetching why visit from /admin/why-visit:",
          adminError
        );
        throw error; // Throw original error
      }
    }
  },
  create: async (whyVisit: Partial<API.WhyVisit>) => {
    return apiFetch<API.WhyVisit>("/admin/why-visit", {
      method: "POST",
      body: JSON.stringify(whyVisit),
    });
  },
  update: async (id: number, whyVisit: Partial<API.WhyVisit>) => {
    return apiFetch<API.WhyVisit>(`/admin/why-visit/${id}`, {
      method: "PUT",
      body: JSON.stringify(whyVisit),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/why-visit/${id}`, {
      method: "DELETE",
    });
  },
};

// Why Visit Content API
export const whyVisitContentAPI = {
  get: async () => {
    const response = await apiFetch<any>("/why-visit-content");

    // Handle potential wrapped response
    if (response && typeof response === "object" && response.data) {
      return response.data;
    }

    return response;
  },
  update: async (content: Partial<API.WhyVisitContent>) => {
    const response = await apiFetch<any>("/admin/why-visit-content", {
      method: "PUT",
      body: JSON.stringify(content),
    });

    // Handle potential wrapped response
    if (response && typeof response === "object" && response.data) {
      return response.data;
    }

    return response;
  },
};

// Attractions API
export const attractionsAPI = {
  getAll: async () => {
    const data = await apiFetch<API.Attraction[]>("/attractions");
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
  },
  create: async (attraction: Partial<API.Attraction>) => {
    return apiFetch<API.Attraction>("/admin/attractions", {
      method: "POST",
      body: JSON.stringify(attraction),
    });
  },
  update: async (id: string, attraction: Partial<API.Attraction>) => {
    return apiFetch<API.Attraction>(`/admin/attractions/${id}`, {
      method: "PUT",
      body: JSON.stringify(attraction),
    });
  },
  delete: async (id: string) => {
    return apiFetch(`/admin/attractions/${id}`, {
      method: "DELETE",
    });
  },
};

// Pricing API
export const pricingAPI = {
  getAll: async () => {
    const response = await apiFetch<any>("/pricing");

    // Handle different response formats
    // If response has a 'data' property with pricing objects
    if (response && response.data && typeof response.data === "object") {
      // Convert object of pricing types to array, preserving the type key
      const pricingsArray = Object.entries(response.data).map(
        ([type, pricing]: [string, any]) => ({
          ...pricing,
          type, // Add the type from the object key
        })
      ) as API.Pricing[];
      return pricingsArray;
    }

    // If it's already an array
    if (Array.isArray(response)) {
      return response as API.Pricing[];
    }

    // Fallback to empty array
    return [];
  },
  update: async (pricing: Partial<API.Pricing>) => {
    return apiFetch<API.Pricing>("/admin/pricing", {
      method: "PUT",
      body: JSON.stringify(pricing),
    });
  },
};

// General Pricing Content API
export const generalPricingContentAPI = {
  get: async () => {
    const response = await apiFetch<any>("/pricing-content");

    // Handle potential wrapped response
    if (response && typeof response === "object" && response.data) {
      return response.data;
    }

    return response;
  },
  update: async (content: Partial<API.GeneralPricingContent>) => {
    const response = await apiFetch<any>("/admin/pricing-content", {
      method: "PUT",
      body: JSON.stringify(content),
    });

    // Handle potential wrapped response
    if (response && typeof response === "object" && response.data) {
      return response.data;
    }

    return response;
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    return apiFetch<API.Profile>("/profile");
  },
  update: async (profile: Partial<API.Profile>) => {
    return apiFetch<API.Profile>("/admin/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  },
};

// Contact API
export const contactAPI = {
  getAll: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    return apiFetch(`/admin/contacts${queryString}`);
  },
  getById: async (id: number) => {
    return apiFetch(`/admin/contacts/${id}`);
  },
  updateStatus: async (id: number, status: string, admin_notes?: string) => {
    return apiFetch<API.ContactSubmission>(`/admin/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, admin_notes }),
    });
  },
};

// Booking API
export const bookingAPI = {
  getAll: async (params?: { status?: string; facility_id?: number }) => {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    return apiFetch(`/admin/bookings${queryString}`);
  },
  updateStatus: async (id: number, status: string) => {
    return apiFetch<API.Booking>(`/admin/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// Gallery API
export const galleryAPI = {
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

// News API
export const newsAPI = {
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

// Regulations API
export const regulationsAPI = {
  // Categories
  getAllCategories: async () => {
    const data = await apiFetch<API.RegulationCategory[]>(
      "/regulations/categories"
    );
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
  },
  createCategory: async (category: Partial<API.RegulationCategory>) => {
    return apiFetch<API.RegulationCategory>("/admin/regulations/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  },
  updateCategory: async (
    id: number,
    category: Partial<API.RegulationCategory>
  ) => {
    return apiFetch<API.RegulationCategory>(
      `/admin/regulations/categories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(category),
      }
    );
  },
  deleteCategory: async (id: number) => {
    return apiFetch(`/admin/regulations/categories/${id}`, {
      method: "DELETE",
    });
  },

  // Regulations
  getAll: async () => {
    const data = await apiFetch<API.Regulation[]>("/regulations");
    // Ensure we always return an array, even if API returns unexpected data
    return Array.isArray(data) ? data : [];
  },
  create: async (regulation: Partial<API.Regulation>) => {
    return apiFetch<API.Regulation>("/admin/regulations", {
      method: "POST",
      body: JSON.stringify(regulation),
    });
  },
  update: async (id: number, regulation: Partial<API.Regulation>) => {
    return apiFetch<API.Regulation>(`/admin/regulations/${id}`, {
      method: "PUT",
      body: JSON.stringify(regulation),
    });
  },
  delete: async (id: number) => {
    return apiFetch(`/admin/regulations/${id}`, {
      method: "DELETE",
    });
  },
};

// Upload API
export const uploadAPI = {
  upload: async (file: File, folder: string = "uploads") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return apiFetch<API.UploadResponse>("/admin/content/upload", {
      method: "POST",
      body: formData,
    });
  },
};
