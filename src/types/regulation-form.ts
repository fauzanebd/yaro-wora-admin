import * as z from "zod";

export const regulationFormSchema = z.object({
  category_id: z.number().min(1, "Category is required"),
  question: z.string().min(1, "Question is required"),
  question_id: z.string().min(1, "Indonesian question is required"),
  answer: z.string().min(1, "Answer is required"),
  answer_id: z.string().min(1, "Indonesian answer is required"),
});

export type RegulationForm = z.infer<typeof regulationFormSchema>;
