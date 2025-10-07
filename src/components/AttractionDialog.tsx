import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUploadFile } from "@/hooks/useApi";
import type { Attraction } from "@/types/api";
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
import { Upload, X } from "lucide-react";

const attractionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Title (Indonesian) is required"),
  subtitle: z.string().optional(),
  subtitle_id: z.string().optional(),
  description: z.string().optional(),
  description_id: z.string().optional(),
  image_url: z.url("Must be a valid URL"),
  highlights: z.array(z.string()),
  highlights_id: z.array(z.string()),
  sort_order: z.number().int().min(0),
  active: z.boolean(),
});

type AttractionForm = z.infer<typeof attractionSchema>;

interface AttractionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAttraction: Attraction | null;
  onSubmit: (data: AttractionForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function AttractionDialog({
  open,
  onOpenChange,
  editingAttraction,
  onSubmit,
  trigger,
}: AttractionDialogProps) {
  const uploadFile = useUploadFile();
  const [highlightInputEN, setHighlightInputEN] = React.useState("");
  const [highlightInputID, setHighlightInputID] = React.useState("");

  const form = useForm<AttractionForm>({
    resolver: zodResolver(attractionSchema),
    defaultValues: {
      title: editingAttraction?.title ?? "",
      title_id: editingAttraction?.title_id ?? "",
      subtitle: editingAttraction?.subtitle ?? "",
      subtitle_id: editingAttraction?.subtitle_id ?? "",
      description: editingAttraction?.description ?? "",
      description_id: editingAttraction?.description_id ?? "",
      image_url: editingAttraction?.image_url ?? "",
      highlights: editingAttraction?.highlights ?? [],
      highlights_id: editingAttraction?.highlights_id ?? [],
      sort_order: editingAttraction?.sort_order ?? 0,
      active: editingAttraction?.active ?? true,
    },
  });

  React.useEffect(() => {
    if (editingAttraction) {
      form.reset({
        title: editingAttraction.title,
        title_id: editingAttraction.title_id,
        subtitle: editingAttraction.subtitle || "",
        subtitle_id: editingAttraction.subtitle_id || "",
        description: editingAttraction.description || "",
        description_id: editingAttraction.description_id || "",
        image_url: editingAttraction.image_url,
        highlights: editingAttraction.highlights || [],
        highlights_id: editingAttraction.highlights_id || [],
        sort_order: editingAttraction.sort_order,
        active: editingAttraction.active,
      });
    } else {
      form.reset({
        title: "",
        title_id: "",
        subtitle: "",
        subtitle_id: "",
        description: "",
        description_id: "",
        image_url: "",
        highlights: [],
        highlights_id: [],
        sort_order: 0,
        active: true,
      });
    }
  }, [editingAttraction, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "attractions",
      });
      form.setValue("image_url", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const addHighlightEN = () => {
    if (highlightInputEN.trim()) {
      const current = form.getValues("highlights") || [];
      form.setValue("highlights", [...current, highlightInputEN.trim()]);
      setHighlightInputEN("");
    }
  };

  const removeHighlightEN = (index: number) => {
    const current = form.getValues("highlights") || [];
    form.setValue(
      "highlights",
      current.filter((_: string, i: number) => i !== index)
    );
  };

  const addHighlightID = () => {
    if (highlightInputID.trim()) {
      const current = form.getValues("highlights_id") || [];
      form.setValue("highlights_id", [...current, highlightInputID.trim()]);
      setHighlightInputID("");
    }
  };

  const removeHighlightID = (index: number) => {
    const current = form.getValues("highlights_id") || [];
    form.setValue(
      "highlights_id",
      current.filter((_: string, i: number) => i !== index)
    );
  };

  const handleSubmit = async (data: AttractionForm) => {
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
            {editingAttraction ? "Edit" : "Add"} Attraction
          </DialogTitle>
          <DialogDescription>
            {editingAttraction ? "Update" : "Create a new"} attraction item
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (English)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title in English"
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
                        <Input placeholder="Masukkan judul" {...field} />
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
                      <FormLabel>Subtitle (English)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter subtitle (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle (Indonesian)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan subjudul (opsional)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Opsional</FormDescription>
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
                      <FormLabel>Description (English)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
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
                          placeholder="Masukkan deskripsi"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Opsional</FormDescription>
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
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Or paste image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormLabel>Highlights (English)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={highlightInputEN}
                      onChange={(e) => setHighlightInputEN(e.target.value)}
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
                  <FormLabel>Highlights (Indonesian)</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={highlightInputID}
                      onChange={(e) => setHighlightInputID(e.target.value)}
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
                          placeholder="0"
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
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0 pt-8">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Active</FormLabel>
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
                <Button type="submit" disabled={uploadFile.isPending}>
                  {editingAttraction ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
