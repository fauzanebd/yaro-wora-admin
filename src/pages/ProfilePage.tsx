import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProfile, useUpdateProfile } from "@/hooks/api/profile";
import { useUploadFile } from "@/hooks/useApi";
import { useBeforeUnload } from "@/hooks/use-before-unload";
import type { ProfilePageContent, ProfileSection } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Edit,
  Plus,
  Minus,
  Image as ImageIcon,
  ExternalLink,
  Upload,
  Info,
} from "lucide-react";
import ProfileSectionEditDialog from "@/components/ProfileSectionEditDialog";

const profileSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_id: z.string().min(1, "Indonesian title is required"),
  header_image_url: z.url("Must be a valid URL"),
  subtitle: z.string().min(1, "Subtitle is required"),
  subtitle_id: z.string().min(1, "Indonesian subtitle is required"),
  brief_section_title: z.string().min(1, "Brief section title is required"),
  brief_section_title_id: z
    .string()
    .min(1, "Indonesian brief section title is required"),
  brief_section_content: z.string().min(1, "Brief section content is required"),
  brief_section_content_id: z
    .string()
    .min(1, "Indonesian brief section content is required"),
  brief_section_image_url: z.url("Must be a valid URL").or(z.literal("")),
  cta_section_title: z.string().min(1, "CTA section title is required"),
  cta_section_title_id: z
    .string()
    .min(1, "Indonesian CTA section title is required"),
  cta_section_text: z.string().min(1, "CTA section text is required"),
  cta_section_text_id: z
    .string()
    .min(1, "Indonesian CTA section text is required"),
  cta_section_button_text: z.string().min(1, "CTA button text is required"),
  cta_section_button_text_id: z
    .string()
    .min(1, "Indonesian CTA button text is required"),
  cta_section_button_url: z.url("Must be a valid URL"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  // Dialog states
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(
    null
  );
  const [profileSections, setProfileSections] = useState<ProfileSection[]>([]);
  const [initialSections, setInitialSections] = useState<ProfileSection[]>([]);

  // Query hooks
  const { data: profile, isLoading, error } = useProfile();

  // Mutation hooks
  const updateProfile = useUpdateProfile();
  const uploadFile = useUploadFile();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: "",
      title_id: "",
      header_image_url: "",
      subtitle: "",
      subtitle_id: "",
      brief_section_title: "",
      brief_section_title_id: "",
      brief_section_content: "",
      brief_section_content_id: "",
      brief_section_image_url: "",
      cta_section_title: "",
      cta_section_title_id: "",
      cta_section_text: "",
      cta_section_text_id: "",
      cta_section_button_text: "",
      cta_section_button_text_id: "",
      cta_section_button_url: "",
    },
  });

  // Update form when profile data is loaded
  React.useEffect(() => {
    if (profile && !error) {
      form.reset({
        title: profile.title,
        title_id: profile.title_id,
        header_image_url: profile.header_image_url,
        subtitle: profile.subtitle,
        subtitle_id: profile.subtitle_id,
        brief_section_title: profile.brief_section_title,
        brief_section_title_id: profile.brief_section_title_id,
        brief_section_content: profile.brief_section_content,
        brief_section_content_id: profile.brief_section_content_id,
        brief_section_image_url: profile.brief_section_image_url || "",
        cta_section_title: profile.cta_section_title,
        cta_section_title_id: profile.cta_section_title_id,
        cta_section_text: profile.cta_section_text,
        cta_section_text_id: profile.cta_section_text_id,
        cta_section_button_text: profile.cta_section_button_text,
        cta_section_button_text_id: profile.cta_section_button_text_id,
        cta_section_button_url: profile.cta_section_button_url,
      });
      setProfileSections(profile.profile_sections || []);
      setInitialSections(profile.profile_sections || []);
    }
  }, [profile, error, form]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      const submissionData: ProfilePageContent = {
        ...data,
        brief_section_image_url: data.brief_section_image_url || undefined,
        profile_sections: profileSections,
      } as ProfilePageContent;

      await updateProfile.mutateAsync(submissionData);
      // Mark current state as saved
      form.reset(form.getValues());
      setInitialSections(profileSections);
      alert(
        !hasProfileData
          ? "Profile created successfully!"
          : "Profile updated successfully!"
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    }
  };

  // Detect unsaved changes
  const isFormDirty = form.formState.isDirty;
  const isSectionsDirty = React.useMemo(() => {
    return JSON.stringify(profileSections) !== JSON.stringify(initialSections);
  }, [profileSections, initialSections]);

  // Block page reload/close if there are unsaved changes
  useBeforeUnload(isFormDirty || isSectionsDirty);

  const handleHeaderImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "profile-header",
      });
      form.setValue("header_image_url", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload header image");
    }
  };

  const handleBriefImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile.mutateAsync({
        file,
        folder: "profile-brief",
      });
      form.setValue("brief_section_image_url", result.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload brief section image");
    }
  };

  const handleAddSection = () => {
    setEditingSectionIndex(null);
    setIsSectionDialogOpen(true);
  };

  const handleEditSection = (index: number) => {
    setEditingSectionIndex(index);
    setIsSectionDialogOpen(true);
  };

  const handleRemoveSection = (index: number) => {
    setProfileSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSectionSubmit = (data: ProfileSection) => {
    if (editingSectionIndex !== null) {
      // Edit existing section
      setProfileSections((prev) =>
        prev.map((section, i) => (i === editingSectionIndex ? data : section))
      );
    } else {
      // Add new section
      setProfileSections((prev) => [...prev, data]);
    }
    setIsSectionDialogOpen(false);
    setEditingSectionIndex(null);
  };

  // Check if it's a 404 error (no profile data exists yet)
  const isProfileNotFound = error && (error as any)?.status === 404;
  const hasProfileData = profile && !error;

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error && !isProfileNotFound ? (
        <div className="text-center py-8">
          <p className="text-destructive font-medium mb-2">
            Failed to load profile data
          </p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Village Profile</h1>
            <p className="text-muted-foreground">
              Manage village profile page content including header, sections,
              and call-to-action
            </p>
            {isProfileNotFound && (
              <p className="text-sm text-yellow-600 mt-2">
                No profile data found. Fill in the forms below to create the
                village profile.
              </p>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Header Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Header Section
                  </CardTitle>
                  {!hasProfileData && (
                    <p className="text-sm text-muted-foreground">
                      No header content found. Fill in the form below to add
                      header content.
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (English)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Welcome to Yaro Wora"
                              {...field}
                            />
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
                          <FormLabel>Title (Indonesian)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Selamat Datang di Yaro Wora"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FormLabel>Header Image</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supported formats: JPG, PNG, WEBP</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
                            {uploadFile.isPending
                              ? "Uploading..."
                              : "Upload Header Image"}
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleHeaderImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {form.watch("header_image_url") && (
                      <img
                        src={form.watch("header_image_url")}
                        alt="Header Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="header_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Or paste header image URL (https://example.com/header-image.jpg)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Main header image for the profile page
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtitle (English)</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Brief description..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subtitle_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtitle (Indonesian)</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Deskripsi singkat..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Brief Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Brief Section</CardTitle>
                  {!hasProfileData && (
                    <p className="text-sm text-muted-foreground">
                      No brief section content found. Fill in the form below to
                      add brief section content.
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brief_section_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title (English)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., About Our Village"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brief_section_title_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title (Indonesian)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Tentang Desa Kami"
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
                      name="brief_section_content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Content (English)</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Brief description of the village..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Brief content for the section (supports markdown)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brief_section_content_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Content (Indonesian)</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Deskripsi singkat desa..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Konten singkat untuk bagian ini (mendukung markdown)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FormLabel>Brief Section Image (Optional)</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supported formats: JPG, PNG, WEBP</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
                            {uploadFile.isPending
                              ? "Uploading..."
                              : "Upload Brief Image"}
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleBriefImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {form.watch("brief_section_image_url") && (
                      <img
                        src={form.watch("brief_section_image_url")}
                        alt="Brief Section Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="brief_section_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Or paste brief section image URL (https://example.com/brief-image.jpg)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional image for the brief section
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Dynamic Profile Sections */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Profile Sections</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Dynamic sections with markdown content (e.g., History,
                        Culture, Geography)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSection}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {profileSections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {!hasProfileData
                        ? 'No profile sections found. Click "Add Section" to create your first section.'
                        : 'No sections added yet. Click "Add Section" to create your first section.'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profileSections.map((section, index) => (
                        <Card
                          key={index}
                          className="border-l-4 border-l-blue-500"
                        >
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-4">
                                  {section.image_url && (
                                    <div className="w-16 h-16 flex-shrink-0">
                                      <img
                                        src={section.image_url}
                                        alt={section.title}
                                        className="w-full h-full object-cover rounded-md"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-lg mb-1">
                                      {section.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {section.title_id}
                                    </p>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        <span className="font-medium">EN:</span>{" "}
                                        {section.content.substring(0, 100)}
                                        {section.content.length > 100 && "..."}
                                      </p>
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        <span className="font-medium">ID:</span>{" "}
                                        {section.content_id.substring(0, 100)}
                                        {section.content_id.length > 100 &&
                                          "..."}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditSection(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveSection(index)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Call-to-Action Section
                  </CardTitle>
                  {!hasProfileData && (
                    <p className="text-sm text-muted-foreground">
                      No CTA section content found. Fill in the form below to
                      add call-to-action content.
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cta_section_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Title (English)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Plan Your Visit"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cta_section_title_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Title (Indonesian)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Rencanakan Kunjungan Anda"
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
                      name="cta_section_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Text (English)</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Ready to explore our village?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cta_section_text_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CTA Text (Indonesian)</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Siap menjelajahi desa kami?"
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
                      name="cta_section_button_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Learn More" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cta_section_button_text_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Text (Indonesian)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Pelajari Lebih Lanjut"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="cta_section_button_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/contact"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL that the CTA button will navigate to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending
                    ? "Saving..."
                    : !hasProfileData
                    ? "Create Profile"
                    : "Save Profile"}
                </Button>
              </div>
            </form>
          </Form>

          {/* Profile Section Edit Dialog */}
          <ProfileSectionEditDialog
            open={isSectionDialogOpen}
            onOpenChange={setIsSectionDialogOpen}
            section={
              editingSectionIndex !== null
                ? profileSections[editingSectionIndex]
                : null
            }
            onSubmit={handleSectionSubmit}
            title={
              editingSectionIndex !== null
                ? "Edit Profile Section"
                : "Add Profile Section"
            }
          />
        </div>
      )}
    </>
  );
}
