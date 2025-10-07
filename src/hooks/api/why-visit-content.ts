import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { whyVisitContentAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { WhyVisitContent, UseQueryOptions } from "./base";

export function useWhyVisitContent(
  options?: Omit<UseQueryOptions<WhyVisitContent>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.whyVisitContent.get(),
    queryFn: whyVisitContentAPI.get,
    ...options,
  });
}

export function useUpdateWhyVisitContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: Partial<WhyVisitContent>) =>
      whyVisitContentAPI.update(content),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.whyVisitContent.get(), data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.whyVisitContent.get(),
      });
    },
  });
}
