import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFile } from "@/hooks/useApi";
import type { Heritage, HeritageDetailSection } from "@/types/api";
import { heritageFormSchema, type HeritageForm } from "@/types/heritage-form";
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
import { Upload } from "lucide-react";

interface HeritageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingHeritage: Heritage | null;
  onSubmit: (data: HeritageForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function HeritageDialog({
  open,
  onOpenChange,
  editingHeritage,
  onSubmit,
  trigger,
}: HeritageDialogProps) {
  const uploadFile = useUploadFile();

  const form = useForm<HeritageForm>({
    resolver: zodResolver(heritageFormSchema),
    defaultValues: {
      title: editingHeritage?.title ?? "",
      title_id: editingHeritage?.title_id ?? "",
      short_description: editingHeritage?.short_description ?? "",
      short_description_id: editingHeritage?.short_description_id ?? "",
      description: editingHeritage?.description ?? "",
      description_id: editingHeritage?.description_id ?? "",
      image_url: editingHeritage?.image_url ?? "",
      thumbnail_url: editingHeritage?.thumbnail_url ?? "",
      heritage_detail_sections: editingHeritage?.heritage_detail_sections ?? [],
      sort_order: editingHeritage?.sort_order ?? 0,
    },
  });

  React.useEffect(() => {
    if (editingHeritage) {
      form.reset({
        title: editingHeritage.title,
        title_id: editingHeritage.title_id,
        short_description: editingHeritage.short_description,
        short_description_id: editingHeritage.short_description_id,
        description: editingHeritage.description,
        description_id: editingHeritage.description_id,
        image_url: editingHeritage.image_url,
        thumbnail_url: editingHeritage.thumbnail_url,
        heritage_detail_sections: editingHeritage.heritage_detail_sections,
        sort_order: editingHeritage.sort_order,
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
        heritage_detail_sections: [],
        sort_order: 0,
      });
    }
  }, [editingHeritage, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "heritage",
      });
      form.setValue("image_url", result.file_url);
      form.setValue("thumbnail_url", result.thumbnail_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const addSection = () => {
    const current = form.getValues("heritage_detail_sections") || [];
    form.setValue("heritage_detail_sections", [
      ...current,
      { title: "", title_id: "", content: "", content_id: "", image_url: "" },
    ]);
  };

  const updateSection = (
    index: number,
    value: Partial<HeritageDetailSection>
  ) => {
    const current = [...(form.getValues("heritage_detail_sections") || [])];
    current[index] = {
      ...current[index],
      ...value,
    } as HeritageDetailSection;
    form.setValue("heritage_detail_sections", current);
  };

  const removeSection = (index: number) => {
    const current = form.getValues("heritage_detail_sections") || [];
    form.setValue(
      "heritage_detail_sections",
      current.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (data: HeritageForm) => {
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
          <DialogTitle>{editingHeritage ? "Edit" : "Add"} Heritage</DialogTitle>
          <DialogDescription>
            {editingHeritage ? "Update" : "Create a new"} heritage item
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Detail Sections</FormLabel>
                  <Button type="button" variant="outline" onClick={addSection}>
                    Add Section
                  </Button>
                </div>
                {(form.watch("heritage_detail_sections") || []).map(
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
                        <FormLabel>Section Image (Optional)</FormLabel>
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
                                    folder: "heritage/sections",
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
                  {editingHeritage ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
