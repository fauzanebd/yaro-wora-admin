import { useBookings, useUpdateBookingStatus } from "@/hooks/useApi";
import type { Booking } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactBookingsPage() {
  // Query hooks
  const { data: response, isLoading, error } = useBookings();

  // Ensure bookings is always an array
  const bookings = Array.isArray(response?.data) ? response.data : [];

  // Mutation hooks
  const updateBookingStatus = useUpdateBookingStatus();

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateBookingStatus.mutateAsync({ id, status });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "default",
      confirmed: "secondary",
      completed: "outline",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Facility Bookings</h1>
        <p className="text-muted-foreground">
          Manage facility booking requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            Booking requests from website visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load bookings
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: Booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {new Date(booking.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {booking.name}
                    </TableCell>
                    <TableCell>{booking.facility?.name || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(booking.start_date).toLocaleDateString()} -{" "}
                      {new Date(booking.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{booking.guests}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onValueChange={(val) =>
                          handleStatusUpdate(booking.id, val)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
