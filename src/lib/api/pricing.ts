import type * as API from "@/types/api";
import { apiFetch } from "./base";

// Pricing API
interface PricingGetAllResponse {
  data: API.Pricing[];
}
export const pricingAPI = {
  getAll: async () => {
    const response = await apiFetch<PricingGetAllResponse>("/pricing");
    if (Array.isArray(response.data)) {
      return response.data;
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
interface GeneralPricingContentGetResponse {
  data: API.GeneralPricingContent;
}
export const generalPricingContentAPI = {
  get: async () => {
    const response = await apiFetch<GeneralPricingContentGetResponse>(
      "/pricing-content"
    );
    return response.data;
  },
  update: async (content: Partial<API.GeneralPricingContent>) => {
    const response = await apiFetch<GeneralPricingContentGetResponse>(
      "/admin/pricing-content",
      {
        method: "PUT",
        body: JSON.stringify(content),
      }
    );

    return response.data;
  },
};
