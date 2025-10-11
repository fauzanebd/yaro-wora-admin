import * as z from "zod";

export const heritageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Indonesian title is required"),
  short_description: z.string().min(1, "Short description is required"),
  short_description_id: z
    .string()
    .min(1, "Indonesian short description is required"),
  description: z.string().min(1, "Description is required"),
  description_id: z.string().min(1, "Indonesian description is required"),
  image_url: z.string().min(1, "Image URL is required"),
  thumbnail_url: z.string().optional(),
  heritage_detail_sections: z.array(
    z.object({
      title: z.string().min(1, "Section title is required"),
      title_id: z.string().min(1, "Indonesian section title is required"),
      content: z.string().min(1, "Section content is required"),
      content_id: z.string().min(1, "Indonesian section content is required"),
      image_url: z.string().optional(),
    })
  ),
  sort_order: z.number().min(0, "Sort order must be non-negative"),
});

export type HeritageForm = z.infer<typeof heritageFormSchema>;
