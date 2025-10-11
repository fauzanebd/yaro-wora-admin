import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useUploadFile,
  useNewsCategories,
  useNewsAuthors,
} from "@/hooks/useApi";
import type { NewsArticle } from "@/types/api";
import { newsFormSchema, type NewsForm } from "@/types/news-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Upload, X, Calendar } from "lucide-react";

interface NewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingArticle: NewsArticle | null;
  onSubmit: (data: NewsForm) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function NewsDialog({
  open,
  onOpenChange,
  editingArticle,
  onSubmit,
  trigger,
}: NewsDialogProps) {
  const uploadFile = useUploadFile();
  const [tagInputEN, setTagInputEN] = React.useState("");

  // Fetch categories and authors
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useNewsCategories();

  const {
    data: authors,
    isLoading: authorsLoading,
    error: authorsError,
  } = useNewsAuthors();

  const form = useForm<NewsForm>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: editingArticle?.title ?? "",
      title_id: editingArticle?.title_id ?? "",
      excerpt: editingArticle?.excerpt ?? "",
      excerpt_id: editingArticle?.excerpt_id ?? "",
      content: editingArticle?.content ?? "",
      content_id: editingArticle?.content_id ?? "",
      image_url: editingArticle?.image_url ?? "",
      date_published:
        editingArticle?.date_published ??
        new Date().toISOString().split("T")[0],
      author_id: editingArticle?.author_id ?? 0,
      category_id: editingArticle?.category_id ?? 0,
      tags: editingArticle?.tags ?? [],
      read_time: editingArticle?.read_time ?? 1,
      is_headline: editingArticle?.is_headline ?? false,
    },
  });

  React.useEffect(() => {
    if (editingArticle) {
      form.reset({
        title: editingArticle.title,
        title_id: editingArticle.title_id,
        excerpt: editingArticle.excerpt,
        excerpt_id: editingArticle.excerpt_id,
        content: editingArticle.content,
        content_id: editingArticle.content_id,
        image_url: editingArticle.image_url,
        date_published: editingArticle.date_published.split("T")[0], // Convert to date input format
        author_id: editingArticle.author_id,
        category_id: editingArticle.category_id,
        tags: editingArticle.tags,
        read_time: editingArticle.read_time,
        is_headline: editingArticle.is_headline,
      });
    } else {
      form.reset({
        title: "",
        title_id: "",
        excerpt: "",
        excerpt_id: "",
        content: "",
        content_id: "",
        image_url: "",
        date_published: new Date().toISOString().split("T")[0],
        author_id: 0,
        category_id: 0,
        tags: [],
        read_time: 1,
        is_headline: false,
      });
    }
  }, [editingArticle, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "news",
      });
      form.setValue("image_url", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  const addTag = () => {
    if (tagInputEN.trim()) {
      const current = form.getValues("tags") || [];
      if (!current.includes(tagInputEN.trim())) {
        form.setValue("tags", [...current, tagInputEN.trim()]);
      }
      setTagInputEN("");
    }
  };

  const removeTag = (index: number) => {
    const current = form.getValues("tags") || [];
    form.setValue(
      "tags",
      current.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (data: NewsForm) => {
    // Convert date back to ISO string for API
    const submissionData = {
      ...data,
      date_published: new Date(data.date_published).toISOString(),
    };
    await onSubmit(submissionData);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingArticle ? "Edit" : "Add"} News Article
          </DialogTitle>
          <DialogDescription>
            {editingArticle ? "Update" : "Create a new"} news article
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (EN)</FormLabel>
                      <FormControl>
                        <Input placeholder="News title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="Judul berita" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Brief summary of the article"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt (ID)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Ringkasan singkat artikel"
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
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={8}
                          placeholder="Markdown supported - full article content"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Supports Markdown formatting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content (ID)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={8}
                          placeholder="Markdown didukung - konten artikel lengkap"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mendukung format Markdown
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Featured Image</FormLabel>
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadFile.isPending}
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadFile.isPending ? "Uploading..." : "Upload Image"}
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {form.watch("image_url") && (
                  <img
                    src={form.watch("image_url")}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Or paste image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="date_published"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publication Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="read_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_headline"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 pt-8">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Headline Article</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="author_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value ? Number(value) : 0)
                        }
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {authorsLoading ? (
                            <SelectItem value="" disabled>
                              Loading authors...
                            </SelectItem>
                          ) : authorsError ? (
                            <SelectItem value="" disabled>
                              Error loading authors
                            </SelectItem>
                          ) : authors && authors.length > 0 ? (
                            authors.map((author) => (
                              <SelectItem
                                key={author.id}
                                value={String(author.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={
                                      author.avatar || "/api/placeholder/24/24"
                                    }
                                    alt={author.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  {author.name}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              No authors available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value ? Number(value) : 0)
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
                                {category.name}
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
              </div>

              <div className="space-y-2">
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={tagInputEN}
                    onChange={(e) => setTagInputEN(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.watch("tags") || []).map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(i)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploadFile.isPending}>
                  {editingArticle ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
