import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactAPI } from "@/lib/api";
import { queryKeys } from "./base";

export function useContacts(
  params?: { status?: string; limit?: number; offset?: number },
  options?: Omit<
    import("@tanstack/react-query").UseQueryOptions<any>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.contact.all(params),
    queryFn: () => contactAPI.getAll(params),
    ...options,
  });
}

export function useContact(
  id: number,
  options?: Omit<
    import("@tanstack/react-query").UseQueryOptions<any>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.contact.detail(id),
    queryFn: () => contactAPI.getById(id),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      admin_notes,
    }: {
      id: number;
      status: string;
      admin_notes?: string;
    }) => contactAPI.updateStatus(id, status, admin_notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
