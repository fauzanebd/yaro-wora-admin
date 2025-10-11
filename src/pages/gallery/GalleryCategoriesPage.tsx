import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import GalleryCategoryDialog from "@/components/GalleryCategoryDialog";
import {
  useGalleryCategories,
  useCreateGalleryCategory,
  useUpdateGalleryCategory,
  useDeleteGalleryCategory,
} from "@/hooks/useApi";
import type { GalleryCategory } from "@/types/api";
import type { GalleryCategoryForm } from "@/types/gallery-category-form";

export default function GalleryCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] =
    React.useState<GalleryCategory | null>(null);

  // Query hooks
  const { data: categories, isLoading, error } = useGalleryCategories();

  // Mutation hooks
  const createCategory = useCreateGalleryCategory();
  const updateCategory = useUpdateGalleryCategory();
  const deleteCategory = useDeleteGalleryCategory();

  const openCreateCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const openEditCategory = (cat: GalleryCategory) => {
    setEditingCategory(cat);
    setIsDialogOpen(true);
  };

  const handleCategorySubmit = async (data: GalleryCategoryForm) => {
    try {
      if (editingCategory && editingCategory.id) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          payload: data,
        });
      } else {
        await createCategory.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (e) {
      console.error("Failed to save category", e);
      alert("Failed to save category");
    }
  };

  const handleDeleteCategory = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete category", e);
      alert("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery Categories</h1>
          <p className="text-muted-foreground">
            Manage gallery image categories
          </p>
        </div>
        <GalleryCategoryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          category={editingCategory}
          onSubmit={handleCategorySubmit}
          title={editingCategory ? "Edit Category" : "Add Category"}
          trigger={
            <Button onClick={openCreateCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Categories</CardTitle>
          <CardDescription>All gallery categories</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load gallery categories
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Add your first category to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Name (ID)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.name_id}</TableCell>
                    <TableCell>
                      {category.description ? (
                        <div className="max-w-xs truncate">
                          {category.description}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{category.count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
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
