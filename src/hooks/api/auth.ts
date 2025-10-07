import { useMutation, useQuery } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";
import { queryKeys } from "./base";
import type { AuthUser, UseQueryOptions } from "./base";

export function useAuthProfile(
  options?: Omit<UseQueryOptions<AuthUser>, "queryKey" | "queryFn">
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
