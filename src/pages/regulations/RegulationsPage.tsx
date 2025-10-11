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
import RegulationContentDialog from "@/components/RegulationContentDialog";
import RegulationCategoryDialog from "@/components/RegulationCategoryDialog";
import {
  useRegulationContent,
  useUpdateRegulationContent,
  useRegulationCategories,
  useCreateRegulationCategory,
  useUpdateRegulationCategory,
  useDeleteRegulationCategory,
  useRegulations,
  useRegulationDetail,
  useCreateRegulation,
  useUpdateRegulation,
  useDeleteRegulation,
} from "@/hooks/useApi";
import type { RegulationPageContent, RegulationCategory } from "@/types/api";
import type { RegulationForm } from "@/types/regulation-form";
import type { RegulationContentForm } from "@/types/regulation-content-form";
import type { RegulationCategoryForm } from "@/types/regulation-category-form";
import RegulationDialog from "@/components/RegulationDialog";

export default function RegulationsPage() {
  // Dialog states
  const [isContentDialogOpen, setIsContentDialogOpen] = React.useState(false);
  const [isRegulationDialogOpen, setIsRegulationDialogOpen] =
    React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [editingRegulationId, setEditingRegulationId] = React.useState<
    number | null
  >(null);
  const [editingCategory, setEditingCategory] =
    React.useState<RegulationCategory | null>(null);

  // Queries
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useRegulationContent();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useRegulationCategories();

  // Mutations
  const updateContent = useUpdateRegulationContent();
  const createCategory = useCreateRegulationCategory();
  const updateCategory = useUpdateRegulationCategory();
  const deleteCategory = useDeleteRegulationCategory();

  // Regulations
  const [page, setPage] = React.useState(1);
  const [perPage] = React.useState(10);
  const {
    data: regulationsResp,
    isLoading: regulationsLoading,
    error: regulationsError,
  } = useRegulations({ page, per_page: perPage });
  const regulations = regulationsResp?.data || [];
  const pagination = regulationsResp?.meta?.pagination;
  const createRegulation = useCreateRegulation();
  const updateRegulation = useUpdateRegulation();
  const deleteRegulation = useDeleteRegulation();

  // Fetch full regulation when editing
  const { data: editingRegulation } = useRegulationDetail(
    editingRegulationId || 0,
    {
      enabled: !!editingRegulationId,
    }
  );

  const handleContentSubmit = async (data: RegulationContentForm) => {
    const submission: RegulationPageContent = {
      ...data,
      hero_image_url: data.hero_image_url || "",
      hero_image_thumbnail_url:
        data.hero_image_thumbnail_url &&
        data.hero_image_thumbnail_url.length > 0
          ? data.hero_image_thumbnail_url
          : undefined,
    } as RegulationPageContent;
    try {
      await updateContent.mutateAsync(submission);
      setIsContentDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save regulations content");
    }
  };

  const openCreateRegulation = () => {
    setEditingRegulationId(null);
    setIsRegulationDialogOpen(true);
  };

  const openEditRegulation = (r: { id: number }) => {
    setEditingRegulationId(r.id);
    setIsRegulationDialogOpen(true);
  };

  const handleRegulationSubmit = async (data: RegulationForm) => {
    try {
      if (editingRegulationId) {
        await updateRegulation.mutateAsync({
          id: editingRegulationId,
          payload: data,
        });
      } else {
        await createRegulation.mutateAsync(data);
      }
      setIsRegulationDialogOpen(false);
      setEditingRegulationId(null);
    } catch (e) {
      console.error("Failed to save regulation", e);
      alert("Failed to save regulation");
    }
  };

  const handleDeleteRegulation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this regulation?")) return;
    try {
      await deleteRegulation.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete regulation", e);
      alert("Failed to delete regulation");
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (cat: RegulationCategory) => {
    setEditingCategory(cat);
    setIsCategoryDialogOpen(true);
  };

  const handleCategorySubmit = async (data: RegulationCategoryForm) => {
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

  const handleDeleteCategory = async (id: number) => {
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
          <h1 className="text-3xl font-bold">Regulations</h1>
          <p className="text-muted-foreground">
            Manage regulations page content and Q&A
          </p>
        </div>
      </div>

      {/* Page Content Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>Manage header and CTA sections</CardDescription>
            </div>
            <RegulationContentDialog
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

      {/* Regulations Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Regulations Q&A</CardTitle>
              <CardDescription>
                Manage regulations and frequently asked questions
              </CardDescription>
            </div>
            <RegulationDialog
              open={isRegulationDialogOpen}
              onOpenChange={setIsRegulationDialogOpen}
              editingRegulation={editingRegulation || null}
              onSubmit={handleRegulationSubmit}
              trigger={
                <Button onClick={openCreateRegulation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Regulation
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {regulationsLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : regulationsError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load regulations
              </p>
              <p className="text-sm text-muted-foreground">
                {regulationsError instanceof Error
                  ? regulationsError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !regulations || regulations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No regulations found. Click "Add Regulation" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Question (EN)</TableHead>
                  <TableHead>Question (ID)</TableHead>
                  <TableHead>Answer Preview</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regulations.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {r.regulation_category ? (
                        <div className="flex items-center gap-2">
                          {r.regulation_category.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {getCategoryName(r.category_id)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {r.question}
                    </TableCell>
                    <TableCell className="max-w-16 truncate">
                      {r.question_id}
                    </TableCell>
                    <TableCell className="max-w-16 truncate">
                      {r.answer.substring(0, 100)}
                      {r.answer.length > 100 && "..."}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditRegulation(r)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteRegulation(r.id)}
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
              <CardTitle>Regulation Categories</CardTitle>
              <CardDescription>
                Manage categories for organizing regulations
              </CardDescription>
            </div>
            <RegulationCategoryDialog
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
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (ID)</TableHead>
                  <TableHead>Description (EN)</TableHead>
                  <TableHead>Description (ID)</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
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
                        {cat.count} regulations
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
