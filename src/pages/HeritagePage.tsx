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
import HeritageContentDialog from "@/components/HeritageContentDialog";
import {
  useHeritageContent,
  useUpdateHeritageContent,
  useHeritage,
  useHeritageDetail,
  useCreateHeritage,
  useUpdateHeritage,
  useDeleteHeritage,
} from "@/hooks/useApi";
import type { HeritagePageContent } from "@/types/api";
import type { HeritageForm } from "@/types/heritage-form";
import type { HeritageContentForm } from "@/types/heritage-content-form";
import HeritageDialog from "@/components/HeritageDialog";

export default function HeritagePage() {
  // Dialog states
  const [isContentDialogOpen, setIsContentDialogOpen] = React.useState(false);
  const [isHeritageDialogOpen, setIsHeritageDialogOpen] = React.useState(false);
  const [editingHeritageId, setEditingHeritageId] = React.useState<
    number | null
  >(null);

  // Queries
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useHeritageContent();

  // Mutations
  const updateContent = useUpdateHeritageContent();

  const {
    data: heritageResp,
    isLoading: heritageLoading,
    error: heritageError,
  } = useHeritage();
  const heritage = heritageResp?.data || [];

  const createHeritage = useCreateHeritage();
  const updateHeritage = useUpdateHeritage();
  const deleteHeritage = useDeleteHeritage();

  // Fetch full heritage when editing
  const { data: editingHeritage } = useHeritageDetail(editingHeritageId || 0, {
    enabled: !!editingHeritageId,
  });

  const handleContentSubmit = async (data: HeritageContentForm) => {
    const submission: HeritagePageContent = {
      ...data,
      hero_image_url: data.hero_image_url || "",
      hero_image_thumbnail_url:
        data.hero_image_thumbnail_url &&
        data.hero_image_thumbnail_url.length > 0
          ? data.hero_image_thumbnail_url
          : undefined,
    } as HeritagePageContent;
    try {
      await updateContent.mutateAsync(submission);
      setIsContentDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save heritage content");
    }
  };

  const openCreateHeritage = () => {
    setEditingHeritageId(null);
    setIsHeritageDialogOpen(true);
  };

  const openEditHeritage = (h: { id: number }) => {
    setEditingHeritageId(h.id);
    setIsHeritageDialogOpen(true);
  };

  const handleHeritageSubmit = async (data: HeritageForm) => {
    try {
      // Transform form data to API format
      const apiPayload = {
        ...data,
        heritage_detail_sections: data.heritage_detail_sections.map(
          (section) => ({
            ...section,
            image_url: section.image_url || "", // Ensure image_url is always a string
          })
        ),
      };

      if (editingHeritageId) {
        await updateHeritage.mutateAsync({
          id: editingHeritageId,
          payload: apiPayload,
        });
      } else {
        await createHeritage.mutateAsync(apiPayload);
      }
      setIsHeritageDialogOpen(false);
      setEditingHeritageId(null);
    } catch (e) {
      console.error("Failed to save heritage", e);
      alert("Failed to save heritage");
    }
  };

  const handleDeleteHeritage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this heritage item?")) return;
    try {
      await deleteHeritage.mutateAsync(id);
    } catch (e) {
      console.error("Failed to delete heritage", e);
      alert("Failed to delete heritage");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Heritage</h1>
          <p className="text-muted-foreground">
            Manage heritage page content and items
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
            <HeritageContentDialog
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
                <h3 className="font-medium">Main Heritage Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Title (EN)
                    </h4>
                    <p>{content.main_section_title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground">
                      Title (ID)
                    </h4>
                    <p>{content.main_section_title_id}</p>
                  </div>
                </div>
                {(content.main_section_description ||
                  content.main_section_description_id) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-muted-foreground">
                        Description (EN)
                      </h4>
                      <p className="text-sm">
                        {content.main_section_description || "-"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground">
                        Description (ID)
                      </h4>
                      <p className="text-sm">
                        {content.main_section_description_id || "-"}
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

      {/* Heritage Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Heritage Items</CardTitle>
              <CardDescription>Manage heritage items list</CardDescription>
            </div>
            <HeritageDialog
              open={isHeritageDialogOpen}
              onOpenChange={setIsHeritageDialogOpen}
              editingHeritage={editingHeritage || null}
              onSubmit={handleHeritageSubmit}
              trigger={
                <Button onClick={openCreateHeritage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Heritage Item
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {heritageLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : heritageError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load heritage items
              </p>
              <p className="text-sm text-muted-foreground">
                {heritageError instanceof Error
                  ? heritageError.message
                  : "Unknown error"}
              </p>
            </div>
          ) : !heritage || heritage.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No heritage items found. Click "Add Heritage Item" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Short Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heritage
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.sort_order}</TableCell>
                      <TableCell>
                        <img
                          src={h.thumbnail_url || h.image_url}
                          alt={h.title}
                          className="h-12 w-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{h.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {h.short_description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditHeritage(h)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteHeritage(h.id)}
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
          {/* <div className="flex items-center justify-between mt-4">
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
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
