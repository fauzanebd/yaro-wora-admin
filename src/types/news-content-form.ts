import * as z from "zod";

export const newsContentFormSchema = z.object({
  hero_image_url: z.url("Must be a valid URL").or(z.literal("")),
  hero_image_thumbnail_url: z
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Indonesian title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  subtitle_id: z.string().min(1, "Indonesian subtitle is required"),
  highlight_section_title: z.string().min(1, "Highlight title is required"),
  highlight_section_title_id: z
    .string()
    .min(1, "Indonesian highlight title is required"),
});

export type NewsContentForm = z.infer<typeof newsContentFormSchema>;
