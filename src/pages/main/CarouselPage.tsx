import { useState } from "react";
import {
  useCarousel,
  useCreateCarousel,
  useUpdateCarousel,
  useDeleteCarousel,
} from "@/hooks/useApi";
import type { Carousel } from "@/types/api";
import { Button } from "@/components/ui/button";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import CarouselDialog from "@/components/CarouselDialog";

export default function CarouselPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);

  // Query hooks
  const { data: carouselsData, isLoading, error } = useCarousel();

  // Ensure carousels is always an array
  const carousels = Array.isArray(carouselsData) ? carouselsData : [];

  // Mutation hooks
  const createCarousel = useCreateCarousel();
  const updateCarousel = useUpdateCarousel();
  const deleteCarousel = useDeleteCarousel();

  const onSubmit = async (data: any) => {
    try {
      const carouselData = {
        ...data,
        carousel_order: parseInt(data.carousel_order, 10),
      };

      if (editingCarousel) {
        await updateCarousel.mutateAsync({
          id: editingCarousel.id,
          carousel: carouselData,
        });
      } else {
        await createCarousel.mutateAsync(carouselData);
      }
      setIsDialogOpen(false);
      setEditingCarousel(null);
    } catch (error) {
      console.error("Failed to save carousel:", error);
      alert("Failed to save carousel");
    }
  };

  const handleEdit = (carousel: Carousel) => {
    setEditingCarousel(carousel);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this carousel slide?"))
      return;
    try {
      await deleteCarousel.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete carousel:", error);
      alert("Failed to delete carousel");
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Dialog is closing, reset state
      setEditingCarousel(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Carousel Management</h1>
          <p className="text-muted-foreground">
            Manage homepage carousel slides
          </p>
        </div>
        <CarouselDialog
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          editingCarousel={editingCarousel}
          onSubmit={onSubmit}
          trigger={
            <Button
              onClick={() => {
                setEditingCarousel(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Carousel Slides</CardTitle>
          <CardDescription>
            All carousel slides sorted by display order
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load carousel data
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : carousels.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No carousel slides found. Add your first slide to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carousels
                  .sort((a, b) => a.carousel_order - b.carousel_order)
                  .map((carousel) => (
                    <TableRow key={carousel.id}>
                      <TableCell>{carousel.carousel_order}</TableCell>
                      <TableCell>
                        <img
                          src={carousel.image_url}
                          alt={carousel.alt_text}
                          className="h-12 w-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {carousel.title}
                      </TableCell>
                      <TableCell>{carousel.subtitle || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={carousel.is_active ? "default" : "secondary"}
                        >
                          {carousel.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(carousel)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(carousel.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
