import * as z from "zod";

export const sectionSchema = z.object({
  title: z.string().min(1, "Required"),
  title_id: z.string().min(1, "Required"),
  content: z.string().min(1, "Required"),
  content_id: z.string().min(1, "Required"),
  image_url: z.string().optional(),
});

export const destinationFormSchema = z.object({
  title: z.string().min(1, "Required"),
  title_id: z.string().min(1, "Required"),
  short_description: z.string().min(1, "Required"),
  short_description_id: z.string().min(1, "Required"),
  about: z.string().min(1, "Required"),
  about_id: z.string().min(1, "Required"),
  image_url: z.url("Must be a valid URL").optional(),
  thumbnail_url: z.url().optional(),
  category_id: z.number().int().optional(),
  destination_detail_sections: z.array(sectionSchema),
  highlights: z.array(z.string()),
  highlights_id: z.array(z.string()),
  cta_url: z.url("Must be a valid URL").optional().or(z.literal("")),
  google_maps_url: z.url("Must be a valid URL").optional().or(z.literal("")),
  is_featured: z.boolean().optional(),
  sort_order: z.number().optional(),
});

export type DestinationForm = z.infer<typeof destinationFormSchema>;
export type DestinationSectionForm = z.infer<typeof sectionSchema>;
