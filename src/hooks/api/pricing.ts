import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pricingAPI, generalPricingContentAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { Pricing, GeneralPricingContent, UseQueryOptions } from "./base";

// Pricing
export function usePricing(
  options?: Omit<UseQueryOptions<Pricing[]>, "queryKey" | "queryFn">
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
    mutationFn: (pricing: Partial<Pricing>) => pricingAPI.update(pricing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.all() });
    },
  });
}

// General Pricing Content
export function useGeneralPricingContent(
  options?: Omit<UseQueryOptions<GeneralPricingContent>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.generalPricingContent.get(),
    queryFn: generalPricingContentAPI.get,
    ...options,
  });
}

export function useUpdateGeneralPricingContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: Partial<GeneralPricingContent>) =>
      generalPricingContentAPI.update(content),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.generalPricingContent.get(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.generalPricingContent.get(),
      });
    },
  });
}
