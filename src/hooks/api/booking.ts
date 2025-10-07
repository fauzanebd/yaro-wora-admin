import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingAPI } from "@/lib/api";
import { queryKeys } from "./base";

export function useBookings(
  params?: { status?: string; facility_id?: number },
  options?: Omit<
    import("@tanstack/react-query").UseQueryOptions<any>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: queryKeys.booking.all(params),
    queryFn: () => bookingAPI.getAll(params),
    ...options,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      bookingAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
