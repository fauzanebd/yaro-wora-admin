import * as z from "zod";

export const facilityFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_id: z.string().min(1, "Indonesian name is required"),
  short_description: z.string().min(1, "Short description is required"),
  short_description_id: z
    .string()
    .min(1, "Indonesian short description is required"),
  description: z.string().min(1, "Description is required"),
  description_id: z.string().min(1, "Indonesian description is required"),
  image_url: z.string().min(1, "Image URL is required"),
  thumbnail_url: z.string().optional(),
  category_id: z.number().optional(),
  facility_detail_sections: z.array(
    z.object({
      title: z.string(),
      title_id: z.string(),
      content: z.string(),
      content_id: z.string(),
      image_url: z.string().optional(),
    })
  ),
  highlights: z.array(z.string()),
  highlights_id: z.array(z.string()),
  duration: z.string().min(1, "Duration is required"),
  duration_id: z.string().min(1, "Indonesian duration is required"),
  capacity: z.string().min(1, "Capacity is required"),
  capacity_id: z.string().min(1, "Indonesian capacity is required"),
  price: z.string().min(1, "Price is required"),
  price_id: z.string().min(1, "Indonesian price is required"),
  cta_url: z.url("Must be a valid URL").or(z.literal("")),
  is_featured: z.boolean().optional(),
  sort_order: z.number().optional(),
});

export type FacilityForm = z.infer<typeof facilityFormSchema>;
