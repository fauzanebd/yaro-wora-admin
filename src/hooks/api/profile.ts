import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "@/lib/api/profile";
import {
  queryKeys,
  type ProfilePageContent,
  type UseQueryOptions,
} from "./base";

// Profile hooks
export function useProfile(
  options?: Omit<UseQueryOptions<ProfilePageContent>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.profilePageContent.get(),
    queryFn: profileAPI.get,
    // Disable refetch on window focus to prevent annoying loading states
    // when profile data doesn't exist yet (404)
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfilePageContent) => profileAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profilePageContent.get(),
      });
    },
  });
}
