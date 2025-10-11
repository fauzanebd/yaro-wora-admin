import * as z from "zod";

export const newsAuthorFormSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  avatar: z.url("Must be a valid URL").or(z.literal("")),
});

export type NewsAuthorForm = z.infer<typeof newsAuthorFormSchema>;
