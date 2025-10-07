import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attractionContentAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { GeneralAttractionContent, UseQueryOptions } from "./base";

export function useAttractionContent(
  options?: Omit<
    UseQueryOptions<GeneralAttractionContent>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.attractionContent.get(),
    queryFn: attractionContentAPI.get,
    ...options,
  });
}

export function useUpdateAttractionContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: Partial<GeneralAttractionContent>) =>
      attractionContentAPI.update(content),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.attractionContent.get(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.attractionContent.get(),
      });
    },
  });
}
