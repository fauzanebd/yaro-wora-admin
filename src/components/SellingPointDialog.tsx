import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUploadFile } from "@/hooks/useApi";
import type { SellingPoint } from "@/types/api";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Upload, Info } from "lucide-react";

const sellingPointSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Title (Indonesian) is required"),
  description: z.string().min(1, "Description is required"),
  description_id: z.string().min(1, "Description (Indonesian) is required"),
  image_url: z.url("Must be a valid URL"),
  thumbnail_url: z.url("Must be a valid URL").optional(),
  pillar_color: z.string().optional(),
  text_color: z.string().optional(),
  selling_point_order: z
    .string()
    .min(1, "Display order is required")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0;
    }, "Display order must be a valid number >= 0"),
  is_active: z.boolean(),
});

type SellingPointForm = z.infer<typeof sellingPointSchema>;

interface SellingPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSellingPoint: SellingPoint | null;
  onSubmit: (data: SellingPointForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function SellingPointDialog({
  open,
  onOpenChange,
  editingSellingPoint,
  onSubmit,
  trigger,
}: SellingPointDialogProps) {
  const uploadFile = useUploadFile();

  const form = useForm<SellingPointForm>({
    resolver: zodResolver(sellingPointSchema),
    defaultValues: {
      title: editingSellingPoint?.title ?? "",
      title_id: editingSellingPoint?.title_id ?? "",
      description: editingSellingPoint?.description ?? "",
      description_id: editingSellingPoint?.description_id ?? "",
      image_url: editingSellingPoint?.image_url ?? "",
      thumbnail_url: editingSellingPoint?.thumbnail_url ?? "",
      pillar_color: editingSellingPoint?.pillar_color ?? "#000000",
      text_color: editingSellingPoint?.text_color ?? "#FFFFFF",
      selling_point_order:
        editingSellingPoint?.selling_point_order?.toString() ?? "0",
      is_active: editingSellingPoint?.is_active ?? true,
    },
  });

  // Reset form when editingSellingPoint changes
  React.useEffect(() => {
    if (editingSellingPoint) {
      form.reset({
        title: editingSellingPoint.title,
        title_id: editingSellingPoint.title_id,
        description: editingSellingPoint.description || "",
        description_id: editingSellingPoint.description_id || "",
        image_url: editingSellingPoint.image_url,
        thumbnail_url: editingSellingPoint.thumbnail_url || "",
        pillar_color: editingSellingPoint.pillar_color || "#000000",
        text_color: editingSellingPoint.text_color || "#FFFFFF",
        selling_point_order: editingSellingPoint.selling_point_order.toString(),
        is_active: editingSellingPoint.is_active,
      });
    } else {
      form.reset({
        title: "",
        title_id: "",
        description: "",
        description_id: "",
        image_url: "",
        thumbnail_url: "",
        pillar_color: "#000000",
        text_color: "#FFFFFF",
        selling_point_order: "0",
        is_active: true,
      });
    }
  }, [editingSellingPoint, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "selling-points",
      });
      form.setValue("image_url", result.file_url);
      form.setValue("thumbnail_url", result.thumbnail_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const handleSubmit = async (data: SellingPointForm) => {
    await onSubmit(data);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingSellingPoint ? "Edit" : "Add"} Selling Point
          </DialogTitle>
          <DialogDescription>
            {editingSellingPoint ? "Update" : "Create a new"} selling point for
            the homepage
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (English)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter selling point title in English"
                        {...field}
                      />
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
                    <FormLabel>Title (Indonesian)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan judul selling point dalam Bahasa Indonesia"
                        {...field}
                      />
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
                    <FormLabel>Description (English)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description in English"
                        {...field}
                        rows={3}
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
                    <FormLabel>Description (Indonesian)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan deskripsi dalam Bahasa Indonesia"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FormLabel>Image</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Supported formats: JPG, PNG</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
                      accept="image/jpeg,image/jpg,image/png"
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
                      <Input
                        placeholder="Or paste image URL"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Auto-set thumbnail URL to same value when manually entering image URL
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
                        placeholder="Thumbnail URL (auto-generated on upload)"
                        {...field}
                        readOnly
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormDescription>
                      Automatically generated when uploading a file
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pillar_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pillar Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            {...field}
                            className="w-16 h-10"
                          />
                          <Input
                            type="text"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="#000000"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="text_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            {...field}
                            className="w-16 h-10"
                          />
                          <Input
                            type="text"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="selling_point_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Active</FormLabel>
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
                <Button type="submit" disabled={uploadFile.isPending}>
                  {editingSellingPoint ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
