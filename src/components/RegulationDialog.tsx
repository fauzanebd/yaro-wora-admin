import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegulationCategories } from "@/hooks/useApi";
import type { Regulation } from "@/types/api";
import {
  regulationFormSchema,
  type RegulationForm,
} from "@/types/regulation-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRegulation: Regulation | null;
  onSubmit: (data: RegulationForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function RegulationDialog({
  open,
  onOpenChange,
  editingRegulation,
  onSubmit,
  trigger,
}: RegulationDialogProps) {
  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useRegulationCategories();

  const form = useForm<RegulationForm>({
    resolver: zodResolver(regulationFormSchema),
    defaultValues: {
      category_id: editingRegulation?.category_id ?? 0,
      question: editingRegulation?.question ?? "",
      question_id: editingRegulation?.question_id ?? "",
      answer: editingRegulation?.answer ?? "",
      answer_id: editingRegulation?.answer_id ?? "",
    },
  });

  React.useEffect(() => {
    if (editingRegulation) {
      form.reset({
        category_id: editingRegulation.category_id,
        question: editingRegulation.question,
        question_id: editingRegulation.question_id,
        answer: editingRegulation.answer,
        answer_id: editingRegulation.answer_id,
      });
    } else {
      form.reset({
        category_id: 0,
        question: "",
        question_id: "",
        answer: "",
        answer_id: "",
      });
    }
  }, [editingRegulation, form]);

  const handleSubmit = async (data: RegulationForm) => {
    await onSubmit(data);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingRegulation ? "Edit" : "Add"} Regulation
          </DialogTitle>
          <DialogDescription>
            {editingRegulation ? "Update" : "Create a new"} regulation or rule
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value ? Number(value) : undefined)
                      }
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : categoriesError ? (
                          <SelectItem value="" disabled>
                            Error loading categories
                          </SelectItem>
                        ) : categories && categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              <div className="flex items-center gap-2">
                                {category.name}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No categories available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Enter the question"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="question_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question (ID)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Masukkan pertanyaan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Enter the answer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="answer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer (ID)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Masukkan jawaban"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRegulation ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
