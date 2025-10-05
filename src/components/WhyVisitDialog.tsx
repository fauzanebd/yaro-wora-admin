import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUploadFile } from "@/hooks/useApi";
import type { WhyVisit } from "@/types/api";
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

const whyVisitSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Title (Indonesian) is required"),
  description: z.string().optional(),
  description_id: z.string().optional(),
  icon_url: z.url("Must be a valid URL"),
});

type WhyVisitForm = z.infer<typeof whyVisitSchema>;

interface WhyVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingWhyVisit: WhyVisit | null;
  onSubmit: (data: WhyVisitForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function WhyVisitDialog({
  open,
  onOpenChange,
  editingWhyVisit,
  onSubmit,
  trigger,
}: WhyVisitDialogProps) {
  const uploadFile = useUploadFile();

  const form = useForm<WhyVisitForm>({
    resolver: zodResolver(whyVisitSchema),
    defaultValues: {
      title: editingWhyVisit?.title ?? "",
      title_id: editingWhyVisit?.title_id ?? "",
      description: editingWhyVisit?.description ?? "",
      description_id: editingWhyVisit?.description_id ?? "",
      icon_url: editingWhyVisit?.icon_url ?? "",
    },
  });

  // Reset form when editingWhyVisit changes
  React.useEffect(() => {
    if (editingWhyVisit) {
      form.reset({
        title: editingWhyVisit.title,
        title_id: editingWhyVisit.title_id,
        description: editingWhyVisit.description || "",
        description_id: editingWhyVisit.description_id || "",
        icon_url: editingWhyVisit.icon_url,
      });
    } else {
      form.reset({
        title: "",
        title_id: "",
        description: "",
        description_id: "",
        icon_url: "",
      });
    }
  }, [editingWhyVisit, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "why-visit",
      });
      form.setValue("icon_url", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload icon");
    }
  };

  const handleSubmit = async (data: WhyVisitForm) => {
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
            {editingWhyVisit ? "Edit" : "Add"} Why Visit Item
          </DialogTitle>
          <DialogDescription>
            {editingWhyVisit ? "Update" : "Create a new"} why visit item for the
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
                      <Input placeholder="Enter title in English" {...field} />
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
                        placeholder="Masukkan judul dalam Bahasa Indonesia"
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
                    <FormLabel>Description (English, Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description in English"
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
                    <FormLabel>Description (Indonesian, Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan deskripsi dalam Bahasa Indonesia"
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
                      className="h-12 w-12 object-contain"
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
                  {editingWhyVisit ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
