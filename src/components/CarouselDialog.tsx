import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUploadFile } from "@/hooks/useApi";
import type { Carousel } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const carouselSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Title (Indonesian) is required"),
  subtitle: z.string().optional(),
  subtitle_id: z.string().optional(),
  image_url: z.url("Must be a valid URL"),
  thumbnail_url: z.url("Must be a valid URL").optional(),
  alt_text: z.string().optional(),
  alt_text_id: z.string().optional(),
  carousel_order: z
    .string()
    .min(1, "Display order is required")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0;
    }, "Display order must be a valid number >= 0"),
  is_active: z.boolean(),
});

type CarouselForm = z.infer<typeof carouselSchema>;

interface CarouselDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCarousel: Carousel | null;
  onSubmit: (data: CarouselForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function CarouselDialog({
  open,
  onOpenChange,
  editingCarousel,
  onSubmit,
  trigger,
}: CarouselDialogProps) {
  const uploadFile = useUploadFile();

  const form = useForm<CarouselForm>({
    resolver: zodResolver(carouselSchema),
    defaultValues: {
      title: editingCarousel?.title ?? "",
      title_id: editingCarousel?.title_id ?? "",
      subtitle: editingCarousel?.subtitle ?? "",
      subtitle_id: editingCarousel?.subtitle_id ?? "",
      image_url: editingCarousel?.image_url ?? "",
      thumbnail_url: editingCarousel?.thumbnail_url ?? "",
      alt_text: editingCarousel?.alt_text ?? "",
      alt_text_id: editingCarousel?.alt_text_id ?? "",
      carousel_order: editingCarousel?.carousel_order?.toString() ?? "0",
      is_active: editingCarousel?.is_active ?? true,
    },
  });

  // Reset form when editingCarousel changes
  React.useEffect(() => {
    if (editingCarousel) {
      form.reset({
        title: editingCarousel.title,
        title_id: editingCarousel.title_id,
        subtitle: editingCarousel.subtitle || "",
        subtitle_id: editingCarousel.subtitle_id || "",
        image_url: editingCarousel.image_url,
        thumbnail_url: editingCarousel.thumbnail_url || "",
        alt_text: editingCarousel.alt_text || "",
        alt_text_id: editingCarousel.alt_text_id || "",
        carousel_order: editingCarousel.carousel_order.toString(),
        is_active: editingCarousel.is_active,
      });
    } else {
      form.reset({
        title: "",
        title_id: "",
        subtitle: "",
        subtitle_id: "",
        image_url: "",
        thumbnail_url: "",
        alt_text: "",
        alt_text_id: "",
        carousel_order: "0",
        is_active: true,
      });
    }
  }, [editingCarousel, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({ file, folder: "carousel" });
      form.setValue("image_url", result.file_url);
      form.setValue("thumbnail_url", result.thumbnail_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const handleSubmit = async (data: CarouselForm) => {
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
            {editingCarousel ? "Edit" : "Add"} Carousel Slide
          </DialogTitle>
          <DialogDescription>
            {editingCarousel ? "Update" : "Create a new"} carousel slide for the
            homepage
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
                        placeholder="Enter slide title in English"
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
                        placeholder="Masukkan judul slide dalam Bahasa Indonesia"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle (English, Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter subtitle in English"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle (Indonesian, Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan subjudul dalam Bahasa Indonesia"
                        {...field}
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
                        <p>Supported formats: JPG, PNG, WEBP</p>
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
                      accept="image/jpeg,image/jpg,image/png,image/webp"
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
              <FormField
                control={form.control}
                name="alt_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Text (English, Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image description for accessibility in English"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alt_text_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Text (Indonesian, Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Deskripsi gambar dalam Bahasa Indonesia"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="carousel_order"
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
                  {editingCarousel ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
