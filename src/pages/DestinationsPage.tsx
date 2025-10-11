import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// form imports removed; form is now handled inside dialog
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import DestinationCategoryDialog from "@/components/DestinationCategoryDialog";
import DestinationContentDialog from "@/components/DestinationContentDialog";
import {
  useDestinationContent,
  useUpdateDestinationContent,
  useDestinationCategories,
  useCreateDestinationCategory,
  useUpdateDestinationCategory,
  useDeleteDestinationCategory,
  useDestinations,
  useDestinationDetail,
  useCreateDestination,
  useUpdateDestination,
  useDeleteDestination,
} from "@/hooks/useApi";
import type { DestinationCategory, DestinationPageContent } from "@/types/api";
import type { DestinationForm } from "@/types/destination-form";
import type { DestinationContentForm } from "@/types/destination-content-form";
import type { DestinationCategoryForm } from "@/types/destination-category-form";
import DestinationDialog from "@/components/DestinationDialog";

export default function DestinationsPage() {
  // Dialog states
  const [isContentDialogOpen, setIsContentDialogOpen] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] =
    React.useState<DestinationCategory | null>(null);

  // Queries
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useDestinationContent();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useDestinationCategories();

  // Mutations
  const updateContent = useUpdateDestinationContent();
  const createCategory = useCreateDestinationCategory();
  const updateCategory = useUpdateDestinationCategory();
  const deleteCategory = useDeleteDestinationCategory();

  // Destinations
  const [page, setPage] = React.useState(1);
  const [perPage] = React.useState(10);
  const {
    data: destinationsResp,
    isLoading: destinationsLoading,
    error: destinationsError,
  } = useDestinations({ page, per_page: perPage });
  const destinations = destinationsResp?.data || [];
  const pagination = destinationsResp?.meta?.pagination;
  const createDestination = useCreateDestination();
  const updateDestination = useUpdateDestination();
  const deleteDestination = useDeleteDestination();
  const [isDestinationDialogOpen, setIsDestinationDialogOpen] =
    React.useState(false);
  const [editingDestinationId, setEditingDestinationId] = React.useState<
    number | null
  >(null);

  // Fetch full destination when editing
  const { data: editingDestination } = useDestinationDetail(
    editingDestinationId || 0,
    {
      enabled: !!editingDestinationId,
    }
  );

  const handleContentSubmit = async (data: DestinationContentForm) => {
    const submission: DestinationPageContent = {
      ...data,
      hero_image_url: data.hero_image_url || "",
      hero_image_thumbnail_url:
        data.hero_image_thumbnail_url &&
        data.hero_image_thumbnail_url.length > 0
          ? data.hero_image_thumbnail_url
          : undefined,
    } as DestinationPageContent;
    try {
      await updateContent.mutateAsync(submission);
      setIsContentDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save destinations content");
    }
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: DestinationCategory) => {
    setEditingCategory(cat);
    setIsCategoryDialogOpen(true);
  };

  const handleCategorySubmit = async (data: DestinationCategoryForm) => {
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

  const openCreateDestination = () => {
    setEditingDestinationId(null);
    setIsDestinationDialogOpen(true);
  };

  const openEditDestination = (d: { id: number }) => {
    setEditingDestinationId(d.id);
    setIsDestinationDialogOpen(true);
  };

  const handleDestinationSubmit = async (data: DestinationForm) => {
    try {
      // Transform form data to API format
      const apiPayload = {
        ...data,
        destination_detail_sections: data.destination_detail_sections.map(
          (section) => ({
            ...section,
            image_url: section.image_url || "", // Ensure image_url is always a string
          })
        ),
      };

      // Backend enforces only 1 featured; propagate server error if any
      if (editingDestinationId) {
        await updateDestination.mutateAsync({
          id: editingDestinationId,
          payload: apiPayload,
        });
      } else {
        await createDestination.mutateAsync(apiPayload);
      }
      setIsDestinationDialogOpen(false);
      setEditingDestinationId(null);
    } catch (e) {
      console.error("Failed to save destination", e);
      alert("Failed to save destination. Ensure only one is featured.");
    }
  };

  const handleDeleteDestination = async (id: number) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    try {
      await deleteDestination.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete destination", e);
      alert("Failed to delete destination");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Destinations</h1>
          <p className="text-muted-foreground">
            Manage destinations page content and categories
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
                Manage header, featured, other sections, and CTA
              </CardDescription>
            </div>
            <DestinationContentDialog
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
              <div className="space-y-2">
                <h3 className="font-medium">Featured Destination Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Title (EN)
                    </h4>
                    <p>{content.featured_destination_title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Title (ID)
                    </h4>
                    <p>{content.featured_destination_title_id}</p>
                  </div>
                </div>
                {(content.featured_destination_description ||
                  content.featured_destination_description_id) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-muted-foreground">
                        Description (EN)
                      </h4>
                      <p className="text-sm">
                        {content.featured_destination_description || "-"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground">
                        Description (ID)
                      </h4>
                      <p className="text-sm">
                        {content.featured_destination_description_id || "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Other Destinations Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Title (EN)
                    </h4>
                    <p>{content.other_destinations_title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Title (ID)
                    </h4>
                    <p>{content.other_destinations_title_id}</p>
                  </div>
                </div>
                {(content.other_destinations_description ||
                  content.other_destinations_description_id) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-muted-foreground">
                        Description (EN)
                      </h4>
                      <p className="text-sm">
                        {content.other_destinations_description || "-"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground">
                        Description (ID)
                      </h4>
                      <p className="text-sm">
                        {content.other_destinations_description_id || "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Call-to-Action Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      CTA Title (EN)
                    </h4>
                    <p>{content.cta_title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      CTA Title (ID)
                    </h4>
                    <p>{content.cta_title_id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      CTA Text (EN)
                    </h4>
                    <p className="text-sm">{content.cta_description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      CTA Text (ID)
                    </h4>
                    <p className="text-sm">{content.cta_description_id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">
                    CTA Button URL
                  </h4>
                  <p className="text-sm">{content.cta_button_url}</p>
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

      {/* Destinations Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Destinations</CardTitle>
              <CardDescription>
                Manage destinations list (featured and others)
              </CardDescription>
            </div>
            <DestinationDialog
              open={isDestinationDialogOpen}
              onOpenChange={setIsDestinationDialogOpen}
              editingDestination={editingDestination || null}
              onSubmit={handleDestinationSubmit}
              trigger={
                <Button onClick={openCreateDestination}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Destination
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {destinationsLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : destinationsError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load destinations
              </p>
              <p className="text-sm text-muted-foreground">
                {destinationsError instanceof Error
                  ? destinationsError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !destinations || destinations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No destinations found. Click "Add Destination" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>CTA URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>{d.sort_order}</TableCell>
                      <TableCell>
                        <img
                          src={d.thumbnail_url || d.image_url}
                          alt={d.title}
                          className="h-12 w-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{d.title}</TableCell>
                      <TableCell>
                        {d.destination_category ? (
                          <div className="flex items-center gap-2">
                            {d.destination_category.name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No category
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{d.is_featured ? "Yes" : "No"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {"cta_url" in d && d.cta_url ? String(d.cta_url) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDestination(d)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteDestination(d.id)}
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
              <CardTitle>Destination Categories</CardTitle>
              <CardDescription>
                Manage categories for destinations
              </CardDescription>
            </div>
            <DestinationCategoryDialog
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
