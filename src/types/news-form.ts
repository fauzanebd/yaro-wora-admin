import * as z from "zod";

export const newsFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Indonesian title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  excerpt_id: z.string().min(1, "Indonesian excerpt is required"),
  content: z.string().min(1, "Content is required"),
  content_id: z.string().min(1, "Indonesian content is required"),
  image_url: z.url("Must be a valid URL").or(z.literal("")),
  date_published: z.string().min(1, "Publication date is required"),
  author_id: z.number().min(1, "Author is required"),
  category_id: z.number().min(1, "Category is required"),
  tags: z.array(z.string()),
  read_time: z.number().min(1, "Read time is required"),
  is_headline: z.boolean(),
});

export type NewsForm = z.infer<typeof newsFormSchema>;
