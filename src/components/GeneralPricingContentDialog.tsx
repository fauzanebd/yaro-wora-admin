import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { GeneralPricingContent } from "@/types/api";
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

const generalPricingContentSchema = z.object({
  general_pricing_section_title: z.string().min(1, "Section title is required"),
  general_pricing_section_title_id: z
    .string()
    .min(1, "Section title (Indonesian) is required"),
  general_pricing_section_description: z.string().optional(),
  general_pricing_section_description_id: z.string().optional(),
});

type GeneralPricingContentForm = z.infer<typeof generalPricingContentSchema>;

interface GeneralPricingContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: GeneralPricingContent | null;
  onSubmit: (data: GeneralPricingContentForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function GeneralPricingContentDialog({
  open,
  onOpenChange,
  content,
  onSubmit,
  trigger,
}: GeneralPricingContentDialogProps) {
  const form = useForm<GeneralPricingContentForm>({
    resolver: zodResolver(generalPricingContentSchema),
    defaultValues: {
      general_pricing_section_title:
        content?.general_pricing_section_title ?? "",
      general_pricing_section_title_id:
        content?.general_pricing_section_title_id ?? "",
      general_pricing_section_description:
        content?.general_pricing_section_description ?? "",
      general_pricing_section_description_id:
        content?.general_pricing_section_description_id ?? "",
    },
  });

  React.useEffect(() => {
    if (content) {
      form.reset({
        general_pricing_section_title: content.general_pricing_section_title,
        general_pricing_section_title_id:
          content.general_pricing_section_title_id,
        general_pricing_section_description:
          content.general_pricing_section_description || "",
        general_pricing_section_description_id:
          content.general_pricing_section_description_id || "",
      });
    } else {
      form.reset({
        general_pricing_section_title: "",
        general_pricing_section_title_id: "",
        general_pricing_section_description: "",
        general_pricing_section_description_id: "",
      });
    }
  }, [content, form]);

  const handleSubmit = async (data: GeneralPricingContentForm) => {
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
          <DialogTitle>Edit Pricing Section Content</DialogTitle>
          <DialogDescription>
            Update the title and description for the Pricing section
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="general_pricing_section_title"
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
              name="general_pricing_section_title_id"
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
              name="general_pricing_section_description"
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
              name="general_pricing_section_description_id"
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
