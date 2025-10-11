import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactInfoAPI, contactContentAPI } from "@/lib/api/contact";
import type { ContactInfo, ContactContent } from "@/types/api";

// Contact Info hooks
export function useContactInfo(
  options?: Omit<
    import("@tanstack/react-query").UseQueryOptions<ContactInfo>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: ["contact-info"],
    queryFn: () => contactInfoAPI.get(),
    ...options,
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactInfo) => contactInfoAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-info"] });
    },
  });
}

// Contact Content hooks
export function useContactContent(
  options?: Omit<
    import("@tanstack/react-query").UseQueryOptions<ContactContent>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: ["contact-content"],
    queryFn: () => contactContentAPI.get(),
    ...options,
  });
}

export function useUpdateContactContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactContent) => contactContentAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-content"] });
    },
  });
}
