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
import GalleryContentDialog from "@/components/GalleryContentDialog";
import GalleryCategoryDialog from "@/components/GalleryCategoryDialog";
import GalleryDialog from "@/components/GalleryDialog";
import {
  useGalleryContent,
  useUpdateGalleryContent,
  useGalleryCategories,
  useCreateGalleryCategory,
  useUpdateGalleryCategory,
  useDeleteGalleryCategory,
  useGalleryImages,
  useGalleryImageDetail,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
} from "@/hooks/useApi";
import type { GalleryCategory } from "@/types/api";
import type { GalleryForm } from "@/types/gallery-form";
import type { GalleryCategoryForm } from "@/types/gallery-category-form";

export default function GalleryImagesPage() {
  // Dialog states
  const [isContentDialogOpen, setIsContentDialogOpen] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] =
    React.useState<GalleryCategory | null>(null);

  // Queries
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useGalleryContent();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGalleryCategories();

  // Mutations
  const updateContent = useUpdateGalleryContent();
  const createCategory = useCreateGalleryCategory();
  const updateCategory = useUpdateGalleryCategory();
  const deleteCategory = useDeleteGalleryCategory();

  // Gallery Images
  const [page, setPage] = React.useState(1);
  const [perPage] = React.useState(10);
  const {
    data: imagesResp,
    isLoading: imagesLoading,
    error: imagesError,
  } = useGalleryImages({ page, per_page: perPage });
  const images = imagesResp?.data || [];
  const pagination = imagesResp?.meta?.pagination;
  const createImage = useCreateGalleryImage();
  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const [editingImageId, setEditingImageId] = React.useState<number | null>(
    null
  );

  // Fetch full image when editing
  const { data: editingImage } = useGalleryImageDetail(editingImageId || 0, {
    enabled: !!editingImageId,
  });

  const handleContentSubmit = async (data: any) => {
    try {
      await updateContent.mutateAsync(data);
      setIsContentDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save gallery content");
    }
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: GalleryCategory) => {
    setEditingCategory(cat);
    setIsCategoryDialogOpen(true);
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
      setIsCategoryDialogOpen(false);
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

  const openCreateImage = () => {
    setEditingImageId(null);
    setIsImageDialogOpen(true);
  };

  const openEditImage = (img: { id: number }) => {
    setEditingImageId(img.id);
    setIsImageDialogOpen(true);
  };

  const handleImageSubmit = async (data: GalleryForm) => {
    try {
      if (editingImageId) {
        await updateImage.mutateAsync({
          id: editingImageId,
          payload: data,
        });
      } else {
        await createImage.mutateAsync(data);
      }
      setIsImageDialogOpen(false);
      setEditingImageId(null);
    } catch (e) {
      console.error("Failed to save image", e);
      alert("Failed to save image");
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteImage.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete image", e);
      alert("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">
            Manage gallery page content and images
          </p>
        </div>
      </div>

      {/* Page Content Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>
                Manage header content for the gallery page
              </CardDescription>
            </div>
            <GalleryContentDialog
              open={isContentDialogOpen}
              onOpenChange={setIsContentDialogOpen}
              content={content || null}
              onSubmit={handleContentSubmit}
              trigger={
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {contentLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : contentError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load content
              </p>
              <p className="text-sm text-muted-foreground">
                {contentError instanceof Error
                  ? contentError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : content ? (
            <div className="space-y-4">
              {content.hero_image_url && (
                <img
                  src={content.hero_image_url}
                  alt="Hero"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Title (EN)
                  </h3>
                  <p className="text-lg">{content.title}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Title (ID)
                  </h3>
                  <p className="text-lg">{content.title_id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Subtitle (EN)
                  </h3>
                  <p className="text-sm">{content.subtitle}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Subtitle (ID)
                  </h3>
                  <p className="text-sm">{content.subtitle_id}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No content found. Click "Edit Content" to add content.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Images Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>Manage gallery images</CardDescription>
            </div>
            <GalleryDialog
              open={isImageDialogOpen}
              onOpenChange={setIsImageDialogOpen}
              editingImage={editingImage || null}
              onSubmit={handleImageSubmit}
              trigger={
                <Button onClick={openCreateImage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {imagesLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : imagesError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load images
              </p>
              <p className="text-sm text-muted-foreground">
                {imagesError instanceof Error
                  ? imagesError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !images || images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No images found. Click "Add Image" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((img) => (
                  <TableRow key={img.id}>
                    <TableCell>
                      <img
                        src={img.thumbnail_url || img.image_url}
                        alt={img.title}
                        className="h-12 w-20 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{img.title}</TableCell>
                    <TableCell>
                      {img.gallery_category ? (
                        <div className="flex items-center gap-2">
                          {img.gallery_category.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No category
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(img.date_uploaded).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditImage(img)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(img.id)}
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {pagination?.current_page ?? page} of{" "}
              {pagination?.total_pages ?? 1}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={!(pagination?.has_previous ?? page > 1)}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!(pagination?.has_next ?? false)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gallery Categories</CardTitle>
              <CardDescription>
                Manage categories for gallery images
              </CardDescription>
            </div>
            <GalleryCategoryDialog
              open={isCategoryDialogOpen}
              onOpenChange={setIsCategoryDialogOpen}
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
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : categoriesError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load categories
              </p>
              <p className="text-sm text-muted-foreground">
                {categoriesError instanceof Error
                  ? categoriesError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Click "Add Category" to create your first
              category.
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
                {categories.map((cat) => (
                  <TableRow key={cat.id || cat.name}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{cat.name_id}</TableCell>
                    <TableCell>
                      {cat.description ? (
                        <div className="max-w-xs truncate">
                          {cat.description}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{cat.count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditCategory(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(cat.id)}
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
