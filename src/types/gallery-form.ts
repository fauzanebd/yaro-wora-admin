import * as z from "zod";

export const galleryFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Indonesian title is required"),
  short_description: z.string().min(1, "Short description is required"),
  short_description_id: z
    .string()
    .min(1, "Indonesian short description is required"),
  description: z.string().optional().or(z.literal("")),
  description_id: z.string().optional().or(z.literal("")),
  image_url: z.url("Must be a valid URL"),
  thumbnail_url: z.url("Must be a valid URL"),
  category_id: z.number().min(1, "Category is required"),
  photographer: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  tags_id: z.array(z.string()).optional(),
  date_uploaded: z.string().optional(),
});

export type GalleryForm = z.infer<typeof galleryFormSchema>;
