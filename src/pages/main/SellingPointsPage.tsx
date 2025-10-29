import { useState } from "react";
import {
  useSellingPoints,
  useCreateSellingPoint,
  useUpdateSellingPoint,
  useDeleteSellingPoint,
} from "@/hooks/useApi";
import type { SellingPoint } from "@/types/api";
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
import SellingPointDialog from "@/components/SellingPointDialog";

export default function SellingPointsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSellingPoint, setEditingSellingPoint] =
    useState<SellingPoint | null>(null);

  // Query hooks
  const { data: sellingPointsData, isLoading, error } = useSellingPoints();

  // Ensure sellingPoints is always an array
  const sellingPoints = Array.isArray(sellingPointsData)
    ? sellingPointsData
    : [];

  // Mutation hooks
  const createSellingPoint = useCreateSellingPoint();
  const updateSellingPoint = useUpdateSellingPoint();
  const deleteSellingPoint = useDeleteSellingPoint();

  const onSubmit = async (data: any) => {
    try {
      const sellingPointData = {
        ...data,
        selling_point_order: parseInt(data.selling_point_order, 10),
      };

      if (editingSellingPoint) {
        await updateSellingPoint.mutateAsync({
          id: editingSellingPoint.id,
          sellingPoint: sellingPointData,
        });
      } else {
        await createSellingPoint.mutateAsync(sellingPointData);
      }
      setIsDialogOpen(false);
      setEditingSellingPoint(null);
    } catch (error) {
      console.error("Failed to save selling point:", error);
      alert("Failed to save selling point");
    }
  };

  const handleEdit = (sellingPoint: SellingPoint) => {
    setEditingSellingPoint(sellingPoint);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this selling point?")) return;
    try {
      await deleteSellingPoint.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete selling point:", error);
      alert("Failed to delete selling point");
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Dialog is closing, reset state
      setEditingSellingPoint(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Selling Points Management</h1>
          <p className="text-muted-foreground">
            Manage homepage selling points
          </p>
        </div>
        <SellingPointDialog
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          editingSellingPoint={editingSellingPoint}
          onSubmit={onSubmit}
          trigger={
            <Button
              onClick={() => {
                setEditingSellingPoint(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Selling Point
            </Button>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selling Points</CardTitle>
          <CardDescription>
            All selling points sorted by display order
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load selling points data
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : sellingPoints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No selling points found. Add your first selling point to get
              started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellingPoints
                  .sort((a, b) => a.selling_point_order - b.selling_point_order)
                  .map((sellingPoint) => (
                    <TableRow key={sellingPoint.id}>
                      <TableCell>{sellingPoint.selling_point_order}</TableCell>
                      <TableCell>
                        <img
                          src={sellingPoint.thumbnail_url}
                          alt={sellingPoint.title}
                          aria-label={sellingPoint.title}
                          className="h-12 w-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {sellingPoint.title}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {sellingPoint.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sellingPoint.is_active ? "default" : "secondary"
                          }
                        >
                          {sellingPoint.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(sellingPoint)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(sellingPoint.id)}
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
