import * as z from "zod";

export const regulationCategoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  name_id: z.string().min(1, "Indonesian name is required"),
  description: z.string(),
  description_id: z.string(),
});

export type RegulationCategoryForm = z.infer<
  typeof regulationCategoryFormSchema
>;
