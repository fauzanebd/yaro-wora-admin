import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUploadFile } from "@/hooks/useApi";
import type { SocialMedia } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

const socialMediaSchema = z.object({
  name: z.string().min(1, "Social media name is required"),
  handle: z.string().min(1, "Handle is required"),
  url: z.url("Must be a valid URL"),
  icon_url: z.url("Must be a valid URL"),
});

type SocialMediaForm = z.infer<typeof socialMediaSchema>;

interface SocialMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSocialMedia: SocialMedia | null;
  onSubmit: (data: SocialMediaForm) => void;
  trigger?: React.ReactNode;
}

export default function SocialMediaDialog({
  open,
  onOpenChange,
  editingSocialMedia,
  onSubmit,
  trigger,
}: SocialMediaDialogProps) {
  const uploadFile = useUploadFile();

  const form = useForm<SocialMediaForm>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      name: editingSocialMedia?.name ?? "",
      handle: editingSocialMedia?.handle ?? "",
      url: editingSocialMedia?.url ?? "",
      icon_url: editingSocialMedia?.icon_url ?? "",
    },
  });

  // Reset form when editingSocialMedia changes
  React.useEffect(() => {
    if (editingSocialMedia) {
      form.reset({
        name: editingSocialMedia.name,
        handle: editingSocialMedia.handle,
        url: editingSocialMedia.url,
        icon_url: editingSocialMedia.icon_url,
      });
    } else {
      form.reset({
        name: "",
        handle: "",
        url: "",
        icon_url: "",
      });
    }
  }, [editingSocialMedia, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "social-media",
      });
      form.setValue("icon_url", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload icon");
    }
  };

  const handleSubmit = (data: SocialMediaForm) => {
    onSubmit(data);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingSocialMedia ? "Edit" : "Add"} Social Media
          </DialogTitle>
          <DialogDescription>
            {editingSocialMedia ? "Update" : "Add a new"} social media platform
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Instagram, Facebook, Twitter"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handle/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., @yarowora_official" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://instagram.com/yarowora_official"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FormLabel>Icon</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supported formats: SVG, PNG</p>
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
                      {uploadFile.isPending ? "Uploading..." : "Upload Icon"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/svg+xml,image/png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {form.watch("icon_url") && (
                <div className="flex items-center gap-2">
                  <img
                    src={form.watch("icon_url")}
                    alt="Icon Preview"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-sm text-muted-foreground">
                    Icon Preview
                  </span>
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name="icon_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Or paste icon URL" {...field} />
                  </FormControl>
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
                {editingSocialMedia ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
