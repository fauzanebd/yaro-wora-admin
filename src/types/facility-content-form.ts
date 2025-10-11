import * as z from "zod";

export const facilityContentFormSchema = z.object({
  hero_image_url: z.url("Must be a valid URL").or(z.literal("")),
  hero_image_thumbnail_url: z
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Indonesian title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  subtitle_id: z.string().min(1, "Indonesian subtitle is required"),
  facilities_list_section_title: z.string().min(1, "Required"),
  facilities_list_section_title_id: z.string().min(1, "Required"),
  facilities_list_section_description: z.string().optional().or(z.literal("")),
  facilities_list_section_description_id: z
    .string()
    .optional()
    .or(z.literal("")),
  cta_title: z.string().min(1, "Required"),
  cta_title_id: z.string().min(1, "Required"),
  cta_description: z.string().min(1, "Required"),
  cta_description_id: z.string().min(1, "Required"),
  cta_button_text: z.string().min(1, "Required"),
  cta_button_text_id: z.string().min(1, "Required"),
  cta_button_url: z.url("Must be a valid URL"),
});

export type FacilityContentForm = z.infer<typeof facilityContentFormSchema>;
