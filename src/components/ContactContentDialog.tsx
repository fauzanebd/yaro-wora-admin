import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ContactContent } from "@/types/api";
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

const contactContentSchema = z.object({
  contact_section_title_part_1: z.string().min(1, "Section title is required"),
  contact_section_title_part_2: z.string().min(1, "Section title is required"),
  contact_section_title_part_1_id: z
    .string()
    .min(1, "Section title (Indonesian) is required"),
  contact_section_title_part_2_id: z
    .string()
    .min(1, "Section title (Indonesian) is required"),
  contact_section_description: z.string(),
  contact_section_description_id: z.string(),
});

type ContactContentForm = z.infer<typeof contactContentSchema>;

interface ContactContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ContactContent | null;
  onSubmit: (data: ContactContentForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function ContactContentDialog({
  open,
  onOpenChange,
  content,
  onSubmit,
  trigger,
}: ContactContentDialogProps) {
  const form = useForm<ContactContentForm>({
    resolver: zodResolver(contactContentSchema),
    defaultValues: {
      contact_section_title_part_1: content?.contact_section_title_part_1 ?? "",
      contact_section_title_part_2: content?.contact_section_title_part_2 ?? "",
      contact_section_title_part_1_id:
        content?.contact_section_title_part_1_id ?? "",
      contact_section_title_part_2_id:
        content?.contact_section_title_part_2_id ?? "",
      contact_section_description: content?.contact_section_description ?? "",
      contact_section_description_id:
        content?.contact_section_description_id ?? "",
    },
  });

  // Reset form when content changes
  React.useEffect(() => {
    if (content) {
      form.reset({
        contact_section_title_part_1: content.contact_section_title_part_1,
        contact_section_title_part_2: content.contact_section_title_part_2,
        contact_section_title_part_1_id:
          content.contact_section_title_part_1_id,
        contact_section_title_part_2_id:
          content.contact_section_title_part_2_id,
        contact_section_description: content.contact_section_description || "",
        contact_section_description_id:
          content.contact_section_description_id || "",
      });
    } else {
      form.reset({
        contact_section_title_part_1: "",
        contact_section_title_part_2: "",
        contact_section_title_part_1_id: "",
        contact_section_title_part_2_id: "",
        contact_section_description: "",
        contact_section_description_id: "",
      });
    }
  }, [content, form]);

  const handleSubmit = async (data: ContactContentForm) => {
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
          <DialogTitle>Edit Contact Section Content</DialogTitle>
          <DialogDescription>
            Update the title and description for the Contact section
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="contact_section_title_part_1"
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
              name="contact_section_title_part_2"
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
              name="contact_section_title_part_1_id"
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
              name="contact_section_title_part_2_id"
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
              name="contact_section_description"
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
              name="contact_section_description_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Section Description (Indonesian, Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi section dalam Bahasa Indonesia"
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
