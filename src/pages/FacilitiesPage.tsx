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
import FacilityContentDialog from "@/components/FacilityContentDialog";
import FacilityCategoryDialog from "@/components/FacilityCategoryDialog";
import {
  useFacilityContent,
  useUpdateFacilityContent,
  useFacilityCategories,
  useCreateFacilityCategory,
  useUpdateFacilityCategory,
  useDeleteFacilityCategory,
  useFacilities,
  useFacilityDetail,
  useCreateFacility,
  useUpdateFacility,
  useDeleteFacility,
} from "@/hooks/useApi";
import type { FacilityCategory, FacilityPageContent } from "@/types/api";
import type { FacilityForm } from "@/types/facility-form";
import type { FacilityContentForm } from "@/types/facility-content-form";
import type { FacilityCategoryForm } from "@/types/facility-category-form";
import FacilityDialog from "@/components/FacilityDialog";

export default function FacilitiesPage() {
  // Dialog states
  const [isContentDialogOpen, setIsContentDialogOpen] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] =
    React.useState<FacilityCategory | null>(null);

  // Queries
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useFacilityContent();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useFacilityCategories();

  // Mutations
  const updateContent = useUpdateFacilityContent();
  const createCategory = useCreateFacilityCategory();
  const updateCategory = useUpdateFacilityCategory();
  const deleteCategory = useDeleteFacilityCategory();

  // Facilities
  const [page, setPage] = React.useState(1);
  const [perPage] = React.useState(10);
  const {
    data: facilitiesResp,
    isLoading: facilitiesLoading,
    error: facilitiesError,
  } = useFacilities({ page, per_page: perPage });
  const facilities = facilitiesResp?.data || [];
  const pagination = facilitiesResp?.meta?.pagination;
  const createFacility = useCreateFacility();
  const updateFacility = useUpdateFacility();
  const deleteFacility = useDeleteFacility();
  const [isFacilityDialogOpen, setIsFacilityDialogOpen] = React.useState(false);
  const [editingFacilityId, setEditingFacilityId] = React.useState<
    number | null
  >(null);

  // Fetch full facility when editing
  const { data: editingFacility } = useFacilityDetail(editingFacilityId || 0, {
    enabled: !!editingFacilityId,
  });

  const handleContentSubmit = async (data: FacilityContentForm) => {
    const submission: FacilityPageContent = {
      ...data,
      hero_image_url: data.hero_image_url || "",
      hero_image_thumbnail_url:
        data.hero_image_thumbnail_url &&
        data.hero_image_thumbnail_url.length > 0
          ? data.hero_image_thumbnail_url
          : undefined,
    } as FacilityPageContent;
    try {
      await updateContent.mutateAsync(submission);
      setIsContentDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save facilities content");
    }
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: FacilityCategory) => {
    setEditingCategory(cat);
    setIsCategoryDialogOpen(true);
  };

  const handleCategorySubmit = async (data: FacilityCategoryForm) => {
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

  const openCreateFacility = () => {
    setEditingFacilityId(null);
    setIsFacilityDialogOpen(true);
  };

  const openEditFacility = (f: { id: number }) => {
    setEditingFacilityId(f.id);
    setIsFacilityDialogOpen(true);
  };

  const handleFacilitySubmit = async (data: FacilityForm) => {
    try {
      // Transform form data to API format
      const apiPayload = {
        ...data,
        facility_detail_sections: data.facility_detail_sections.map(
          (section) => ({
            ...section,
            image_url: section.image_url || "", // Ensure image_url is always a string
          })
        ),
      };

      if (editingFacilityId) {
        await updateFacility.mutateAsync({
          id: editingFacilityId,
          payload: apiPayload,
        });
      } else {
        await createFacility.mutateAsync(apiPayload);
      }
      setIsFacilityDialogOpen(false);
      setEditingFacilityId(null);
    } catch (e) {
      console.error("Failed to save facility", e);
      alert("Failed to save facility");
    }
  };

  const handleDeleteFacility = async (id: number) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;
    try {
      await deleteFacility.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete facility", e);
      alert("Failed to delete facility");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facilities</h1>
          <p className="text-muted-foreground">
            Manage facilities page content and facilities
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
                Manage header, facilities list section, and CTA
              </CardDescription>
            </div>
            <FacilityContentDialog
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
                <h3 className="font-medium">Facilities List Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Title (EN)
                    </h4>
                    <p>{content.facilities_list_section_title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Title (ID)
                    </h4>
                    <p>{content.facilities_list_section_title_id}</p>
                  </div>
                </div>
                {(content.facilities_list_section_description ||
                  content.facilities_list_section_description_id) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-muted-foreground">
                        Description (EN)
                      </h4>
                      <p className="text-sm">
                        {content.facilities_list_section_description || "-"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground">
                        Description (ID)
                      </h4>
                      <p className="text-sm">
                        {content.facilities_list_section_description_id || "-"}
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

      {/* Facilities Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Facilities</CardTitle>
              <CardDescription>Manage facilities list</CardDescription>
            </div>
            <FacilityDialog
              open={isFacilityDialogOpen}
              onOpenChange={setIsFacilityDialogOpen}
              editingFacility={editingFacility || null}
              onSubmit={handleFacilitySubmit}
              trigger={
                <Button onClick={openCreateFacility}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Facility
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {facilitiesLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : facilitiesError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load facilities
              </p>
              <p className="text-sm text-muted-foreground">
                {facilitiesError instanceof Error
                  ? facilitiesError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !facilities || facilities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No facilities found. Click "Add Facility" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.sort_order}</TableCell>
                      <TableCell>
                        <img
                          src={f.thumbnail_url || f.image_url}
                          alt={f.name}
                          className="h-12 w-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell>
                        {f.facility_category ? (
                          <div className="flex items-center gap-2">
                            {f.facility_category.name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No category
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{f.duration}</TableCell>
                      <TableCell>{f.capacity}</TableCell>
                      <TableCell>{f.price}</TableCell>
                      <TableCell>{f.is_featured ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditFacility(f)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFacility(f.id)}
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
              <CardTitle>Facility Categories</CardTitle>
              <CardDescription>
                Manage categories for facilities
              </CardDescription>
            </div>
            <FacilityCategoryDialog
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
                  <TableHead>Description (ID)</TableHead>
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
                        <div className="max-w-16 truncate">
                          {cat.description}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {cat.description_id ? (
                        <div className="max-w-16 truncate">
                          {cat.description_id}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {cat.count} facilities
                      </span>
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
