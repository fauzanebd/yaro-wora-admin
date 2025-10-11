import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFile, useGalleryCategories } from "@/hooks/useApi";
import type { GalleryImage } from "@/types/api";
import { galleryFormSchema, type GalleryForm } from "@/types/gallery-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Upload, X } from "lucide-react";

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingImage: GalleryImage | null;
  onSubmit: (data: GalleryForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function GalleryDialog({
  open,
  onOpenChange,
  editingImage,
  onSubmit,
  trigger,
}: GalleryDialogProps) {
  const uploadFile = useUploadFile();
  const [tagEN, setTagEN] = React.useState("");
  const [tagID, setTagID] = React.useState("");

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGalleryCategories();

  const form = useForm<GalleryForm>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: editingImage?.title ?? "",
      title_id: editingImage?.title_id ?? "",
      short_description: editingImage?.short_description ?? "",
      short_description_id: editingImage?.short_description_id ?? "",
      description: editingImage?.description ?? "",
      description_id: editingImage?.description_id ?? "",
      image_url: editingImage?.image_url ?? "",
      thumbnail_url: editingImage?.thumbnail_url ?? "",
      category_id: editingImage?.category_id ?? undefined,
      photographer: editingImage?.photographer ?? "",
      location: editingImage?.location ?? "",
      tags: editingImage?.tags ?? [],
      tags_id: editingImage?.tags_id ?? [],
      date_uploaded: editingImage?.date_uploaded ?? new Date().toISOString(),
    },
  });

  React.useEffect(() => {
    if (editingImage) {
      form.reset({
        title: editingImage.title,
        title_id: editingImage.title_id,
        short_description: editingImage.short_description,
        short_description_id: editingImage.short_description_id,
        description: editingImage.description,
        description_id: editingImage.description_id,
        image_url: editingImage.image_url,
        thumbnail_url: editingImage.thumbnail_url,
        category_id: editingImage.category_id,
        photographer: editingImage.photographer,
        location: editingImage.location,
        tags: editingImage.tags,
        tags_id: editingImage.tags_id,
        date_uploaded: editingImage.date_uploaded,
      });
    } else {
      form.reset({
        title: "",
        title_id: "",
        short_description: "",
        short_description_id: "",
        description: "",
        description_id: "",
        image_url: "",
        thumbnail_url: "",
        category_id: undefined,
        photographer: "",
        location: "",
        tags: [],
        tags_id: [],
        date_uploaded: new Date().toISOString(),
      });
    }
  }, [editingImage, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "gallery",
      });
      form.setValue("image_url", result.file_url);
      form.setValue("thumbnail_url", result.thumbnail_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const addTagEN = () => {
    if (tagEN.trim()) {
      const current = form.getValues("tags") || [];
      form.setValue("tags", [...current, tagEN.trim()]);
      setTagEN("");
    }
  };

  const addTagID = () => {
    if (tagID.trim()) {
      const current = form.getValues("tags_id") || [];
      form.setValue("tags_id", [...current, tagID.trim()]);
      setTagID("");
    }
  };

  const removeTagEN = (index: number) => {
    const current = form.getValues("tags") || [];
    form.setValue(
      "tags",
      current.filter((_, i) => i !== index)
    );
  };

  const removeTagID = (index: number) => {
    const current = form.getValues("tags_id") || [];
    form.setValue(
      "tags_id",
      current.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (data: GalleryForm) => {
    await onSubmit(data);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingImage ? "Edit" : "Add"} Gallery Image
          </DialogTitle>
          <DialogDescription>
            {editingImage ? "Update" : "Create a new"} gallery image
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (EN)</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="Judul" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Brief description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="short_description_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description (ID)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Deskripsi singkat"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Detailed description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (ID)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Deskripsi lengkap"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        {uploadFile.isPending ? "Uploading..." : "Upload Image"}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
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
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Or paste image URL"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            form.setValue("thumbnail_url", e.target.value);
                          }}
                        />
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
                      <FormLabel>Thumbnail URL (Auto-generated)</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          className="bg-muted"
                          placeholder="Auto-generated on upload"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Automatically generated when uploading
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="photographer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photographer</FormLabel>
                      <FormControl>
                        <Input placeholder="Photographer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Photo location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date_uploaded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Uploaded</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value)
                                .toLocaleString("sv-SE")
                                .slice(0, 16)
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            // Convert datetime-local value to ISO string for backend
                            const localDateTime = new Date(value);
                            field.onChange(localDateTime.toISOString());
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      When this image was uploaded
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : undefined)
                      }
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : categoriesError ? (
                          <SelectItem value="" disabled>
                            Error loading categories
                          </SelectItem>
                        ) : categories && categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              <div className="flex items-center gap-2">
                                {category.name}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No categories available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormLabel>Tags (EN)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={tagEN}
                      onChange={(e) => setTagEN(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTagEN();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTagEN}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.watch("tags") || []).map(
                      (tag: string, i: number) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTagEN(i)}
                          />
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <FormLabel>Tags (ID)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={tagID}
                      onChange={(e) => setTagID(e.target.value)}
                      placeholder="Tambahkan tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTagID();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTagID}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.watch("tags_id") || []).map(
                      (tag: string, i: number) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTagID(i)}
                          />
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadFile.isPending}>
                  {editingImage ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
