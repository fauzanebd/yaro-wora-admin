import { useState } from "react";
import {
  useAttractions,
  useCreateAttraction,
  useUpdateAttraction,
  useDeleteAttraction,
  useAttractionContent,
  useUpdateAttractionContent,
} from "@/hooks/useApi";
import type { Attraction } from "@/types/api";
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
import { Plus, Pencil, Trash2, Edit } from "lucide-react";
import AttractionDialog from "@/components/AttractionDialog";
import AttractionContentDialog from "@/components/AttractionContentDialog";

export default function AttractionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(
    null
  );
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);

  // Query hooks
  const { data: attractionsData, isLoading, error } = useAttractions();
  const {
    data: contentData,
    isLoading: contentLoading,
    error: contentError,
  } = useAttractionContent();

  // Ensure attractions is always an array
  const attractions = Array.isArray(attractionsData) ? attractionsData : [];

  // Mutation hooks
  const createAttraction = useCreateAttraction();
  const updateAttraction = useUpdateAttraction();
  const deleteAttraction = useDeleteAttraction();
  const updateAttractionContent = useUpdateAttractionContent();

  const onSubmit = async (data: any) => {
    try {
      if (editingAttraction) {
        await updateAttraction.mutateAsync({
          id: editingAttraction.id,
          attraction: data,
        });
      } else {
        await createAttraction.mutateAsync(data);
      }
      setIsDialogOpen(false);
      setEditingAttraction(null);
    } catch (error) {
      console.error("Failed to save attraction:", error);
      alert("Failed to save attraction");
    }
  };

  const onContentSubmit = async (data: any) => {
    try {
      await updateAttractionContent.mutateAsync(data);
      setIsContentDialogOpen(false);
    } catch (error) {
      console.error("Failed to save attractions content:", error);
      alert("Failed to save attractions content");
    }
  };

  const handleEdit = (attraction: Attraction) => {
    setEditingAttraction(attraction);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this attraction?")) return;
    try {
      await deleteAttraction.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete attraction:", error);
      alert("Failed to delete attraction");
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingAttraction(null);
  };

  const handleContentDialogOpenChange = (open: boolean) => {
    setIsContentDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attractions Management</h1>
          <p className="text-muted-foreground">
            Manage village attractions and activities
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
                Manage the title and description for the Attractions section
              </CardDescription>
            </div>
            <AttractionContentDialog
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
                  {contentData.attraction_section_title_part_1}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 2 (English)
                </h3>
                <p className="text-lg">
                  {contentData.attraction_section_title_part_2}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 1 (Indonesian)
                </h3>
                <p className="text-lg">
                  {contentData.attraction_section_title_part_1_id}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Title Part 2 (Indonesian)
                </h3>
                <p className="text-lg">
                  {contentData.attraction_section_title_part_2_id}
                </p>
              </div>
              {contentData.attraction_section_description && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description (English)
                  </h3>
                  <p className="text-sm">
                    {contentData.attraction_section_description}
                  </p>
                </div>
              )}
              {contentData.attraction_section_description_id && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">
                    Description (Indonesian)
                  </h3>
                  <p className="text-sm">
                    {contentData.attraction_section_description_id}
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
              <CardTitle>Attractions</CardTitle>
              <CardDescription>
                All attractions sorted by display order
              </CardDescription>
            </div>
            <AttractionDialog
              open={isDialogOpen}
              onOpenChange={handleDialogOpenChange}
              editingAttraction={editingAttraction}
              onSubmit={onSubmit}
              trigger={
                <Button onClick={() => setEditingAttraction(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attraction
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
                Failed to load attractions data
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : attractions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No attractions found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Title (ID)</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attractions
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((attraction) => (
                    <TableRow key={attraction.id}>
                      <TableCell>
                        <img
                          src={attraction.image_url}
                          alt={attraction.title}
                          className="h-12 w-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {attraction.title}
                      </TableCell>
                      <TableCell>{attraction.title_id}</TableCell>
                      <TableCell>{attraction.sort_order}</TableCell>
                      <TableCell>
                        {attraction.active ? (
                          <Badge>Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(attraction)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(attraction.id)}
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
