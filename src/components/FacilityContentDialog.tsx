import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FacilityPageContent } from "@/types/api";
import {
  facilityContentFormSchema,
  type FacilityContentForm,
} from "@/types/facility-content-form";
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

interface FacilityContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: FacilityPageContent | null;
  onSubmit: (data: FacilityContentForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function FacilityContentDialog({
  open,
  onOpenChange,
  content,
  onSubmit,
  trigger,
}: FacilityContentDialogProps) {
  const uploadFile = useUploadFile();

  const form = useForm<FacilityContentForm>({
    resolver: zodResolver(facilityContentFormSchema),
    defaultValues: {
      hero_image_url: content?.hero_image_url ?? "",
      hero_image_thumbnail_url: content?.hero_image_thumbnail_url ?? "",
      title: content?.title ?? "",
      title_id: content?.title_id ?? "",
      subtitle: content?.subtitle ?? "",
      subtitle_id: content?.subtitle_id ?? "",
      facilities_list_section_title:
        content?.facilities_list_section_title ?? "",
      facilities_list_section_title_id:
        content?.facilities_list_section_title_id ?? "",
      facilities_list_section_description:
        content?.facilities_list_section_description ?? "",
      facilities_list_section_description_id:
        content?.facilities_list_section_description_id ?? "",
      cta_title: content?.cta_title ?? "",
      cta_title_id: content?.cta_title_id ?? "",
      cta_description: content?.cta_description ?? "",
      cta_description_id: content?.cta_description_id ?? "",
      cta_button_text: content?.cta_button_text ?? "",
      cta_button_text_id: content?.cta_button_text_id ?? "",
      cta_button_url: content?.cta_button_url ?? "",
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
        facilities_list_section_title: content.facilities_list_section_title,
        facilities_list_section_title_id:
          content.facilities_list_section_title_id,
        facilities_list_section_description:
          content.facilities_list_section_description || "",
        facilities_list_section_description_id:
          content.facilities_list_section_description_id || "",
        cta_title: content.cta_title,
        cta_title_id: content.cta_title_id,
        cta_description: content.cta_description,
        cta_description_id: content.cta_description_id,
        cta_button_text: content.cta_button_text,
        cta_button_text_id: content.cta_button_text_id,
        cta_button_url: content.cta_button_url,
      });
    } else {
      form.reset({
        hero_image_url: "",
        hero_image_thumbnail_url: "",
        title: "",
        title_id: "",
        subtitle: "",
        subtitle_id: "",
        facilities_list_section_title: "",
        facilities_list_section_title_id: "",
        facilities_list_section_description: "",
        facilities_list_section_description_id: "",
        cta_title: "",
        cta_title_id: "",
        cta_description: "",
        cta_description_id: "",
        cta_button_text: "",
        cta_button_text_id: "",
        cta_button_url: "",
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
        folder: "facilities-hero",
      });
      form.setValue("hero_image_url", result.file_url);
      form.setValue("hero_image_thumbnail_url", result.thumbnail_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload header image");
    }
  };

  const handleSubmit = async (data: FacilityContentForm) => {
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
          <DialogTitle>Edit Facilities Page Content</DialogTitle>
          <DialogDescription>
            Update header, facilities list section and CTA sections
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
                            placeholder="e.g., Our Facilities"
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
                            placeholder="e.g., Fasilitas Kami"
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
                        accept="image/jpeg,image/jpg,image/png"
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
                          Main hero image for the facilities page
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
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    Facilities List Section
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="facilities_list_section_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (EN)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="facilities_list_section_title_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (ID)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="facilities_list_section_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (EN)</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="facilities_list_section_description_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (ID)</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    Call-to-Action Section
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cta_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Title (EN)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cta_title_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Title (ID)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cta_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Text (EN)</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cta_description_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Text (ID)</FormLabel>
                          <FormControl>
                            <Textarea rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cta_button_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text (EN)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cta_button_text_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text (ID)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="cta_button_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/contact"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL that the CTA button will navigate to
                        </FormDescription>
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
