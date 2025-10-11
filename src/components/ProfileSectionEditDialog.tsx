import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUploadFile } from "@/hooks/useApi";
import type { ProfileSection } from "@/types/api";
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

const profileSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Indonesian title is required"),
  content: z.string().min(1, "Content is required"),
  content_id: z.string().min(1, "Indonesian content is required"),
  image_url: z.string().url("Must be a valid URL").or(z.literal("")),
});

type ProfileSectionForm = z.infer<typeof profileSectionSchema>;

interface ProfileSectionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: ProfileSection | null;
  onSubmit: (data: ProfileSection) => Promise<void> | void;
  trigger?: React.ReactNode;
  title?: string;
}

export default function ProfileSectionEditDialog({
  open,
  onOpenChange,
  section,
  onSubmit,
  trigger,
  title = "Edit Profile Section",
}: ProfileSectionEditDialogProps) {
  const uploadFile = useUploadFile();
  const form = useForm<ProfileSectionForm>({
    resolver: zodResolver(profileSectionSchema),
    defaultValues: {
      title: "",
      title_id: "",
      content: "",
      content_id: "",
      image_url: "",
    },
  });

  // Reset form when section changes
  useEffect(() => {
    if (section) {
      form.reset({
        title: section.title,
        title_id: section.title_id,
        content: section.content,
        content_id: section.content_id,
        image_url: section.image_url || "",
      });
    } else {
      form.reset({
        title: "",
        title_id: "",
        content: "",
        content_id: "",
        image_url: "",
      });
    }
  }, [section, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "profile-sections",
      });
      form.setValue("image_url", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const handleSubmit = async (data: ProfileSectionForm) => {
    const transformedData: ProfileSection = {
      ...data,
      image_url: data.image_url || undefined,
    };
    await onSubmit(transformedData);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Create or edit a profile section with title, content, and optional
            image
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Title Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Section Title</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Our History" {...field} />
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
                          <Input placeholder="e.g., Sejarah Kami" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (English)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            placeholder="Enter the section content in English. Markdown is supported for formatting."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Content supports markdown formatting (e.g., **bold**,
                          *italic*, ## headings)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (Indonesian)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={8}
                            placeholder="Masukkan konten bagian dalam Bahasa Indonesia. Markdown didukung untuk pemformatan."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Konten mendukung pemformatan markdown (contoh:
                          **tebal**, *miring*, ## judul)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Image (Optional)</h3>
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
                          {uploadFile.isPending
                            ? "Uploading..."
                            : "Upload Image"}
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
                          placeholder="Or paste image URL (https://example.com/image.jpg)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional image to display with this section
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {section ? "Update Section" : "Add Section"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
