import { useState } from "react";
import {
  useWhyVisit,
  useCreateWhyVisit,
  useUpdateWhyVisit,
  useDeleteWhyVisit,
  useWhyVisitContent,
  useUpdateWhyVisitContent,
} from "@/hooks/useApi";
import type { WhyVisit } from "@/types/api";
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
import { Plus, Pencil, Trash2, Edit } from "lucide-react";
import WhyVisitDialog from "@/components/WhyVisitDialog";
import WhyVisitContentDialog from "@/components/WhyVisitContentDialog";

export default function WhyVisitPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWhyVisit, setEditingWhyVisit] = useState<WhyVisit | null>(null);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);

  // Query hooks
  const { data: whyVisitData, isLoading, error } = useWhyVisit();
  const {
    data: contentData,
    isLoading: contentLoading,
    error: contentError,
  } = useWhyVisitContent();

  // Ensure whyVisit is always an array
  const whyVisitItems = Array.isArray(whyVisitData) ? whyVisitData : [];

  // Mutation hooks
  const createWhyVisit = useCreateWhyVisit();
  const updateWhyVisit = useUpdateWhyVisit();
  const deleteWhyVisit = useDeleteWhyVisit();
  const updateWhyVisitContent = useUpdateWhyVisitContent();

  const onSubmit = async (data: any) => {
    try {
      if (editingWhyVisit) {
        await updateWhyVisit.mutateAsync({
          id: editingWhyVisit.id,
          whyVisit: data,
        });
      } else {
        await createWhyVisit.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setEditingWhyVisit(null);
    } catch (error) {
      console.error("Failed to save why visit item:", error);
      alert("Failed to save why visit item");
    }
  };

  const onContentSubmit = async (data: any) => {
    try {
      await updateWhyVisitContent.mutateAsync(data);
      setIsContentDialogOpen(false);
    } catch (error) {
      console.error("Failed to save why visit content:", error);
      alert("Failed to save why visit content");
    }
  };

  const handleEdit = (whyVisit: WhyVisit) => {
    setEditingWhyVisit(whyVisit);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this why visit item?"))
      return;
    try {
      await deleteWhyVisit.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete why visit item:", error);
      alert("Failed to delete why visit item");
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Dialog is closing, reset state
      setEditingWhyVisit(null);
    }
  };

  const handleContentDialogOpenChange = (open: boolean) => {
    setIsContentDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Why Visit Management</h1>
          <p className="text-muted-foreground">
            Manage why visit section content and items for the homepage
          </p>
        </div>
      </div>

      {/* Section Content Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Section Content</CardTitle>
              <CardDescription>
                Manage the title and description for the Why Visit section
              </CardDescription>
            </div>
            <WhyVisitContentDialog
              open={isContentDialogOpen}
              onOpenChange={handleContentDialogOpenChange}
              content={contentData || null}
              onSubmit={onContentSubmit}
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
            <div className="text-center py-4">Loading content...</div>
          ) : contentError ? (
            <div className="text-center py-4">
              <p className="text-destructive font-medium mb-2">
                Failed to load section content
              </p>
              <p className="text-sm text-muted-foreground">
                {contentError instanceof Error
                  ? contentError.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : contentData ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 1 (English)
                </h3>
                <p className="text-lg">
                  {contentData.why_visit_section_title_part_1}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 2 (English)
                </h3>
                <p className="text-lg">
                  {contentData.why_visit_section_title_part_2}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 1 (Indonesian)
                </h3>
                <p className="text-lg">
                  {contentData.why_visit_section_title_part_1_id}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 2 (Indonesian)
                </h3>
                <p className="text-lg">
                  {contentData.why_visit_section_title_part_2_id}
                </p>
              </div>
              {contentData.why_visit_section_description && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description (English)
                  </h3>
                  <p className="text-sm">
                    {contentData.why_visit_section_description}
                  </p>
                </div>
              )}
              {contentData.why_visit_section_description_id && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description (Indonesian)
                  </h3>
                  <p className="text-sm">
                    {contentData.why_visit_section_description_id}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No section content found. Click "Edit Content" to add content.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Why Visit Items</CardTitle>
              <CardDescription>
                All why visit items displayed on the homepage
              </CardDescription>
            </div>
            <WhyVisitDialog
              open={isDialogOpen}
              onOpenChange={handleDialogOpenChange}
              editingWhyVisit={editingWhyVisit}
              onSubmit={onSubmit}
              trigger={
                <Button
                  onClick={() => {
                    setEditingWhyVisit(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              }
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load why visit data
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : whyVisitItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No why visit items found. Add your first item to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Title (ID)</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {whyVisitItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img
                        src={item.icon_url}
                        alt={item.title}
                        className="h-8 w-8 object-contain"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.title_id}</TableCell>
                    <TableCell>
                      {item.description ? (
                        <div className="max-w-xs truncate">
                          {item.description}
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
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
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
