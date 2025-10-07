import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { Profile, UseQueryOptions } from "./base";

export function useProfile(
  options?: Omit<UseQueryOptions<Profile>, "queryKey" | "queryFn">
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
    mutationFn: (profile: Partial<Profile>) => profileAPI.update(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
    },
  });
}
