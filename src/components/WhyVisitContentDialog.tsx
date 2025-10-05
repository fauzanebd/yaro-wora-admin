import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { WhyVisitContent } from "@/types/api";
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
import { Edit } from "lucide-react";

const whyVisitContentSchema = z.object({
  why_visit_section_title: z.string().min(1, "Section title is required"),
  why_visit_section_title_id: z
    .string()
    .min(1, "Section title (Indonesian) is required"),
  why_visit_section_description: z.string().optional(),
  why_visit_section_description_id: z.string().optional(),
});

type WhyVisitContentForm = z.infer<typeof whyVisitContentSchema>;

interface WhyVisitContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: WhyVisitContent | null;
  onSubmit: (data: WhyVisitContentForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function WhyVisitContentDialog({
  open,
  onOpenChange,
  content,
  onSubmit,
  trigger,
}: WhyVisitContentDialogProps) {
  const form = useForm<WhyVisitContentForm>({
    resolver: zodResolver(whyVisitContentSchema),
    defaultValues: {
      why_visit_section_title: content?.why_visit_section_title ?? "",
      why_visit_section_title_id: content?.why_visit_section_title_id ?? "",
      why_visit_section_description:
        content?.why_visit_section_description ?? "",
      why_visit_section_description_id:
        content?.why_visit_section_description_id ?? "",
    },
  });

  // Reset form when content changes
  React.useEffect(() => {
    if (content) {
      form.reset({
        why_visit_section_title: content.why_visit_section_title,
        why_visit_section_title_id: content.why_visit_section_title_id,
        why_visit_section_description:
          content.why_visit_section_description || "",
        why_visit_section_description_id:
          content.why_visit_section_description_id || "",
      });
    } else {
      form.reset({
        why_visit_section_title: "",
        why_visit_section_title_id: "",
        why_visit_section_description: "",
        why_visit_section_description_id: "",
      });
    }
  }, [content, form]);

  const handleSubmit = async (data: WhyVisitContentForm) => {
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
          <DialogTitle>Edit Why Visit Section Content</DialogTitle>
          <DialogDescription>
            Update the title and description for the Why Visit section
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="why_visit_section_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title (English)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter section title in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="why_visit_section_title_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title (Indonesian)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan judul section dalam Bahasa Indonesia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="why_visit_section_description"
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
              name="why_visit_section_description_id"
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
