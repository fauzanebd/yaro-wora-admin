import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useRegulations,
  useRegulationCategories,
  useCreateRegulation,
  useUpdateRegulation,
  useDeleteRegulation,
} from "@/hooks/useApi";
import type { Regulation } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

const regulationSchema = z.object({
  category_id: z.number().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  sort_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type RegulationForm = z.infer<typeof regulationSchema>;

export default function RegulationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegulation, setEditingRegulation] = useState<Regulation | null>(
    null
  );

  // Query hooks
  const {
    data: regulationsData,
    isLoading: isLoadingRegulations,
    error: regulationsError,
  } = useRegulations();
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useRegulationCategories();

  // Ensure data is always arrays
  const regulations = Array.isArray(regulationsData) ? regulationsData : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  // Mutation hooks
  const createRegulation = useCreateRegulation();
  const updateRegulation = useUpdateRegulation();
  const deleteRegulation = useDeleteRegulation();

  const isLoading = isLoadingRegulations || isLoadingCategories;

  const form = useForm<RegulationForm>({
    resolver: zodResolver(regulationSchema),
    defaultValues: {
      category_id: 0,
      title: "",
      content: "",
      sort_order: 0,
      is_active: true,
    },
  });

  const onSubmit = async (data: RegulationForm) => {
    try {
      if (editingRegulation) {
        await updateRegulation.mutateAsync({
          id: editingRegulation.id,
          regulation: data,
        });
      } else {
        await createRegulation.mutateAsync(data);
      }
      setIsDialogOpen(false);
      form.reset();
      setEditingRegulation(null);
    } catch (error) {
      console.error("Failed to save regulation:", error);
      alert("Failed to save regulation");
    }
  };

  const handleEdit = (regulation: Regulation) => {
    setEditingRegulation(regulation);
    form.reset({
      category_id: regulation.category_id,
      title: regulation.title,
      content: regulation.content,
      sort_order: regulation.sort_order,
      is_active: regulation.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this regulation?")) return;
    try {
      await deleteRegulation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete regulation:", error);
      alert("Failed to delete regulation");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRegulation(null);
    form.reset();
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Regulations</h1>
          <p className="text-muted-foreground">
            Manage village rules and regulations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingRegulation(null);
                form.reset();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Regulation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRegulation ? "Edit" : "Add"} Regulation
              </DialogTitle>
              <DialogDescription>
                {editingRegulation ? "Update" : "Create a new"} regulation or
                rule
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter regulation title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the full regulation content"
                          {...field}
                          rows={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Lower numbers appear first
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Active</FormLabel>
                        </div>
                        <FormDescription>
                          Display this regulation to visitors
                        </FormDescription>
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
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regulations</CardTitle>
          <CardDescription>All village rules and regulations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : regulationsError || categoriesError ? (
            <div className="text-center py-8">
              <p className="text-destructive font-medium mb-2">
                Failed to load regulations data
              </p>
              <p className="text-sm text-muted-foreground">
                {regulationsError instanceof Error
                  ? regulationsError.message
                  : categoriesError instanceof Error
                  ? categoriesError.message
                  : "Unknown error occurred"}
              </p>
            </div>
          ) : regulations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No regulations found. Add your first regulation to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regulations
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((regulation) => (
                    <TableRow key={regulation.id}>
                      <TableCell>{regulation.sort_order}</TableCell>
                      <TableCell className="font-medium">
                        {regulation.title}
                      </TableCell>
                      <TableCell>
                        {getCategoryName(regulation.category_id)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            regulation.is_active ? "default" : "secondary"
                          }
                        >
                          {regulation.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(regulation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(regulation)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(regulation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
