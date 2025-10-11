import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ContactInfo, SocialMedia } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, ExternalLink } from "lucide-react";
import SocialMediaDialog from "@/components/SocialMediaDialog";

const contactInfoSchema = z.object({
  address_part_1: z.string().min(1, "Address part 1 is required"),
  address_part_1_id: z
    .string()
    .min(1, "Address part 1 (Indonesian) is required"),
  address_part_2: z.string().min(1, "Address part 2 is required"),
  address_part_2_id: z
    .string()
    .min(1, "Address part 2 (Indonesian) is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phones: z.array(
    z.object({ value: z.string().min(1, "Phone number is required") })
  ),
  emails: z.array(
    z.object({ value: z.string().email("Must be a valid email") })
  ),
  social_media: z.array(
    z.object({
      name: z.string(),
      handle: z.string(),
      url: z.string(),
      icon_url: z.string(),
    })
  ),
  plan_your_visit_url: z.string().url("Must be a valid URL").or(z.literal("")),
});

type ContactInfoForm = z.infer<typeof contactInfoSchema>;

interface ContactInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactInfo: ContactInfo | null;
  onSubmit: (data: ContactInfo) => Promise<void>;
  trigger?: React.ReactNode;
}

export default function ContactInfoDialog({
  open,
  onOpenChange,
  contactInfo,
  onSubmit,
  trigger,
}: ContactInfoDialogProps) {
  const [socialMediaDialogOpen, setSocialMediaDialogOpen] = useState(false);
  const [editingSocialMediaIndex, setEditingSocialMediaIndex] = useState<
    number | null
  >(null);

  const form = useForm<ContactInfoForm>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      address_part_1: contactInfo?.address_part_1 ?? "",
      address_part_1_id: contactInfo?.address_part_1_id ?? "",
      address_part_2: contactInfo?.address_part_2 ?? "",
      address_part_2_id: contactInfo?.address_part_2_id ?? "",
      latitude: contactInfo?.latitude ?? 0,
      longitude: contactInfo?.longitude ?? 0,
      phones: contactInfo?.phones?.map((phone) => ({ value: phone })) ?? [],
      emails: contactInfo?.emails?.map((email) => ({ value: email })) ?? [],
      social_media: contactInfo?.social_media ?? [],
      plan_your_visit_url: contactInfo?.plan_your_visit_url ?? "",
    },
  });

  const phonesFieldArray = useFieldArray({
    control: form.control,
    name: "phones",
  });

  const emailsFieldArray = useFieldArray({
    control: form.control,
    name: "emails",
  });

  const socialMediaFieldArray = useFieldArray({
    control: form.control,
    name: "social_media",
  });

  // Reset form when contactInfo changes
  React.useEffect(() => {
    if (contactInfo) {
      form.reset({
        address_part_1: contactInfo.address_part_1,
        address_part_1_id: contactInfo.address_part_1_id,
        address_part_2: contactInfo.address_part_2,
        address_part_2_id: contactInfo.address_part_2_id,
        latitude: contactInfo.latitude,
        longitude: contactInfo.longitude,
        phones: contactInfo.phones?.map((phone) => ({ value: phone })) || [],
        emails: contactInfo.emails?.map((email) => ({ value: email })) || [],
        social_media: contactInfo.social_media || [],
        plan_your_visit_url: contactInfo.plan_your_visit_url || "",
      });
    } else {
      form.reset({
        address_part_1: "",
        address_part_1_id: "",
        address_part_2: "",
        address_part_2_id: "",
        latitude: 0,
        longitude: 0,
        phones: [],
        emails: [],
        social_media: [],
        plan_your_visit_url: "",
      });
    }
  }, [contactInfo, form]);

  const handleSubmit = async (data: ContactInfoForm) => {
    // Transform the form data back to the expected API format
    const transformedData = {
      ...data,
      phones: data.phones.map((phone) => phone.value),
      emails: data.emails.map((email) => email.value),
    };
    await onSubmit(transformedData);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  const handleAddSocialMedia = (data: SocialMedia) => {
    if (editingSocialMediaIndex !== null) {
      // Edit existing
      socialMediaFieldArray.update(editingSocialMediaIndex, data);
    } else {
      // Add new
      socialMediaFieldArray.append(data);
    }
    setSocialMediaDialogOpen(false);
    setEditingSocialMediaIndex(null);
  };

  const handleEditSocialMedia = (index: number) => {
    setEditingSocialMediaIndex(index);
    setSocialMediaDialogOpen(true);
  };

  const handleRemoveSocialMedia = (index: number) => {
    socialMediaFieldArray.remove(index);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription>
              Update contact details displayed on the website
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 pr-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address_part_1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Part 1 (English)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Yaro Wora Village"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address_part_1_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Part 1 (Indonesian)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Desa Yaro Wora"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address_part_2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Part 2 (English)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., East Sumba, NTT"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address_part_2_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Part 2 (Indonesian)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Sumba Timur, NTT"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Coordinates Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Coordinates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="e.g., -9.6234"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="e.g., 119.3456"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Phone Numbers Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Phone Numbers</h3>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        phonesFieldArray.append({ value: "" });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Phone
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {phonesFieldArray.fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`phones.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="e.g., +62 098 940 974"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => phonesFieldArray.remove(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {phonesFieldArray.fields.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No phone numbers added
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Addresses Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Email Addresses</h3>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        emailsFieldArray.append({ value: "" });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Email
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {emailsFieldArray.fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`emails.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="e.g., info@yarowora.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => emailsFieldArray.remove(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {emailsFieldArray.fields.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No email addresses added
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Social Media</h3>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setEditingSocialMediaIndex(null);
                        setSocialMediaDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Social Media
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {socialMediaFieldArray.fields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="flex items-center gap-3 p-4">
                          <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-md">
                            <img
                              src={field.icon_url}
                              alt={field.name}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{field.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {field.handle}
                            </p>
                            <a
                              href={field.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {field.url}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditSocialMedia(index)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveSocialMedia(index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {socialMediaFieldArray.fields.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No social media platforms added
                      </p>
                    )}
                  </div>
                </div>

                {/* Plan Your Visit URL Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Plan Your Visit URL (Optional)
                  </h3>
                  <FormField
                    control={form.control}
                    name="plan_your_visit_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="https://someurl.com" {...field} />
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
                  <Button type="submit">Update Contact Info</Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <SocialMediaDialog
        open={socialMediaDialogOpen}
        onOpenChange={setSocialMediaDialogOpen}
        editingSocialMedia={
          editingSocialMediaIndex !== null
            ? socialMediaFieldArray.fields[editingSocialMediaIndex]
            : null
        }
        onSubmit={handleAddSocialMedia}
      />
    </>
  );
}
