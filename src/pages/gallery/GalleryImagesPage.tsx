import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGalleryImages,
  useGalleryCategories,
  useCreateGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
  useUploadFile,
} from "@/hooks/useApi";
import type { GalleryImage, GalleryCategory } from "@/types/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Upload, Pencil, Trash2 } from "lucide-react";

const imageSchema = z.object({
  category_id: z.number().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL"),
  thumbnail_url: z.string().url("Must be a valid URL"),
  alt_text: z.string().optional(),
  sort_order: z.number().int().min(0),
});

type ImageForm = z.infer<typeof imageSchema>;

export default function GalleryImagesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  // Query hooks
  const {
    data: imagesData,
    isLoading: isLoadingImages,
    error: imagesError,
  } = useGalleryImages();
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useGalleryCategories();

  // Ensure data is always arrays
  const images = Array.isArray(imagesData) ? imagesData : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Mutation hooks
  const createImage = useCreateGalleryImage();
  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const uploadFile = useUploadFile();

  const isLoading = isLoadingImages || isLoadingCategories;

  const form = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      category_id: 0,
      title: "",
      description: "",
      image_url: "",
      thumbnail_url: "",
      alt_text: "",
      sort_order: 0,
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({ file, folder: "gallery" });
      form.setValue("image_url", result.file_url);
      form.setValue("thumbnail_url", result.thumbnail_url || result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const onSubmit = async (data: ImageForm) => {
    try {
      if (editingImage) {
        await updateImage.mutateAsync({ id: editingImage.id, image: data });
      } else {
        await createImage.mutateAsync(data);
      }
      setIsDialogOpen(false);
      form.reset();
      setEditingImage(null);
    } catch (error) {
      console.error("Failed to save image:", error);
      alert("Failed to save image");
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    form.reset({
      category_id: image.category_id,
      title: image.title,
      description: image.description || "",
      image_url: image.image_url,
      thumbnail_url: image.thumbnail_url,
      alt_text: image.alt_text || "",
      sort_order: image.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteImage.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingImage(null);
    form.reset();
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery Images</h1>
          <p className="text-muted-foreground">Manage gallery photos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingImage(null);
                form.reset();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? "Edit" : "Upload"} Gallery Image
              </DialogTitle>
              <DialogDescription>
                {editingImage ? "Update" : "Add a new"} image to the gallery
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input placeholder="Enter image title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the image"
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
                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Thumbnail URL (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Will use main image if not provided
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alt_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Text (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Image description for accessibility"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingImage ? "Update" : "Upload"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>All images in the gallery</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : imagesError || categoriesError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load gallery data
              </p>
              <p className="text-sm text-muted-foreground">
                {imagesError instanceof Error
                  ? imagesError.message
                  : categoriesError instanceof Error
                  ? categoriesError.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No images found. Upload your first image to get started.
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {images
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((image) => (
                      <TableRow key={image.id}>
                        <TableCell>{image.sort_order}</TableCell>
                        <TableCell>
                          <img
                            src={image.thumbnail_url}
                            alt={image.alt_text}
                            className="h-12 w-20 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {image.title}
                        </TableCell>
                        <TableCell>
                          {getCategoryName(image.category_id)}
                        </TableCell>
                        <TableCell>
                          {new Date(image.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(image)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(image.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
