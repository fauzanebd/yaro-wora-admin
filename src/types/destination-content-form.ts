import * as z from "zod";

export const destinationContentFormSchema = z.object({
  hero_image_url: z.url("Must be a valid URL").or(z.literal("")),
  hero_image_thumbnail_url: z
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Indonesian title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  subtitle_id: z.string().min(1, "Indonesian subtitle is required"),
  featured_destination_title: z.string().min(1, "Required"),
  featured_destination_title_id: z.string().min(1, "Required"),
  featured_destination_description: z.string().optional().or(z.literal("")),
  featured_destination_description_id: z.string().optional().or(z.literal("")),
  other_destinations_title: z.string().min(1, "Required"),
  other_destinations_title_id: z.string().min(1, "Required"),
  other_destinations_description: z.string().optional().or(z.literal("")),
  other_destinations_description_id: z.string().optional().or(z.literal("")),
  cta_title: z.string().min(1, "Required"),
  cta_title_id: z.string().min(1, "Required"),
  cta_description: z.string().min(1, "Required"),
  cta_description_id: z.string().min(1, "Required"),
  cta_button_text: z.string().min(1, "Required"),
  cta_button_text_id: z.string().min(1, "Required"),
  cta_button_url: z.url("Must be a valid URL"),
});

export type DestinationContentForm = z.infer<
  typeof destinationContentFormSchema
>;
