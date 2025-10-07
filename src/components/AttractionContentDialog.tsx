import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { GeneralAttractionContent } from "@/types/api";
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

const contentSchema = z.object({
  attraction_section_title_part_1: z
    .string()
    .min(1, "Section title is required"),
  attraction_section_title_part_2: z
    .string()
    .min(1, "Section title is required"),
  attraction_section_title_part_1_id: z
    .string()
    .min(1, "Section title (Indonesian) is required"),
  attraction_section_title_part_2_id: z
    .string()
    .min(1, "Section title (Indonesian) is required"),
  attraction_section_description: z.string().optional(),
  attraction_section_description_id: z.string().optional(),
});

type AttractionContentForm = z.infer<typeof contentSchema>;

interface AttractionContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: GeneralAttractionContent | null;
  onSubmit: (data: AttractionContentForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function AttractionContentDialog({
  open,
  onOpenChange,
  content,
  onSubmit,
  trigger,
}: AttractionContentDialogProps) {
  const form = useForm<AttractionContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      attraction_section_title_part_1:
        content?.attraction_section_title_part_1 ?? "",
      attraction_section_title_part_1_id:
        content?.attraction_section_title_part_1_id ?? "",
      attraction_section_title_part_2:
        content?.attraction_section_title_part_2 ?? "",
      attraction_section_title_part_2_id:
        content?.attraction_section_title_part_2_id ?? "",
      attraction_section_description:
        content?.attraction_section_description ?? "",
      attraction_section_description_id:
        content?.attraction_section_description_id ?? "",
    },
  });

  React.useEffect(() => {
    if (content) {
      form.reset({
        attraction_section_title_part_1:
          content.attraction_section_title_part_1,
        attraction_section_title_part_1_id:
          content.attraction_section_title_part_1_id,
        attraction_section_title_part_2:
          content.attraction_section_title_part_2,
        attraction_section_title_part_2_id:
          content.attraction_section_title_part_2_id,
        attraction_section_description:
          content.attraction_section_description || "",
        attraction_section_description_id:
          content.attraction_section_description_id || "",
      });
    } else {
      form.reset({
        attraction_section_title_part_1: "",
        attraction_section_title_part_1_id: "",
        attraction_section_title_part_2: "",
        attraction_section_title_part_2_id: "",
        attraction_section_description: "",
        attraction_section_description_id: "",
      });
    }
  }, [content, form]);

  const handleSubmit = async (data: AttractionContentForm) => {
    await onSubmit(data);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Attractions Section Content</DialogTitle>
          <DialogDescription>
            Update the title and description for the Attractions section
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="attraction_section_title_part_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title Part 1 (English)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter section title part 1 in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attraction_section_title_part_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title Part 2 (English)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter section title part 2 in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attraction_section_title_part_1_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title Part 1 (Indonesian)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul section part 1 dalam Bahasa Indonesia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attraction_section_title_part_2_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title Part 2 (Indonesian)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul section part 2 dalam Bahasa Indonesia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attraction_section_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Description (English, Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter section description in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attraction_section_description_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Section Description (Indonesian, Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi section"
                      {...field}
                    />
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
              <Button type="submit">Update Content</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
