import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAttractions,
  useCreateAttraction,
  useUpdateAttraction,
  useDeleteAttraction,
  useUploadFile,
} from "@/hooks/useApi";
import type { Attraction } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";

const attractionSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  short_description: z.string().min(1, "Short description is required"),
  full_description: z.string().min(1, "Full description is required"),
  image_url: z.string().url("Must be a valid URL"),
  highlights: z.array(z.string()),
  duration: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  price_range: z.string().optional(),
  is_featured: z.boolean(),
  sort_order: z.number().int().min(0),
});

type AttractionForm = z.infer<typeof attractionSchema>;

export default function AttractionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(
    null
  );
  const [highlightInput, setHighlightInput] = useState("");

  // Query hooks
  const { data: attractionsData, isLoading, error } = useAttractions();

  // Ensure attractions is always an array
  const attractions = Array.isArray(attractionsData) ? attractionsData : [];

  // Mutation hooks
  const createAttraction = useCreateAttraction();
  const updateAttraction = useUpdateAttraction();
  const deleteAttraction = useDeleteAttraction();
  const uploadFile = useUploadFile();

  const form = useForm<AttractionForm>({
    resolver: zodResolver(attractionSchema),
    defaultValues: {
      id: "",
      title: "",
      short_description: "",
      full_description: "",
      image_url: "",
      highlights: [],
      duration: "",
      difficulty: "easy",
      price_range: "",
      is_featured: false,
      sort_order: 0,
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "attractions",
      });
      form.setValue("image_url", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      const currentHighlights = form.getValues("highlights");
      form.setValue("highlights", [
        ...currentHighlights,
        highlightInput.trim(),
      ]);
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    const currentHighlights = form.getValues("highlights");
    form.setValue(
      "highlights",
      currentHighlights.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: AttractionForm) => {
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
      form.reset();
      setEditingAttraction(null);
    } catch (error) {
      console.error("Failed to save attraction:", error);
      alert("Failed to save attraction");
    }
  };

  const handleEdit = (attraction: Attraction) => {
    setEditingAttraction(attraction);
    form.reset({
      id: attraction.id,
      title: attraction.title,
      short_description: attraction.short_description,
      full_description: attraction.full_description,
      image_url: attraction.image_url,
      highlights: attraction.highlights || [],
      duration: attraction.duration || "",
      difficulty: attraction.difficulty as "easy" | "medium" | "hard",
      price_range: attraction.price_range || "",
      is_featured: attraction.is_featured,
      sort_order: attraction.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attraction?")) return;
    try {
      await deleteAttraction.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete attraction:", error);
      alert("Failed to delete attraction");
    }
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingAttraction(null);
                form.reset();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Attraction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAttraction ? "Edit" : "Add"} Attraction
              </DialogTitle>
              <DialogDescription>
                {editingAttraction ? "Update" : "Create a new"} attraction for
                visitors
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID (unique identifier)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., traditional-weaving"
                          {...field}
                          disabled={!!editingAttraction}
                        />
                      </FormControl>
                      <FormDescription>
                        Use lowercase with hyphens
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter attraction title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="full_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Image</FormLabel>
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadFile.isPending}
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadFile.isPending
                            ? "Uploading..."
                            : "Upload Image"}
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {form.watch("image_url") && (
                    <img
                      src={form.watch("image_url")}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                </div>
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Or paste image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Highlights</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      placeholder="Add a highlight"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addHighlight())
                      }
                    />
                    <Button type="button" onClick={addHighlight}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("highlights").map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {highlight}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeHighlight(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2 hours" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="price_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Range</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50000-100000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0 pt-8">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Featured</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAttraction ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attractions</CardTitle>
          <CardDescription>
            All attractions sorted by display order
          </CardDescription>
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
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attractions
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((attraction) => (
                    <TableRow key={attraction.id}>
                      <TableCell>{attraction.sort_order}</TableCell>
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
                      <TableCell>
                        <Badge variant="outline">{attraction.difficulty}</Badge>
                      </TableCell>
                      <TableCell>
                        {attraction.is_featured && <Badge>Featured</Badge>}
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
