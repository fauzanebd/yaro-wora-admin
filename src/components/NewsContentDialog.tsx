import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NewsPageContent } from "@/types/api";
import {
  newsContentFormSchema,
  type NewsContentForm,
} from "@/types/news-content-form";
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
import { useUploadFile } from "@/hooks/useApi";

interface NewsContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: NewsPageContent | null;
  onSubmit: (data: NewsContentForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function NewsContentDialog({
  open,
  onOpenChange,
  content,
  onSubmit,
  trigger,
}: NewsContentDialogProps) {
  const uploadFile = useUploadFile();

  const form = useForm<NewsContentForm>({
    resolver: zodResolver(newsContentFormSchema),
    defaultValues: {
      hero_image_url: content?.hero_image_url ?? "",
      hero_image_thumbnail_url: content?.hero_image_thumbnail_url ?? "",
      title: content?.title ?? "",
      title_id: content?.title_id ?? "",
      subtitle: content?.subtitle ?? "",
      subtitle_id: content?.subtitle_id ?? "",
      highlight_section_title: content?.highlight_section_title ?? "",
      highlight_section_title_id: content?.highlight_section_title_id ?? "",
    },
  });

  React.useEffect(() => {
    if (content) {
      form.reset({
        hero_image_url: content.hero_image_url || "",
        hero_image_thumbnail_url: content.hero_image_thumbnail_url || "",
        title: content.title,
        title_id: content.title_id,
        subtitle: content.subtitle,
        subtitle_id: content.subtitle_id,
        highlight_section_title: content.highlight_section_title,
        highlight_section_title_id: content.highlight_section_title_id,
      });
    } else {
      form.reset({
        hero_image_url: "",
        hero_image_thumbnail_url: "",
        title: "",
        title_id: "",
        subtitle: "",
        subtitle_id: "",
        highlight_section_title: "",
        highlight_section_title_id: "",
      });
    }
  }, [content, form]);

  const handleHeaderImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "news-hero",
      });
      form.setValue("hero_image_url", result.file_url);
      form.setValue("hero_image_thumbnail_url", result.thumbnail_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload header image");
    }
  };

  const handleSubmit = async (data: NewsContentForm) => {
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
          <DialogTitle>Edit News Page Content</DialogTitle>
          <DialogDescription>
            Update header, title, subtitle and highlight sections
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (EN)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., News & Updates"
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
                        <FormLabel>Title (ID)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Berita & Informasi"
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
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle (EN)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Intro copy..."
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
                        <FormLabel>Subtitle (ID)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Teks pengantar..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel>Hero Image</FormLabel>
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
                            : "Upload Hero Image"}
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleHeaderImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {form.watch("hero_image_url") && (
                    <img
                      src={form.watch("hero_image_url")}
                      alt="Hero Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="hero_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Or paste image URL (https://...)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Main hero image for the news page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hero_image_thumbnail_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hero Image Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Auto-generated on upload"
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
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Highlight Section</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="highlight_section_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlight Title (EN)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Latest News" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="highlight_section_title_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlight Title (ID)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Berita Terbaru"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                <Button type="submit">Save Content</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
