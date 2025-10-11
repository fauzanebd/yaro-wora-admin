import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GalleryCategory } from "@/types/api";
import {
  galleryCategoryFormSchema,
  type GalleryCategoryForm,
} from "@/types/gallery-category-form";
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
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GalleryCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: GalleryCategory | null;
  onSubmit: (data: GalleryCategoryForm) => Promise<void>;
  trigger?: React.ReactNode;
  title?: string;
}

export default function GalleryCategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  trigger,
  title = "Category",
}: GalleryCategoryDialogProps) {
  const form = useForm<GalleryCategoryForm>({
    resolver: zodResolver(galleryCategoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      name_id: category?.name_id ?? "",
      description: category?.description ?? "",
      description_id: category?.description_id ?? "",
    },
  });

  React.useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        name_id: category.name_id,
        description: category.description || "",
        description_id: category.description_id || "",
      });
    } else {
      form.reset({
        name: "",
        name_id: "",
        description: "",
        description_id: "",
      });
    }
  }, [category, form]);

  const handleSubmit = async (data: GalleryCategoryForm) => {
    await onSubmit(data);
  };

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Fill the form and save</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nature" {...field} />
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
                    <FormLabel>Name (Indonesian)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Alam" {...field} />
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
                    <FormLabel>Description (English)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Optional" {...field} />
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
                      <Textarea rows={3} placeholder="Opsional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
