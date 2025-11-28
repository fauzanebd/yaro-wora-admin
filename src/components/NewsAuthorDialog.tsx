import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NewsAuthor } from "@/types/api";
import {
  newsAuthorFormSchema,
  type NewsAuthorForm,
} from "@/types/news-author-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Upload } from "lucide-react";
import { useUploadFile } from "@/hooks/useApi";

interface NewsAuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: NewsAuthor | null;
  onSubmit: (data: NewsAuthorForm) => Promise<void>;
  trigger?: React.ReactNode;
  title?: string;
}

export default function NewsAuthorDialog({
  open,
  onOpenChange,
  author,
  onSubmit,
  trigger,
  title = "News Author",
}: NewsAuthorDialogProps) {
  const uploadFile = useUploadFile();

  const form = useForm<NewsAuthorForm>({
    resolver: zodResolver(newsAuthorFormSchema),
    defaultValues: {
      name: author?.name ?? "",
      avatar: author?.avatar ?? "",
    },
  });

  React.useEffect(() => {
    if (author) {
      form.reset({
        name: author.name,
        avatar: author.avatar || "",
      });
    } else {
      form.reset({
        name: "",
        avatar: "",
      });
    }
  }, [author, form]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "news-authors",
      });
      form.setValue("avatar", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload avatar");
    }
  };

  const handleSubmit = async (data: NewsAuthorForm) => {
    await onSubmit(data);
  };

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Add or edit news author information
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Avatar</FormLabel>
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
                      {uploadFile.isPending ? "Uploading..." : "Upload Avatar"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {form.watch("avatar") && (
                <div className="flex items-center gap-3">
                  <img
                    src={form.watch("avatar")}
                    alt="Avatar Preview"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    Avatar preview
                  </span>
                </div>
              )}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Or paste avatar URL (https://...)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Profile image for the author
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploadFile.isPending}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
