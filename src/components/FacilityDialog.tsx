import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFile, useFacilityCategories } from "@/hooks/useApi";
import type { Facility, FacilityDetailSection } from "@/types/api";
import { facilityFormSchema, type FacilityForm } from "@/types/facility-form";
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

interface FacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFacility: Facility | null;
  onSubmit: (data: FacilityForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function FacilityDialog({
  open,
  onOpenChange,
  editingFacility,
  onSubmit,
  trigger,
}: FacilityDialogProps) {
  const uploadFile = useUploadFile();
  const [highlightEN, setHighlightEN] = React.useState("");
  const [highlightID, setHighlightID] = React.useState("");

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useFacilityCategories();

  const form = useForm<FacilityForm>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: editingFacility?.name ?? "",
      name_id: editingFacility?.name_id ?? "",
      short_description: editingFacility?.short_description ?? "",
      short_description_id: editingFacility?.short_description_id ?? "",
      description: editingFacility?.description ?? "",
      description_id: editingFacility?.description_id ?? "",
      image_url: editingFacility?.image_url ?? "",
      thumbnail_url: editingFacility?.thumbnail_url ?? "",
      category_id: editingFacility?.category_id ?? undefined,
      facility_detail_sections: editingFacility?.facility_detail_sections ?? [],
      highlights: editingFacility?.highlights ?? [],
      highlights_id: editingFacility?.highlights_id ?? [],
      duration: editingFacility?.duration ?? "",
      duration_id: editingFacility?.duration_id ?? "",
      capacity: editingFacility?.capacity ?? "",
      capacity_id: editingFacility?.capacity_id ?? "",
      price: editingFacility?.price ?? "",
      price_id: editingFacility?.price_id ?? "",
      cta_url: editingFacility?.cta_url ?? "",
      is_featured: editingFacility?.is_featured ?? false,
      sort_order: editingFacility?.sort_order ?? 0,
    },
  });

  React.useEffect(() => {
    if (editingFacility) {
      form.reset({
        name: editingFacility.name,
        name_id: editingFacility.name_id,
        short_description: editingFacility.short_description,
        short_description_id: editingFacility.short_description_id,
        description: editingFacility.description,
        description_id: editingFacility.description_id,
        image_url: editingFacility.image_url,
        thumbnail_url: editingFacility.thumbnail_url,
        category_id: editingFacility.category_id,
        facility_detail_sections: editingFacility.facility_detail_sections,
        highlights: editingFacility.highlights,
        highlights_id: editingFacility.highlights_id,
        duration: editingFacility.duration,
        duration_id: editingFacility.duration_id,
        capacity: editingFacility.capacity,
        capacity_id: editingFacility.capacity_id,
        price: editingFacility.price,
        price_id: editingFacility.price_id,
        cta_url: editingFacility.cta_url,
        is_featured: editingFacility.is_featured,
        sort_order: editingFacility.sort_order,
      });
    } else {
      form.reset({
        name: "",
        name_id: "",
        short_description: "",
        short_description_id: "",
        description: "",
        description_id: "",
        image_url: "",
        thumbnail_url: "",
        category_id: undefined,
        facility_detail_sections: [],
        highlights: [],
        highlights_id: [],
        duration: "",
        duration_id: "",
        capacity: "",
        capacity_id: "",
        price: "",
        price_id: "",
        cta_url: "",
        is_featured: false,
        sort_order: 0,
      });
    }
  }, [editingFacility, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "facilities",
      });
      form.setValue("image_url", result.file_url);
      form.setValue("thumbnail_url", result.thumbnail_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const addSection = () => {
    const current = form.getValues("facility_detail_sections") || [];
    form.setValue("facility_detail_sections", [
      ...current,
      { title: "", title_id: "", content: "", content_id: "", image_url: "" },
    ]);
  };

  const updateSection = (
    index: number,
    value: Partial<FacilityDetailSection>
  ) => {
    const current = [...(form.getValues("facility_detail_sections") || [])];
    current[index] = {
      ...current[index],
      ...value,
    } as FacilityDetailSection;
    form.setValue("facility_detail_sections", current);
  };

  const removeSection = (index: number) => {
    const current = form.getValues("facility_detail_sections") || [];
    form.setValue(
      "facility_detail_sections",
      current.filter((_, i) => i !== index)
    );
  };

  const addHighlightEN = () => {
    if (highlightEN.trim()) {
      const current = form.getValues("highlights") || [];
      form.setValue("highlights", [...current, highlightEN.trim()]);
      setHighlightEN("");
    }
  };

  const addHighlightID = () => {
    if (highlightID.trim()) {
      const current = form.getValues("highlights_id") || [];
      form.setValue("highlights_id", [...current, highlightID.trim()]);
      setHighlightID("");
    }
  };

  const removeHighlightEN = (index: number) => {
    const current = form.getValues("highlights") || [];
    form.setValue(
      "highlights",
      current.filter((_, i) => i !== index)
    );
  };

  const removeHighlightID = (index: number) => {
    const current = form.getValues("highlights_id") || [];
    form.setValue(
      "highlights_id",
      current.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (data: FacilityForm) => {
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
          <DialogTitle>{editingFacility ? "Edit" : "Add"} Facility</DialogTitle>
          <DialogDescription>
            {editingFacility ? "Update" : "Create a new"} facility
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (EN)</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama" {...field} />
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
                          placeholder="Markdown supported"
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
                          placeholder="Markdown didukung"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Cover Image</FormLabel>
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
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (EN)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 hours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 jam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (EN)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50 people" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50 orang" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (EN)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Rp 500.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cta_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sort_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 pt-8">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Featured</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormLabel>Highlights (EN)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={highlightEN}
                      onChange={(e) => setHighlightEN(e.target.value)}
                      placeholder="Add a highlight"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addHighlightEN();
                        }
                      }}
                    />
                    <Button type="button" onClick={addHighlightEN}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.watch("highlights") || []).map(
                      (h: string, i: number) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {h}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeHighlightEN(i)}
                          />
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <FormLabel>Highlights (ID)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={highlightID}
                      onChange={(e) => setHighlightID(e.target.value)}
                      placeholder="Tambahkan highlight"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addHighlightID();
                        }
                      }}
                    />
                    <Button type="button" onClick={addHighlightID}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.watch("highlights_id") || []).map(
                      (h: string, i: number) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {h}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeHighlightID(i)}
                          />
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Detail Sections</FormLabel>
                  <Button type="button" variant="outline" onClick={addSection}>
                    Add Section
                  </Button>
                </div>
                {(form.watch("facility_detail_sections") || []).map(
                  (section, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-4 space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Title (EN)"
                          value={section.title || ""}
                          onChange={(e) =>
                            updateSection(index, { title: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Title (ID)"
                          value={section.title_id || ""}
                          onChange={(e) =>
                            updateSection(index, { title_id: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Textarea
                          rows={3}
                          placeholder="Content (EN) - markdown supported"
                          value={section.content || ""}
                          onChange={(e) =>
                            updateSection(index, { content: e.target.value })
                          }
                        />
                        <Textarea
                          rows={3}
                          placeholder="Konten (ID) - markdown didukung"
                          value={section.content_id || ""}
                          onChange={(e) =>
                            updateSection(index, { content_id: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Section Image</FormLabel>
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
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const result = await uploadFile.mutateAsync({
                                    file,
                                    folder: "facilities/sections",
                                  });
                                  updateSection(index, {
                                    image_url: result.file_url,
                                  });
                                } catch (error) {
                                  console.error("Upload failed:", error);
                                  alert("Failed to upload image");
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {section.image_url && (
                          <img
                            src={section.image_url}
                            alt="Section preview"
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                        <Input
                          placeholder="Or paste image URL"
                          value={section.image_url || ""}
                          onChange={(e) =>
                            updateSection(index, { image_url: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeSection(index)}
                        >
                          Remove Section
                        </Button>
                      </div>
                    </div>
                  )
                )}
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
                  {editingFacility ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
